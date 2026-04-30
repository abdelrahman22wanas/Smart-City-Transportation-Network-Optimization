"""Traffic prediction model for the smart city network.

This module trains a small regression model on the hardcoded temporal traffic
patterns. It predicts vehicle flow from road ID and time of day, and exposes
training metadata so the frontend can display predicted vs actual values and a
loss curve.

Time complexity: Training is approximately O(N * I) for N samples and I model iterations.
Space complexity: O(N + P) for the dataset, encoded features, and learned parameters.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from backend.data.cairo_data import EXISTING_ROADS, ROAD_INDEX, TRAFFIC_PATTERNS

try:  # pragma: no cover - optional dependency guard
    from sklearn.compose import ColumnTransformer
    from sklearn.metrics import mean_absolute_error, r2_score
    from sklearn.model_selection import train_test_split
    from sklearn.neural_network import MLPRegressor
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler
except Exception:  # pragma: no cover - fallback if sklearn is unavailable
    ColumnTransformer = None  # type: ignore[assignment]
    mean_absolute_error = None  # type: ignore[assignment]
    r2_score = None  # type: ignore[assignment]
    train_test_split = None  # type: ignore[assignment]
    MLPRegressor = None  # type: ignore[assignment]
    Pipeline = None  # type: ignore[assignment]
    OneHotEncoder = None  # type: ignore[assignment]
    StandardScaler = None  # type: ignore[assignment]

TIME_ORDER = ("morning", "afternoon", "evening", "night")

TRAFFIC_MODEL: Any = None
MODEL_METADATA: Dict[str, Any] = {}


def _training_rows() -> List[Dict[str, Any]]:
    """Expand the traffic patterns into one row per road and time period."""

    rows: List[Dict[str, Any]] = []
    for road_id, pattern in TRAFFIC_PATTERNS.items():
        road = ROAD_INDEX[road_id]
        for time_of_day in TIME_ORDER:
            rows.append(
                {
                    "road_id": road_id,
                    "time_of_day": time_of_day,
                    "distance_km": float(road["distance_km"]),
                    "capacity_veh_h": float(road["capacity_veh_h"]),
                    "flow": float(pattern[time_of_day]),
                }
            )
    return rows


def _feature_matrix(rows: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[float]]:
    """Split rows into feature dictionaries and target values."""

    features: List[Dict[str, Any]] = []
    targets: List[float] = []
    for row in rows:
        features.append(
            {
                "road_id": row["road_id"],
                "time_of_day": row["time_of_day"],
                "distance_km": row["distance_km"],
                "capacity_veh_h": row["capacity_veh_h"],
            }
        )
        targets.append(float(row["flow"]))
    return features, targets


def _make_pipeline() -> Any:
    """Construct the regression pipeline."""

    if Pipeline is None:
        raise ImportError("scikit-learn is required for ml_predictor.py")

    categorical_features = ["road_id", "time_of_day"]
    numeric_features = ["distance_km", "capacity_veh_h"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("numeric", StandardScaler(), numeric_features),
        ]
    )

    model = MLPRegressor(
        hidden_layer_sizes=(32, 16),
        activation="relu",
        solver="adam",
        learning_rate_init=0.01,
        max_iter=500,
        random_state=42,
        early_stopping=True,
        n_iter_no_change=20,
    )

    return Pipeline([("preprocessor", preprocessor), ("model", model)])


def train_traffic_model(force_retrain: bool = False) -> Dict[str, Any]:
    """Train the traffic prediction model and return metrics."""

    global TRAFFIC_MODEL, MODEL_METADATA

    if TRAFFIC_MODEL is not None and not force_retrain:
        return MODEL_METADATA

    rows = _training_rows()
    features, targets = _feature_matrix(rows)

    if train_test_split is None or Pipeline is None:
        raise ImportError("scikit-learn is required for ml_predictor.py")

    x_train, x_test, y_train, y_test = train_test_split(features, targets, test_size=0.2, random_state=42)
    pipeline = _make_pipeline()
    pipeline.fit(x_train, y_train)

    predictions = pipeline.predict(x_test)
    test_mae = float(mean_absolute_error(y_test, predictions)) if mean_absolute_error is not None else None
    test_r2 = float(r2_score(y_test, predictions)) if r2_score is not None else None

    model = pipeline.named_steps["model"]
    loss_curve = [float(value) for value in getattr(model, "loss_curve_", [])]

    TRAFFIC_MODEL = pipeline
    MODEL_METADATA = {
        "status": "trained",
        "training_samples": len(x_train),
        "testing_samples": len(x_test),
        "mae": test_mae,
        "r2_score": test_r2,
        "loss_curve": loss_curve,
        "feature_columns": ["road_id", "time_of_day", "distance_km", "capacity_veh_h"],
    }
    return MODEL_METADATA


def predict_traffic_flow(road_id: str, time_of_day: str) -> Dict[str, Any]:
    """Predict traffic flow for a road and time of day."""

    normalized_time = time_of_day.lower().strip()
    if normalized_time not in TIME_ORDER:
        raise ValueError(f"Unknown time of day: {time_of_day}")
    if road_id not in ROAD_INDEX:
        raise ValueError(f"Unknown road ID: {road_id}")

    if TRAFFIC_MODEL is None:
        train_traffic_model()

    road = ROAD_INDEX[road_id]
    feature_row = [
        {
            "road_id": road_id,
            "time_of_day": normalized_time,
            "distance_km": float(road["distance_km"]),
            "capacity_veh_h": float(road["capacity_veh_h"]),
        }
    ]
    prediction = float(TRAFFIC_MODEL.predict(feature_row)[0])
    actual = float(TRAFFIC_PATTERNS[road_id][normalized_time])
    error = prediction - actual

    return {
        "algorithm": "ml_predictor",
        "result": {
            "road_id": road_id,
            "time_of_day": normalized_time,
            "predicted_flow": round(prediction, 4),
            "actual_flow": actual,
            "error": round(error, 4),
            "absolute_error": round(abs(error), 4),
            "model_status": train_traffic_model(),
        },
        "complexity": {"time": "O(1) per prediction after training", "space": "O(P) for model parameters"},
    }
