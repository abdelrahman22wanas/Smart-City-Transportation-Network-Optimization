"""Cairo Transportation Network Data.

This package contains the hardcoded Cairo network dataset including:
- Nodes (locations, coordinates)
- Roads (edges with distances and attributes)
- Traffic patterns and temporal flow data
"""

from backend.data.cairo_data import (
    NODES,
    NODE_BY_ID,
    EXISTING_ROADS,
    POTENTIAL_NEW_ROADS,
    METRO_LINES,
    BUS_ROUTES,
    TRAFFIC_PATTERNS,
    TRAFFIC_LIGHT_INTERSECTIONS,
    PEAK_HOUR_PATTERNS,
    NodeId,
    RoadId,
    normalize_road_id,
)

__all__ = [
    "NODES",
    "NODE_BY_ID",
    "EXISTING_ROADS",
    "POTENTIAL_NEW_ROADS",
    "METRO_LINES",
    "BUS_ROUTES",
    "TRAFFIC_PATTERNS",
    "TRAFFIC_LIGHT_INTERSECTIONS",
    "PEAK_HOUR_PATTERNS",
    "NodeId",
    "RoadId",
    "normalize_road_id",
]
