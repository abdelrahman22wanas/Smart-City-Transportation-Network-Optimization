"""FastAPI Routers for the Smart City Transportation API.

This package contains API route handlers organized by functionality:
- mst: Minimum Spanning Tree endpoints
- routing: Route planning and pathfinding
- dp: Dynamic Programming (bus scheduling, road maintenance)
- greedy: Greedy algorithm endpoints
- ml: Machine Learning endpoints
- compare: Algorithm comparison endpoints
"""

from backend.routers import (
    mst,
    routing,
    dp,
    greedy,
    ml,
    compare,
)

__all__ = [
    "mst",
    "routing",
    "dp",
    "greedy",
    "ml",
    "compare",
]
