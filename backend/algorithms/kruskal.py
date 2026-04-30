"""Kruskal's algorithm for minimum spanning tree construction.

This module builds an infrastructure network MST using a Union-Find data
structure. Road weights are adjusted so that connections touching high-
population neighborhoods or critical facilities are prioritized with lower
effective weight.

Time complexity: O(E log E) due to edge sorting, with near-constant Union-Find
operations.
Space complexity: O(V + E) for the edge list, parent/rank arrays, and result.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple, Union

from backend.data.cairo_data import (
    FACILITIES,
    EXISTING_ROADS,
    NODES,
    NODE_BY_ID,
    POTENTIAL_NEW_ROADS,
    ROAD_INDEX,
    NodeId,
    RoadId,
    normalize_road_id,
)

CRITICAL_FACILITY_TYPES = {"Airport", "Transit Hub", "Medical", "Government"}
HOSPITAL_NAMES = {"Qasr El Aini Hospital", "Maadi Military Hospital"}


@dataclass(frozen=True)
class WeightedEdge:
    """Internal edge representation used by the MST solver."""

    road_id: RoadId
    source: NodeId
    target: NodeId
    base_weight: float
    adjusted_weight: float
    is_new_road: bool
    road_data: Dict[str, Any]


class UnionFind:
    """Disjoint-set structure with path compression and union by rank."""

    def __init__(self, items: Iterable[NodeId]) -> None:
        self.parent: Dict[NodeId, NodeId] = {item: item for item in items}
        self.rank: Dict[NodeId, int] = {item: 0 for item in items}

    def find(self, item: NodeId) -> NodeId:
        """Return the canonical representative for an item."""

        if self.parent[item] != item:
            self.parent[item] = self.find(self.parent[item])
        return self.parent[item]

    def union(self, left: NodeId, right: NodeId) -> bool:
        """Merge two sets. Returns True if a merge occurred."""

        root_left = self.find(left)
        root_right = self.find(right)
        if root_left == root_right:
            return False
        if self.rank[root_left] < self.rank[root_right]:
            self.parent[root_left] = root_right
        elif self.rank[root_left] > self.rank[root_right]:
            self.parent[root_right] = root_left
        else:
            self.parent[root_right] = root_left
            self.rank[root_left] += 1
        return True


def _node_priority(node_id: NodeId) -> float:
    """Higher scores reduce effective edge weight."""

    node = NODE_BY_ID[node_id]
    population = float(node.get("population", 0)) if isinstance(node_id, int) else 0.0
    node_type = node.get("type", "")
    score = population / 100000.0
    if node_type in CRITICAL_FACILITY_TYPES:
        score += 4.0
    if node.get("name") in HOSPITAL_NAMES:
        score += 5.0
    if node_type == "Medical":
        score += 5.0
    if node_type == "Airport":
        score += 3.0
    return score


def _edge_weight_from_data(road_data: Dict[str, Any]) -> float:
    """Compute the adjusted MST weight for a road record."""

    source = road_data["from"]
    target = road_data["to"]
    if "cost_million_egp" in road_data:
        base_weight = float(road_data["cost_million_egp"])
    else:
        base_weight = float(road_data["distance_km"])

    source_priority = _node_priority(source)
    target_priority = _node_priority(target)
    priority_boost = 1.0 + (source_priority + target_priority) / 20.0
    adjusted = base_weight / priority_boost

    if source in HOSPITAL_NAMES or target in HOSPITAL_NAMES:
        adjusted *= 0.85
    if NODE_BY_ID[source].get("type") == "Medical" or NODE_BY_ID[target].get("type") == "Medical":
        adjusted *= 0.90
    if NODE_BY_ID[source].get("type") == "Government" or NODE_BY_ID[target].get("type") == "Government":
        adjusted *= 0.92

    return adjusted


def _build_weighted_edges(include_new: bool = True) -> List[WeightedEdge]:
    """Convert road records into sortable weighted edges."""

    road_sources: List[Tuple[Dict[str, Any], bool]] = [(road, False) for road in EXISTING_ROADS]
    if include_new:
        road_sources.extend((road, True) for road in POTENTIAL_NEW_ROADS)

    weighted_edges: List[WeightedEdge] = []
    for road_data, is_new in road_sources:
        road_id = normalize_road_id(road_data["from"], road_data["to"])
        weighted_edges.append(
            WeightedEdge(
                road_id=road_id,
                source=road_data["from"],
                target=road_data["to"],
                base_weight=float(road_data.get("cost_million_egp", road_data["distance_km"])),
                adjusted_weight=_edge_weight_from_data(road_data),
                is_new_road=is_new,
                road_data=road_data,
            )
        )
    weighted_edges.sort(key=lambda edge: (edge.adjusted_weight, edge.base_weight, edge.road_id))
    return weighted_edges


def kruskal_mst(include_new: bool = True) -> Dict[str, Any]:
    """Compute the minimum spanning tree using Kruskal's algorithm."""

    nodes: List[NodeId] = [node["id"] for node in NODES]
    union_find = UnionFind(nodes)
    mst_edges: List[Dict[str, Any]] = []
    total_cost = 0.0
    selected_new_roads: List[Dict[str, Any]] = []
    inspected_edges: List[Dict[str, Any]] = []

    for edge in _build_weighted_edges(include_new=include_new):
        inspected_edges.append(
            {
                "road_id": edge.road_id,
                "from": edge.source,
                "to": edge.target,
                "base_weight": edge.base_weight,
                "adjusted_weight": round(edge.adjusted_weight, 4),
                "is_new_road": edge.is_new_road,
            }
        )
        if union_find.union(edge.source, edge.target):
            selected_edge = {
                "road_id": edge.road_id,
                "from": edge.source,
                "to": edge.target,
                "base_weight": edge.base_weight,
                "adjusted_weight": round(edge.adjusted_weight, 4),
                "is_new_road": edge.is_new_road,
                "road": edge.road_data,
            }
            mst_edges.append(selected_edge)
            total_cost += edge.base_weight
            if edge.is_new_road:
                selected_new_roads.append(edge.road_data)
        if len(mst_edges) == len(nodes) - 1:
            break

    connected_components = len({union_find.find(node) for node in nodes})

    return {
        "algorithm": "kruskal",
        "include_new": include_new,
        "result": {
            "mst_edges": mst_edges,
            "total_cost": round(total_cost, 4),
            "selected_new_roads": selected_new_roads,
            "inspected_edges": inspected_edges,
            "connected_components": connected_components,
            "node_count": len(nodes),
        },
        "complexity": {"time": "O(E log E)", "space": "O(V + E)"},
    }


def mst_preview(include_new: bool = True) -> List[Dict[str, Any]]:
    """Return the ordered edge preview used by the MST visualization."""

    return [
        {
            "road_id": edge.road_id,
            "from": edge.source,
            "to": edge.target,
            "base_weight": edge.base_weight,
            "adjusted_weight": round(edge.adjusted_weight, 4),
            "is_new_road": edge.is_new_road,
        }
        for edge in _build_weighted_edges(include_new=include_new)
    ]
