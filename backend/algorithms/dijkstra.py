"""Dijkstra's shortest path algorithm for route planning.

This module computes the minimum-distance path across the transportation graph
using a binary heap priority queue. It supports memoized repeated route
queries so the backend can serve frequent UI interactions efficiently.

Time complexity: O(E log V) with adjacency-list + heap implementation.
Space complexity: O(V + E) for the graph, distance maps, and reconstructed path.
"""

from __future__ import annotations

import heapq
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple, Union

from backend.data.cairo_data import EXISTING_ROADS, NODES, NodeId, normalize_road_id


def _build_adjacency(include_new: bool = False) -> Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]]:
    """Build an undirected adjacency list using road distances as weights."""

    adjacency: Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]] = {node["id"]: [] for node in NODES}
    for road in EXISTING_ROADS:
        source = road["from"]
        target = road["to"]
        weight = float(road["distance_km"])
        adjacency[source].append((target, weight, road))
        adjacency[target].append((source, weight, road))
    return adjacency


def _reconstruct_path(previous: Dict[NodeId, NodeId], source: NodeId, target: NodeId) -> List[NodeId]:
    """Rebuild the path from predecessor pointers."""

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
def _dijkstra_cached(source: NodeId, target: NodeId) -> Tuple[float, Tuple[NodeId, ...], Tuple[NodeId, ...], Tuple[Tuple[str, NodeId, NodeId, float], ...]]:
    """Compute and cache the shortest path result."""

    adjacency = _build_adjacency()
    distances: Dict[NodeId, float] = {node["id"]: float("inf") for node in NODES}
    previous: Dict[NodeId, NodeId] = {}
    visited_order: List[NodeId] = []
    edge_trace: List[Tuple[str, NodeId, NodeId, float]] = []

    distances[source] = 0.0
    heap: List[Tuple[float, NodeId]] = [(0.0, source)]
    seen: set[NodeId] = set()

    while heap:
        current_distance, current_node = heapq.heappop(heap)
        if current_node in seen:
            continue
        seen.add(current_node)
        visited_order.append(current_node)
        if current_node == target:
            break

        for neighbor, weight, road in adjacency[current_node]:
            candidate_distance = current_distance + weight
            if candidate_distance < distances[neighbor]:
                distances[neighbor] = candidate_distance
                previous[neighbor] = current_node
                heapq.heappush(heap, (candidate_distance, neighbor))

    path = _reconstruct_path(previous, source, target)
    if path:
        for left, right in zip(path, path[1:]):
            road_id = normalize_road_id(left, right)
            edge_trace.append((road_id, left, right, round(distances[right] - distances[left], 4)))

    return distances[target], tuple(path), tuple(visited_order), tuple(edge_trace)


def dijkstra_shortest_path(source: NodeId, target: NodeId) -> Dict[str, Any]:
    """Return the shortest path between two nodes using Dijkstra's algorithm."""

    total_distance, path, visited_order, edge_trace = _dijkstra_cached(source, target)
    return {
        "algorithm": "dijkstra",
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
