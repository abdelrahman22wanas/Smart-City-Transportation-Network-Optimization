"""FastAPI router for traffic prediction endpoints."""

from __future__ import annotations

from time import perf_counter
from typing import Any, Dict, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from backend.algorithms.ml_predictor import predict_traffic_flow, train_traffic_model

router = APIRouter(prefix="/api/ml", tags=["ml"])


class MLResultModel(BaseModel):
    """Response payload for ML endpoints."""

    algorithm: str
    result: Dict[str, Any]
    complexity: Dict[str, str]
    execution_time_ms: float = Field(..., ge=0)
    status: Literal["success"] = "success"


@router.get("/train", response_model=MLResultModel)
def train_model(force_retrain: bool = Query(default=False)) -> MLResultModel:
    """Trigger model training and return the training metadata."""

    start_time = perf_counter()
    metadata = train_traffic_model(force_retrain=force_retrain)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return MLResultModel(
        algorithm="ml_predictor",
        result={"training": metadata},
        complexity={"time": "O(N * I)", "space": "O(N + P)"},
        execution_time_ms=round(execution_time_ms, 4),
    )


@router.get("/predict", response_model=MLResultModel)
def predict(
    road: str = Query(...),
    time: str = Query(...),
) -> MLResultModel:
    """Predict traffic flow for a road/time pair."""

    start_time = perf_counter()
    payload = predict_traffic_flow(road_id=road, time_of_day=time)
    execution_time_ms = (perf_counter() - start_time) * 1000.0
    return MLResultModel(
        algorithm=payload["algorithm"],
        result=payload["result"],
        complexity=payload["complexity"],
        execution_time_ms=round(execution_time_ms, 4),
    )
