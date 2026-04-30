"""Dynamic programming for bus scheduling optimization.

This module allocates a fixed bus fleet across routes to maximize the total daily
passengers served. It uses a 0/1 knapsack formulation where each route is an item
with bus demand as weight and daily passengers as value.

Time complexity: O(N * B) where N is the number of routes and B is the bus fleet size.
Space complexity: O(N * B) for the DP table and reconstruction data.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, List, Tuple

from backend.data.cairo_data import BUS_ROUTES, TOTAL_BUS_FLEET


def _route_items() -> List[Dict[str, Any]]:
    """Return route records in a stable order for dynamic programming."""

    return sorted(BUS_ROUTES, key=lambda route: route["id"])


@lru_cache(maxsize=32)
def _solve_bus_dp(total_buses: int) -> Tuple[Tuple[Tuple[int, ...], ...], Tuple[int, ...]]:
    """Compute the DP table and selected route indices."""

    routes = _route_items()
    route_count = len(routes)
    dp = [[0 for _ in range(total_buses + 1)] for _ in range(route_count + 1)]
    keep = [[False for _ in range(total_buses + 1)] for _ in range(route_count + 1)]

    for i in range(1, route_count + 1):
        route = routes[i - 1]
        weight = int(route["buses_assigned"])
        value = int(route["daily_passengers"])
        for buses in range(total_buses + 1):
            without_route = dp[i - 1][buses]
            with_route = -1
            if weight <= buses:
                with_route = value + dp[i - 1][buses - weight]
            if with_route > without_route:
                dp[i][buses] = with_route
                keep[i][buses] = True
            else:
                dp[i][buses] = without_route

    selected_indices: List[int] = []
    buses_remaining = total_buses
    for i in range(route_count, 0, -1):
        if keep[i][buses_remaining]:
            selected_indices.append(i - 1)
            buses_remaining -= int(routes[i - 1]["buses_assigned"])
    selected_indices.reverse()

    return tuple(tuple(row) for row in dp), tuple(selected_indices)


def solve_bus_scheduling(total_buses: int = TOTAL_BUS_FLEET) -> Dict[str, Any]:
    """Optimize bus allocation across routes using dynamic programming."""

    routes = _route_items()
    dp_table, selected_indices = _solve_bus_dp(total_buses)
    selected_routes = [routes[index] for index in selected_indices]
    used_buses = sum(int(route["buses_assigned"]) for route in selected_routes)
    served_passengers = sum(int(route["daily_passengers"]) for route in selected_routes)

    return {
        "algorithm": "dp_bus_scheduling",
        "result": {
            "total_buses": total_buses,
            "used_buses": used_buses,
            "remaining_buses": total_buses - used_buses,
            "served_passengers": served_passengers,
            "selected_routes": selected_routes,
            "routes": routes,
            "dp_table": [list(row) for row in dp_table],
        },
        "complexity": {"time": "O(N * B)", "space": "O(N * B)"},
    }
