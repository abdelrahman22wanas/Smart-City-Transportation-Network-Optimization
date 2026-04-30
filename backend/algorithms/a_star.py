"""A* search for route planning and emergency routing.

This module finds a shortest path using a Euclidean-distance heuristic derived
from node coordinates. It is intended for emergency routing where the search
should be more directed than plain Dijkstra while still remaining optimal for
admissible heuristics.

Time complexity: O(E log V) in the worst case with a binary heap.
Space complexity: O(V + E) for graph storage, heuristic bookkeeping, and path reconstruction.
"""

from __future__ import annotations

import heapq
from functools import lru_cache
from math import sqrt
from typing import Any, Dict, List, Optional, Tuple, Union

from backend.data.cairo_data import EXISTING_ROADS, NODES, NODE_BY_ID, NodeId, normalize_road_id


def _build_adjacency() -> Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]]:
    """Build an undirected adjacency list using road distances."""

    adjacency: Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]] = {node["id"]: [] for node in NODES}
    for road in EXISTING_ROADS:
        source = road["from"]
        target = road["to"]
        weight = float(road["distance_km"])
        adjacency[source].append((target, weight, road))
        adjacency[target].append((source, weight, road))
    return adjacency


def _heuristic(left: NodeId, right: NodeId) -> float:
    """Euclidean distance between node coordinates."""

    left_node = NODE_BY_ID[left]
    right_node = NODE_BY_ID[right]
    return sqrt((float(left_node["x"]) - float(right_node["x"])) ** 2 + (float(left_node["y"]) - float(right_node["y"])) ** 2)


def _reconstruct_path(previous: Dict[NodeId, NodeId], source: NodeId, target: NodeId) -> List[NodeId]:
    """Rebuild the final path from predecessor pointers."""

    if source == target:
        return [source]
    path: List[NodeId] = []
    current: Optional[NodeId] = target
    while current is not None and current in previous:
        path.append(current)
        current = previous.get(current)
    if current == source:
        path.append(source)
        path.reverse()
        return path
    return []


@lru_cache(maxsize=512)
def _a_star_cached(source: NodeId, target: NodeId) -> Tuple[float, Tuple[NodeId, ...], Tuple[NodeId, ...], Tuple[Tuple[str, NodeId, NodeId, float], ...]]:
    """Compute and cache the A* path result."""

    adjacency = _build_adjacency()
    g_score: Dict[NodeId, float] = {node["id"]: float("inf") for node in NODES}
    f_score: Dict[NodeId, float] = {node["id"]: float("inf") for node in NODES}
    previous: Dict[NodeId, NodeId] = {}
    visited_order: List[NodeId] = []
    edge_trace: List[Tuple[str, NodeId, NodeId, float]] = []

    g_score[source] = 0.0
    f_score[source] = _heuristic(source, target)
    heap: List[Tuple[float, float, NodeId]] = [(f_score[source], 0.0, source)]
    closed: set[NodeId] = set()

    while heap:
        _, current_g, current_node = heapq.heappop(heap)
        if current_node in closed:
            continue
        closed.add(current_node)
        visited_order.append(current_node)
        if current_node == target:
            break

        for neighbor, weight, road in adjacency[current_node]:
            tentative_g = current_g + weight
            if tentative_g < g_score[neighbor]:
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + _heuristic(neighbor, target)
                previous[neighbor] = current_node
                heapq.heappush(heap, (f_score[neighbor], tentative_g, neighbor))

    path = _reconstruct_path(previous, source, target)
    if path:
        for left, right in zip(path, path[1:]):
            road_id = normalize_road_id(left, right)
            edge_trace.append((road_id, left, right, round(g_score[right] - g_score[left], 4)))

    return g_score[target], tuple(path), tuple(visited_order), tuple(edge_trace)


def a_star_path(source: NodeId, target: NodeId) -> Dict[str, Any]:
    """Return the shortest path between two nodes using A* search."""

    total_distance, path, visited_order, edge_trace = _a_star_cached(source, target)
    return {
        "algorithm": "a_star",
        "result": {
            "source": source,
            "target": target,
            "path": list(path),
            "visited_nodes": list(visited_order),
            "edges": [
                {
                    "road_id": road_id,
                    "from": left,
                    "to": right,
                    "segment_distance_km": distance,
                }
                for road_id, left, right, distance in edge_trace
            ],
            "total_distance_km": None if total_distance == float("inf") else round(total_distance, 4),
            "reachable": total_distance != float("inf"),
        },
        "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
    }
