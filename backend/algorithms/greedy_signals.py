"""Greedy traffic signal prioritization.

This module assigns green-light priority at each intersection by greedily
ordering incident roads according to current traffic flow. It is a local,
myopic strategy that is fast and easy to visualize, but can be suboptimal when
global network spillovers matter.

Time complexity: O(V * d log d) where d is the average intersection degree.
Space complexity: O(V + E) for adjacency and per-node priority output.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

from backend.data.cairo_data import EXISTING_ROADS, NODES, TRAFFIC_PATTERNS, normalize_road_id


def _incident_roads_for_node(node_id: Any) -> List[Dict[str, Any]]:
    """Return all roads incident to a node."""

    incident: List[Dict[str, Any]] = []
    for road in EXISTING_ROADS:
        if road["from"] == node_id or road["to"] == node_id:
            road_id = normalize_road_id(road["from"], road["to"])
            incident.append({**road, "road_id": road_id})
    return incident


def optimize_traffic_signals(time_of_day: str = "morning") -> Dict[str, Any]:
    """Return greedy priority orders for every intersection node."""

    normalized_time = time_of_day.lower().strip()
    priorities: Dict[Any, List[Dict[str, Any]]] = {}
    summary: List[Dict[str, Any]] = []

    for node in NODES:
        node_id = node["id"]
        incident = _incident_roads_for_node(node_id)
        ranked = []
        for road in incident:
            road_id = road["road_id"]
            flow = int(TRAFFIC_PATTERNS.get(road_id, {}).get(normalized_time, 0))
            ranked.append(
                {
                    "road_id": road_id,
                    "from": road["from"],
                    "to": road["to"],
                    "flow": flow,
                    "priority_score": flow,
                }
            )
        ranked.sort(key=lambda item: (-item["priority_score"], str(item["road_id"])))
        priorities[node_id] = ranked
        summary.append(
            {
                "node_id": node_id,
                "node_name": node["name"],
                "incoming_roads": ranked,
                "best_green_lane": ranked[0] if ranked else None,
            }
        )

    return {
        "algorithm": "greedy_signals",
        "result": {
            "time_of_day": normalized_time,
            "signal_priorities": summary,
        },
        "complexity": {"time": "O(V * d log d)", "space": "O(V + E)"},
    }
