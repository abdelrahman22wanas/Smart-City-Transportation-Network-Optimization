"""Prim's algorithm for minimum spanning tree construction.

This module computes an MST using a priority queue that grows one connected
component from a chosen start node. Road weights are adjusted so that edges
incident to high-population neighborhoods and critical facilities receive lower
priority values, matching the project's infrastructure preference.

Time complexity: O(E log V) with a binary heap.
Space complexity: O(V + E) for adjacency storage, heap entries, and output.
"""

from __future__ import annotations

import heapq
from typing import Any, Dict, List, Set, Tuple, Union

from backend.data.cairo_data import (
    EXISTING_ROADS,
    NODES,
    NODE_BY_ID,
    POTENTIAL_NEW_ROADS,
    NodeId,
    normalize_road_id,
)

CRITICAL_FACILITY_TYPES = {"Airport", "Transit Hub", "Medical", "Government"}
HOSPITAL_NAMES = {"Qasr El Aini Hospital", "Maadi Military Hospital"}


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


def _edge_weight(road_data: Dict[str, Any]) -> float:
    """Compute the adjusted Prim edge weight for a road record."""

    source = road_data["from"]
    target = road_data["to"]
    base_weight = float(road_data.get("cost_million_egp", road_data["distance_km"]))

    source_priority = _node_priority(source)
    target_priority = _node_priority(target)
    priority_boost = 1.0 + (source_priority + target_priority) / 20.0
    adjusted = base_weight / priority_boost

    if NODE_BY_ID[source].get("type") == "Medical" or NODE_BY_ID[target].get("type") == "Medical":
        adjusted *= 0.90
    if NODE_BY_ID[source].get("type") == "Government" or NODE_BY_ID[target].get("type") == "Government":
        adjusted *= 0.92

    return adjusted


def _build_adjacency(include_new: bool = True) -> Dict[NodeId, List[Tuple[float, NodeId, NodeId, Dict[str, Any], bool]]]:
    """Create an undirected adjacency list for all roads."""

    adjacency: Dict[NodeId, List[Tuple[float, NodeId, NodeId, Dict[str, Any], bool]]] = {
        node["id"]: [] for node in NODES
    }
    road_sources: List[Tuple[Dict[str, Any], bool]] = [(road, False) for road in EXISTING_ROADS]
    if include_new:
        road_sources.extend((road, True) for road in POTENTIAL_NEW_ROADS)

    for road_data, is_new in road_sources:
        source = road_data["from"]
        target = road_data["to"]
        weight = _edge_weight(road_data)
        adjacency[source].append((weight, source, target, road_data, is_new))
        adjacency[target].append((weight, target, source, road_data, is_new))

    return adjacency


def prim_mst(include_new: bool = True, start_node: NodeId | None = None) -> Dict[str, Any]:
    """Compute the minimum spanning tree using Prim's algorithm."""

    adjacency = _build_adjacency(include_new=include_new)
    nodes: List[NodeId] = [node["id"] for node in NODES]
    if not nodes:
        return {
            "algorithm": "prim",
            "include_new": include_new,
            "result": {"mst_edges": [], "total_cost": 0.0, "selected_new_roads": [], "visited_nodes": []},
            "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
        }

    if start_node is None:
        start_node = nodes[0]
    if start_node not in adjacency:
        raise ValueError(f"Unknown start node: {start_node}")

    visited: Set[NodeId] = set()
    mst_edges: List[Dict[str, Any]] = []
    selected_new_roads: List[Dict[str, Any]] = []
    visited_order: List[NodeId] = []
    total_cost = 0.0

    heap: List[Tuple[float, NodeId, NodeId, Dict[str, Any], bool]] = []

    def push_frontier(node_id: NodeId) -> None:
        visited.add(node_id)
        visited_order.append(node_id)
        for edge in adjacency[node_id]:
            _, edge_source, edge_target, _, _ = edge
            if edge_target not in visited:
                heapq.heappush(heap, edge)

    push_frontier(start_node)

    while heap and len(mst_edges) < len(nodes) - 1:
        weight, edge_source, edge_target, road_data, is_new = heapq.heappop(heap)
        if edge_target in visited:
            continue

        mst_edges.append(
            {
                "road_id": normalize_road_id(road_data["from"], road_data["to"]),
                "from": road_data["from"],
                "to": road_data["to"],
                "base_weight": float(road_data.get("cost_million_egp", road_data["distance_km"])),
                "adjusted_weight": round(weight, 4),
                "is_new_road": is_new,
                "road": road_data,
            }
        )
        total_cost += float(road_data.get("cost_million_egp", road_data["distance_km"]))
        if is_new:
            selected_new_roads.append(road_data)
        push_frontier(edge_target)

    return {
        "algorithm": "prim",
        "include_new": include_new,
        "result": {
            "mst_edges": mst_edges,
            "total_cost": round(total_cost, 4),
            "selected_new_roads": selected_new_roads,
            "visited_nodes": visited_order,
            "node_count": len(nodes),
        },
        "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
    }
