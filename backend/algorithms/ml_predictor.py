"""Traffic prediction model for the smart city network.

This module provides traffic prediction using hardcoded temporal patterns.
When scikit-learn is available, it trains an ML model; otherwise it falls back
to pattern-based predictions.

Time complexity: Training is approximately O(N * I) for N samples and I model iterations.
Space complexity: O(N + P) for the dataset, encoded features, and learned parameters.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from backend.data.cairo_data import (
    BUS_ROUTES, 
    EXISTING_ROADS, 
    PUBLIC_TRANSPORT_DEMAND,
    ROAD_INDEX, 
    TRAFFIC_PATTERNS,
    normalize_road_id,
)

try:  # pragma: no cover - optional dependency guard
    from sklearn.compose import ColumnTransformer
    from sklearn.metrics import mean_absolute_error, r2_score
    from sklearn.model_selection import train_test_split
    from sklearn.neural_network import MLPRegressor
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler
    HAS_SKLEARN = True
except Exception:  # pragma: no cover - fallback if sklearn is unavailable
    HAS_SKLEARN = False

TIME_ORDER = ("morning", "afternoon", "evening", "night")

TRAFFIC_MODEL: Any = None
MODEL_METADATA: Dict[str, Any] = {}


def _training_rows() -> List[Dict[str, Any]]:
    """Expand the traffic patterns into one row per road and time period."""

    rows: List[Dict[str, Any]] = []
    for road_id, pattern in TRAFFIC_PATTERNS.items():
        # TRAFFIC_PATTERNS keys may not be normalized; look up via canonical form
        parts = road_id.split("-", 1)
        canonical = normalize_road_id(parts[0], parts[1]) if len(parts) == 2 else road_id
        if canonical not in ROAD_INDEX:
            continue
        road = ROAD_INDEX[canonical]
        capacity = float(road.get("capacity_veh_h", road.get("capacity", 3000)))
        for time_of_day in TIME_ORDER:
            rows.append(
                {
                    "road_id": road_id,
                    "time_of_day": time_of_day,
                    "distance_km": float(road["distance_km"]),
                    "capacity_veh_h": capacity,
                    "flow": float(pattern[time_of_day]),
                }
            )
    return rows


def _feature_matrix(rows: List[Dict[str, Any]]) -> Tuple[List[List[Any]], List[float]]:
    """Split rows into 2D feature array [road_id, time_of_day, distance_km, capacity_veh_h] and targets."""

    features: List[List[Any]] = []
    targets: List[float] = []
    for row in rows:
        features.append([row["road_id"], row["time_of_day"], row["distance_km"], row["capacity_veh_h"]])
        targets.append(float(row["flow"]))
    return features, targets


def _make_pipeline() -> Any:
    """Construct the regression pipeline."""

    if not HAS_SKLEARN:
        raise ImportError("scikit-learn is required for ml_predictor.py")

    # Columns: [0]=road_id (cat), [1]=time_of_day (cat), [2]=distance_km (num), [3]=capacity_veh_h (num)
    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), [0, 1]),
            ("numeric", StandardScaler(), [2, 3]),
        ]
    )

    model = MLPRegressor(
        hidden_layer_sizes=(32, 16),
        activation="relu",
        solver="adam",
        learning_rate_init=0.01,
        max_iter=1000,
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

    if not HAS_SKLEARN:
        # Fallback: return mock training metadata without actually training
        MODEL_METADATA = {
            "status": "ready (fallback mode - no sklearn)",
            "training_samples": len(list(TRAFFIC_PATTERNS.items())) * len(TIME_ORDER),
            "testing_samples": 0,
            "mae": None,
            "r2_score": None,
            "loss_curve": [],
            "feature_columns": ["road_id", "time_of_day", "distance_km", "capacity_veh_h"],
            "note": "Using hardcoded traffic patterns instead of ML model",
        }
        TRAFFIC_MODEL = True  # Mark as "trained"
        return MODEL_METADATA

    rows = _training_rows()
    features, targets = _feature_matrix(rows)

    x_train, x_test, y_train, y_test = train_test_split(features, targets, test_size=0.2, random_state=42)
    pipeline = _make_pipeline()
    pipeline.fit(x_train, y_train)

    predictions = pipeline.predict(x_test)
    test_mae = float(mean_absolute_error(y_test, predictions))
    test_r2 = float(r2_score(y_test, predictions))

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


def _calculate_congestion(flow: float, capacity: float) -> Dict[str, Any]:
    """Calculate congestion level and percentage from flow and capacity."""
    ratio = flow / capacity if capacity > 0 else 0
    percentage = min(ratio * 100, 100)
    
    if ratio < 0.5:
        level = "Low"
    elif ratio < 0.75:
        level = "Medium"
    elif ratio < 0.9:
        level = "High"
    else:
        level = "Critical"
    
    return {"level": level, "percentage": round(percentage, 2)}


def predict_traffic_flow(road_id: str, time_of_day: str) -> Dict[str, Any]:
    """Predict traffic flow and congestion for a road and time of day."""

    normalized_time = time_of_day.lower().strip()
    if normalized_time not in TIME_ORDER:
        raise ValueError(f"Unknown time of day: {time_of_day}")

    # Normalize road_id to canonical form used in ROAD_INDEX
    parts = road_id.split("-", 1)
    canonical_id = normalize_road_id(parts[0], parts[1]) if len(parts) == 2 else road_id
    if canonical_id not in ROAD_INDEX:
        raise ValueError(f"Unknown road ID: {road_id}")

    if TRAFFIC_MODEL is None:
        train_traffic_model()

    road = ROAD_INDEX[canonical_id]
    capacity = float(road.get("capacity_veh_h", road.get("capacity", 3000)))
    # TRAFFIC_PATTERNS may use non-canonical keys; try both
    actual_pattern = TRAFFIC_PATTERNS.get(canonical_id) or TRAFFIC_PATTERNS.get(road_id, {})
    actual = float(actual_pattern.get(normalized_time, capacity * 0.6))

    # Use actual value if no sklearn, or run ML prediction if available
    if not HAS_SKLEARN or TRAFFIC_MODEL is True:
        # Fallback: predict based on road capacity and time of day patterns
        distance = float(road["distance_km"])
        time_multipliers = {"morning": 0.85, "afternoon": 0.50, "evening": 0.80, "night": 0.25}
        base_prediction = capacity * time_multipliers.get(normalized_time, 0.6)
        distance_factor = min(1.0, distance / 15.0)
        prediction = base_prediction * (0.7 + 0.3 * distance_factor)
        variation = (hash(canonical_id) % 20 - 10) / 100
        prediction = prediction * (1 + variation)
    else:
        feature_row = [[canonical_id, normalized_time, float(road["distance_km"]), capacity]]
        prediction = float(TRAFFIC_MODEL.predict(feature_row)[0])

    error = prediction - actual
    predicted_congestion = _calculate_congestion(prediction, capacity)
    actual_congestion = _calculate_congestion(actual, capacity)

    # Predict for all time slots so the frontend can draw a full comparison chart
    all_time_predictions: Dict[str, float] = {}
    for t in TIME_ORDER:
        if HAS_SKLEARN and TRAFFIC_MODEL is not True:
            row = [[canonical_id, t, float(road["distance_km"]), capacity]]
            all_time_predictions[t] = round(float(TRAFFIC_MODEL.predict(row)[0]), 2)
        else:
            time_multipliers = {"morning": 0.85, "afternoon": 0.50, "evening": 0.80, "night": 0.25}
            base = capacity * time_multipliers.get(t, 0.6)
            dist_factor = min(1.0, float(road["distance_km"]) / 15.0)
            var = (hash(canonical_id) % 20 - 10) / 100
            all_time_predictions[t] = round(base * (0.7 + 0.3 * dist_factor) * (1 + var), 2)

    return {
        "algorithm": "ml_predictor",
        "result": {
            "road_id": canonical_id,
            "time_of_day": normalized_time,
            "predicted_flow": round(prediction, 2),
            "actual_flow": round(actual, 2),
            "capacity": capacity,
            "error": round(error, 2),
            "absolute_error": round(abs(error), 2),
            "predicted_congestion": predicted_congestion,
            "actual_congestion": actual_congestion,
            "all_time_predictions": all_time_predictions,
            "model_status": train_traffic_model(),
        },
        "complexity": {"time": "O(1) per prediction after training", "space": "O(P) for model parameters"},
    }
