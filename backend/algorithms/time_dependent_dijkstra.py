"""Time-dependent Dijkstra's algorithm for congestion-aware routing.

This module varies edge weights by time of day using the prompt's formula:
weight = distance x (1 + flow / capacity). It is suitable for traffic-aware
route planning where a single static shortest path is not enough.

Time complexity: O(E log V) with a binary heap.
Space complexity: O(V + E) for adjacency data, distance maps, and the reconstructed path.
"""

from __future__ import annotations

import heapq
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple, Union

from backend.data.cairo_data import EXISTING_ROADS, NODES, TRAFFIC_PATTERNS, NodeId, normalize_road_id


def _build_adjacency(time_of_day: str) -> Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]]:
    """Build an adjacency list with time-dependent weights."""

    adjacency: Dict[NodeId, List[Tuple[NodeId, float, Dict[str, Any]]]] = {node["id"]: [] for node in NODES}
    for road in EXISTING_ROADS:
        source = road["from"]
        target = road["to"]
        road_id = normalize_road_id(source, target)
        traffic = TRAFFIC_PATTERNS.get(road_id, {})
        flow = float(traffic.get(time_of_day, 0))
        capacity = float(road["capacity_veh_h"])
        distance = float(road["distance_km"])
        weight = distance * (1.0 + (flow / capacity if capacity else 0.0))
        adjacency[source].append((target, weight, road))
        adjacency[target].append((source, weight, road))
    return adjacency


def _reconstruct_path(previous: Dict[NodeId, NodeId], source: NodeId, target: NodeId) -> List[NodeId]:
    """Rebuild the shortest path from predecessor pointers."""

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
def _time_dependent_cached(source: NodeId, target: NodeId, time_of_day: str) -> Tuple[float, Tuple[NodeId, ...], Tuple[NodeId, ...], Tuple[Tuple[str, NodeId, NodeId, float], ...]]:
    """Compute and cache a time-dependent shortest path."""

    normalized_time = time_of_day.lower().strip()
    adjacency = _build_adjacency(normalized_time)
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
            flow = float(TRAFFIC_PATTERNS.get(road_id, {}).get(normalized_time, 0))
            road_record = next(
                (road for road in EXISTING_ROADS if normalize_road_id(road["from"], road["to"]) == road_id),
                None,
            )
            segment_distance = None
            if road_record is not None:
                capacity = float(road_record["capacity_veh_h"])
                distance = float(road_record["distance_km"])
                segment_distance = round(distance * (1.0 + (flow / capacity if capacity else 0.0)), 4)
            else:
                segment_distance = round(distances[right] - distances[left], 4)
            edge_trace.append((road_id, left, right, segment_distance))

    return distances[target], tuple(path), tuple(visited_order), tuple(edge_trace)


def time_dependent_shortest_path(source: NodeId, target: NodeId, time_of_day: str) -> Dict[str, Any]:
    """Return the shortest path using traffic-aware time-dependent edge weights."""

    total_distance, path, visited_order, edge_trace = _time_dependent_cached(source, target, time_of_day)
    return {
        "algorithm": "time_dependent_dijkstra",
        "result": {
            "source": source,
            "target": target,
            "time_of_day": time_of_day,
            "path": list(path),
            "visited_nodes": list(visited_order),
            "edges": [
                {
                    "road_id": road_id,
                    "from": left,
                    "to": right,
                    "segment_weight": distance,
                }
                for road_id, left, right, distance in edge_trace
            ],
            "total_weight": None if total_distance == float("inf") else round(total_distance, 4),
            "reachable": total_distance != float("inf"),
        },
        "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
    }
