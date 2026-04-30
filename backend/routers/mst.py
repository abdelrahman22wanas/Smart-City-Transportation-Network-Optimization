"""FastAPI router for minimum spanning tree endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.kruskal import kruskal_mst
from backend.algorithms.prim import prim_mst

router = APIRouter(prefix="/api", tags=["mst"])


class MSTResultModel(BaseModel):
    """Response payload for MST endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: Literal["success"] = "success"


@router.get("/mst", response_model=MSTResultModel)
def get_mst(
    algorithm: Literal["kruskal", "prim"] = Query(default="kruskal"),
    include_new: bool = Query(default=True),
) -> MSTResultModel:
    """Return the MST using either Kruskal or Prim."""

    start_time = perf_counter()
    if algorithm == "prim":
        payload = prim_mst(include_new=include_new)
    else:
        payload = kruskal_mst(include_new=include_new)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return MSTResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )
