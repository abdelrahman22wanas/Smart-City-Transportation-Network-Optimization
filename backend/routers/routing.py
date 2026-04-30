"""FastAPI router for route planning and comparison-friendly path endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.a_star import a_star_path
from backend.algorithms.dijkstra import dijkstra_shortest_path
from backend.algorithms.time_dependent_dijkstra import time_dependent_shortest_path

router = APIRouter(prefix="/api", tags=["routing"])


class RouteResultModel(BaseModel):
    """Response payload for routing endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: Literal["success"] = "success"


@router.get("/route", response_model=RouteResultModel)
def get_route(
    from_id: str = Query(..., alias="from"),
    to_id: str = Query(..., alias="to"),
    time_of_day: str | None = Query(default=None, alias="time"),
    mode: Literal["standard", "emergency"] = Query(default="standard"),
) -> RouteResultModel:
    """Return a route using Dijkstra, time-dependent Dijkstra, or A*."""

    start_time = perf_counter()
    if mode == "emergency":
        payload = a_star_path(from_id, to_id)
        result = dict(payload["result"])
        result["mode"] = mode
        result["travel_time_note"] = "A* used for emergency routing"
    elif time_of_day:
        payload = time_dependent_shortest_path(from_id, to_id, time_of_day)
        result = dict(payload["result"])
        result["mode"] = mode
        result["estimated_travel_time_hours"] = round(float(result["total_weight"] or 0.0) / 40.0, 4) if result["reachable"] else None
    else:
        payload = dijkstra_shortest_path(from_id, to_id)
        result = dict(payload["result"])
        result["mode"] = mode
        result["estimated_travel_time_hours"] = round(float(result["total_distance_km"] or 0.0) / 40.0, 4) if result["reachable"] else None

    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return RouteResultModel(
        algorithm=payload["algorithm"],
        result=result,
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )
