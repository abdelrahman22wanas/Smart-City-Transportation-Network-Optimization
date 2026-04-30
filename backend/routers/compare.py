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


@router.get("/dijkstra-vs-astar")
def compare_dijkstra_vs_astar(
    from_id: str = Query(..., alias="from"),
    to_id: str = Query(..., alias="to"),
    time: str | None = Query(default=None),
) -> Dict[str, Any]:
    """Return Dijkstra and A* results in a single comparison payload."""

    dijkstra_start = perf_counter()
    dijkstra_payload = dijkstra_shortest_path(from_id, to_id)
    dijkstra_time_ms = (perf_counter() - dijkstra_start) * 1000.0

    astar_start = perf_counter()
    astar_payload = a_star_path(from_id, to_id)
    astar_time_ms = (perf_counter() - astar_start) * 1000.0

    comparison = {
        "status": "success",
        "algorithm": "compare_dijkstra_vs_astar",
        "result": {
            "time_of_day": time,
            "dijkstra": {
                "visited_nodes": dijkstra_payload["result"]["visited_nodes"],
                "path": dijkstra_payload["result"]["path"],
                "path_length": len(dijkstra_payload["result"]["path"]),
                "total_distance_km": dijkstra_payload["result"]["total_distance_km"],
                "execution_time_ms": round(dijkstra_time_ms, 4),
            },
            "astar": {
                "visited_nodes": astar_payload["result"]["visited_nodes"],
                "path": astar_payload["result"]["path"],
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
