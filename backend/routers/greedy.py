"""FastAPI router for greedy traffic-management endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.greedy_emergency import emergency_preemption
from backend.algorithms.greedy_signals import optimize_traffic_signals

router = APIRouter(prefix="/api/greedy", tags=["greedy"])


class GreedyResultModel(BaseModel):
    """Response payload for greedy endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: Literal["success"] = "success"


@router.get("/signals", response_model=GreedyResultModel)
def get_signal_priorities(time: str = Query(default="morning")) -> GreedyResultModel:
    """Return greedy green-light priority order for every node."""

    start_time = perf_counter()
    payload = optimize_traffic_signals(time_of_day=time)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return GreedyResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )


@router.get("/emergency", response_model=GreedyResultModel)
def get_emergency_preemption(
    from_id: str = Query(..., alias="from"),
    to_id: str = Query(..., alias="to"),
) -> GreedyResultModel:
    """Return A*-guided emergency preemption details."""

    start_time = perf_counter()
    payload = emergency_preemption(from_id, to_id)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return GreedyResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )
