"""Dynamic programming for road maintenance planning.

This module selects a subset of existing roads to repair under a fixed budget.
Because the source dataset provides road condition but not repair cost, the model
uses a deterministic derived repair-cost estimate based on distance and condition.
The objective is to maximize total condition improvement within budget.

Time complexity: O(N * B) where N is the number of candidate roads and B is the budget.
Space complexity: O(N * B) for the DP table and reconstruction data.
"""

from __future__ import annotations

from functools import lru_cache
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


@lru_cache(maxsize=32)
def _solve_road_dp(budget: int) -> Tuple[Tuple[Tuple[int, ...], ...], Tuple[int, ...]]:
    """Compute the DP table and the selected road indices."""

    roads = _candidate_roads()
    road_count = len(roads)
    dp = [[0 for _ in range(budget + 1)] for _ in range(road_count + 1)]
    keep = [[False for _ in range(budget + 1)] for _ in range(road_count + 1)]

    for i in range(1, road_count + 1):
        road = roads[i - 1]
        weight = _repair_cost_million_egp(road)
        value = _repair_value(road)
        for current_budget in range(budget + 1):
            without_road = dp[i - 1][current_budget]
            with_road = -1
            if weight <= current_budget:
                with_road = value + dp[i - 1][current_budget - weight]
            if with_road > without_road:
                dp[i][current_budget] = with_road
                keep[i][current_budget] = True
            else:
                dp[i][current_budget] = without_road

    selected_indices: List[int] = []
    current_budget = budget
    for i in range(road_count, 0, -1):
        if keep[i][current_budget]:
            selected_indices.append(i - 1)
            current_budget -= _repair_cost_million_egp(roads[i - 1])
    selected_indices.reverse()

    return tuple(tuple(row) for row in dp), tuple(selected_indices)


def solve_road_maintenance(budget: int = 500) -> Dict[str, Any]:
    """Optimize road repairs under a fixed budget using dynamic programming."""

    roads = _candidate_roads()
    dp_table, selected_indices = _solve_road_dp(budget)
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
            "candidates": [
                {
                    **road,
                    "estimated_repair_cost_million_egp": _repair_cost_million_egp(road),
                    "condition_improvement_score": _repair_value(road),
                }
                for road in roads
            ],
            "dp_table": [list(row) for row in dp_table],
        },
        "complexity": {"time": "O(N * B)", "space": "O(N * B)"},
    }
