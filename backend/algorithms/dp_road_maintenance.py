"""Dynamic programming for road maintenance planning.

This module selects a subset of existing roads to repair under a fixed budget.
Because the source dataset provides road condition but not repair cost, the model
uses a deterministic derived repair-cost estimate based on distance and condition.
The objective is to maximize total condition improvement within budget.

Time complexity: O(N * B) where N is the number of candidate roads and B is the budget.
Space complexity: O(B) for the optimized rolling-array DP approach.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

from backend.data.cairo_data import EXISTING_ROADS


def _candidate_roads() -> List[Dict[str, Any]]:
    """Return roads in a stable order for dynamic programming."""

    return sorted(EXISTING_ROADS, key=lambda road: (str(road["from"]), str(road["to"])))


def _repair_cost_million_egp(road: Dict[str, Any]) -> int:
    """Estimate repair cost in million EGP from distance and condition."""

    distance = float(road["distance_km"])
    condition = int(road["condition"])
    degradation_factor = max(1, 11 - condition)
    return int(round(distance * degradation_factor * 4.0))


def _repair_value(road: Dict[str, Any]) -> int:
    """Compute the condition-improvement value for a road."""

    distance = float(road["distance_km"])
    condition = int(road["condition"])
    improvement = max(0, 10 - condition)
    return int(round(improvement * distance * 10))


def _solve_road_dp(budget: int) -> Tuple[int, Tuple[int, ...]]:
    """Compute the DP solution and selected road indices.
    
    Uses space-optimized approach with rolling array to reduce memory from
    O(N*B) to O(B) for the DP array while maintaining correctness.
    """

    roads = _candidate_roads()
    road_count = len(roads)
    
    prev = [0] * (budget + 1)
    selected_indices: List[int] = []
    
    keep_info: List[List[bool]] = []
    for i in range(road_count):
        road = roads[i]
        weight = _repair_cost_million_egp(road)
        value = _repair_value(road)
        keep_row = [False] * (budget + 1)
        curr = prev[:]
        
        for current_budget in range(budget, weight - 1, -1):
            with_road = value + prev[current_budget - weight]
            if with_road > curr[current_budget]:
                curr[current_budget] = with_road
                keep_row[current_budget] = True
        
        keep_info.append(keep_row)
        prev = curr
    
    current_budget = budget
    for i in range(road_count - 1, -1, -1):
        if keep_info[i][current_budget]:
            selected_indices.append(i)
            current_budget -= _repair_cost_million_egp(roads[i])
    selected_indices.reverse()

    return prev[budget], tuple(selected_indices)


def solve_road_maintenance(budget: int = 500) -> Dict[str, Any]:
    """Optimize road repairs under a fixed budget using dynamic programming."""

    roads = _candidate_roads()
    max_value, selected_indices = _solve_road_dp(budget)
    selected_roads = []
    used_budget = 0
    total_value = 0

    for index in selected_indices:
        road = dict(roads[index])
        road["estimated_repair_cost_million_egp"] = _repair_cost_million_egp(road)
        road["condition_improvement_score"] = _repair_value(road)
        selected_roads.append(road)
        used_budget += road["estimated_repair_cost_million_egp"]
        total_value += road["condition_improvement_score"]

    return {
        "algorithm": "dp_road_maintenance",
        "result": {
            "budget_million_egp": budget,
            "used_budget_million_egp": used_budget,
            "remaining_budget_million_egp": budget - used_budget,
            "total_condition_improvement": total_value,
            "selected_roads": selected_roads,
        },
        "complexity": {"time": "O(N * B)", "space": "O(B)"},
    }
