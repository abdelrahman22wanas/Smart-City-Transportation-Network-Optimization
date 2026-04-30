"""Greedy emergency vehicle preemption combined with A* routing.

This module identifies a path from an emergency start node to a hospital and
then greedily selects intersections along that path for signal preemption.
The path itself is computed with A* to keep routing efficient and optimal under
an admissible heuristic, while the preemption selection is local and greedy.

Time complexity: O(E log V) for the A* search plus O(P) for path post-processing.
Space complexity: O(V + E) for route data and path bookkeeping.
"""

from __future__ import annotations

from typing import Any, Dict, List

from backend.algorithms.a_star import a_star_path
from backend.data.cairo_data import NODE_BY_ID, NodeId

HOSPITAL_IDS = {"F9", "F10"}


def _node_severity(node_id: NodeId) -> float:
    """Estimate how strongly an intersection should be preempted."""

    node = NODE_BY_ID[node_id]
    population = float(node.get("population", 0)) if isinstance(node_id, int) else 0.0
    severity = population / 100000.0
    node_type = node.get("type", "")
    if node_type in {"Business", "Government", "Medical", "Transit Hub"}:
        severity += 3.0
    return severity


def emergency_preemption(start_node: NodeId, hospital_id: NodeId) -> Dict[str, Any]:
    """Return the route and the intersections that should receive green preemption."""

    if str(hospital_id) not in HOSPITAL_IDS:
        raise ValueError("hospital_id must be either 'F9' or 'F10'")

    route_result = a_star_path(start_node, hospital_id)
    route = route_result["result"]["path"]
    if not route:
        return {
            "algorithm": "greedy_emergency",
            "result": {
                "start_node": start_node,
                "hospital_id": hospital_id,
                "path": [],
                "preempted_intersections": [],
                "message": "No route found to the target hospital.",
            },
            "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
        }

    internal_nodes = [node_id for node_id in route[1:-1] if node_id in NODE_BY_ID]
    preempted = [
        {
            "node_id": node_id,
            "node_name": NODE_BY_ID[node_id]["name"],
            "severity": round(_node_severity(node_id), 4),
            "action": "preempt_signal",
        }
        for node_id in internal_nodes
    ]
    preempted.sort(key=lambda item: (-item["severity"], str(item["node_id"])))

    return {
        "algorithm": "greedy_emergency",
        "result": {
            "start_node": start_node,
            "hospital_id": hospital_id,
            "path": route,
            "route_analysis": route_result["result"],
            "preempted_intersections": preempted,
        },
        "complexity": {"time": "O(E log V)", "space": "O(V + E)"},
    }
