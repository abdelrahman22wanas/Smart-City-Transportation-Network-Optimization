"""FastAPI router for side-by-side algorithm comparison endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.a_star import a_star_path
from backend.algorithms.dijkstra import dijkstra_shortest_path

router = APIRouter(prefix="/api/compare", tags=["compare"])


class CompareResultModel(BaseModel):
    """Response payload for algorithm comparison endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: str = "success"


def path_to_edges(path):
    """Convert a path of nodes to a list of edges."""
    edges = []
    for i in range(len(path) - 1):
        from_n = path[i]
        to_n = path[i + 1]
        road_id = f"{from_n}-{to_n}" if str(from_n) <= str(to_n) else f"{to_n}-{from_n}"
        edges.append({"road_id": road_id, "from": from_n, "to": to_n})
    return edges


@router.get("/dijkstra-vs-astar")
def compare_dijkstra_vs_astar(
    from_id: str = Query(..., alias="from"),
    to_id: str = Query(..., alias="to"),
    time: str | None = Query(default=None),
) -> Dict[str, Any]:
    """Return Dijkstra and A* results in a single comparison payload."""

    # Convert string IDs to integers if they're numeric
    try:
        from_node = int(from_id)
    except ValueError:
        from_node = from_id
    
    try:
        to_node = int(to_id)
    except ValueError:
        to_node = to_id

    dijkstra_start = perf_counter()
    dijkstra_payload = dijkstra_shortest_path(from_node, to_node)
    dijkstra_time_ms = (perf_counter() - dijkstra_start) * 1000.0

    astar_start = perf_counter()
    astar_payload = a_star_path(from_node, to_node)
    astar_time_ms = (perf_counter() - astar_start) * 1000.0

    dijkstra_edges = path_to_edges(dijkstra_payload["result"]["path"])
    astar_edges = path_to_edges(astar_payload["result"]["path"])

    comparison = {
        "status": "success",
        "algorithm": "compare_dijkstra_vs_astar",
        "result": {
            "time_of_day": time,
            "dijkstra": {
                "visited_nodes": dijkstra_payload["result"]["visited_nodes"],
                "path": dijkstra_payload["result"]["path"],
                "edges": dijkstra_edges,
                "path_length": len(dijkstra_payload["result"]["path"]),
                "total_distance_km": dijkstra_payload["result"]["total_distance_km"],
                "execution_time_ms": round(dijkstra_time_ms, 4),
            },
            "astar": {
                "visited_nodes": astar_payload["result"]["visited_nodes"],
                "path": astar_payload["result"]["path"],
                "edges": astar_edges,
                "path_length": len(astar_payload["result"]["path"]),
                "total_distance_km": astar_payload["result"]["total_distance_km"],
                "execution_time_ms": round(astar_time_ms, 4),
            },
        },
        "complexity": {
            "dijkstra": dijkstra_payload["complexity"]["time"],
            "astar": astar_payload["complexity"]["time"],
        },
    }
    return comparison
