"""FastAPI router for dynamic programming optimization endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.dp_bus_scheduling import solve_bus_scheduling
from backend.algorithms.dp_road_maintenance import solve_road_maintenance
from backend.data.cairo_data import TOTAL_BUS_FLEET

router = APIRouter(prefix="/api/dp", tags=["dp"])


class DPResultModel(BaseModel):
    """Response payload for DP endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: Literal["success"] = "success"


@router.get("/bus-scheduling", response_model=DPResultModel)
def get_bus_scheduling(total_buses: int = Query(default=TOTAL_BUS_FLEET, ge=1)) -> DPResultModel:
    """Optimize bus allocation across routes."""

    start_time = perf_counter()
    payload = solve_bus_scheduling(total_buses=total_buses)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return DPResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )


@router.get("/road-maintenance", response_model=DPResultModel)
def get_road_maintenance(budget: int = Query(default=500, ge=1)) -> DPResultModel:
    """Optimize road repairs under a fixed budget."""

    start_time = perf_counter()
    payload = solve_road_maintenance(budget=budget)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return DPResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )
