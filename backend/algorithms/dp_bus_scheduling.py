"""Dynamic programming for bus scheduling optimization.

This module allocates a fixed bus fleet across routes to maximize the total daily
passengers served. It uses a 0/1 knapsack formulation where each route is an item
with bus demand as weight and daily passengers as value.

Time complexity: O(N * B) where N is the number of routes and B is the bus fleet size.
Space complexity: O(B) for the optimized rolling-array DP approach.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

from backend.data.cairo_data import BUS_ROUTES, TOTAL_BUS_FLEET


def _route_items() -> List[Dict[str, Any]]:
    """Return route records in a stable order for dynamic programming."""

    return sorted(BUS_ROUTES, key=lambda route: route["id"])


def _solve_bus_dp(total_buses: int) -> Tuple[int, Tuple[int, ...]]:
    """Compute the DP solution and selected route indices.
    
    Returns only the max value and selected indices, not the full DP table.
    This reduces memory usage from O(N*B) to O(B) for the DP array.
    """

    routes = _route_items()
    route_count = len(routes)
    
    prev = [0] * (total_buses + 1)
    selected_indices: List[int] = []
    
    keep_info: List[List[bool]] = []
    for i in range(route_count):
        route = routes[i]
        weight = int(route["buses_assigned"])
        value = int(route["daily_passengers"])
        keep_row = [False] * (total_buses + 1)
        curr = prev[:]
        
        for buses in range(total_buses, weight - 1, -1):
            with_route = value + prev[buses - weight]
            if with_route > curr[buses]:
                curr[buses] = with_route
                keep_row[buses] = True
        
        keep_info.append(keep_row)
        prev = curr
    
    buses_remaining = total_buses
    for i in range(route_count - 1, -1, -1):
        if keep_info[i][buses_remaining]:
            selected_indices.append(i)
            buses_remaining -= int(routes[i]["buses_assigned"])
    selected_indices.reverse()

    return prev[total_buses], tuple(selected_indices)


def solve_bus_scheduling(total_buses: int = TOTAL_BUS_FLEET) -> Dict[str, Any]:
    """Optimize bus allocation across routes using dynamic programming."""

    routes = _route_items()
    max_value, selected_indices = _solve_bus_dp(total_buses)
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
        },
        "complexity": {"time": "O(N * B)", "space": "O(B)"},
    }
