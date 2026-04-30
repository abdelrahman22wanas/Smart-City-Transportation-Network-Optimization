"""Cairo smart city transportation dataset.

This module hardcodes the full project dataset used by the backend algorithms.
It provides neighborhoods, facilities, roads, traffic patterns, transit routes,
and small helper lookups for consistent ID handling.

Time complexity: Data access is O(1) for dictionary lookups.
Space complexity: O(N) for storing the full static dataset.
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple, Union

NodeId = Union[int, str]
RoadId = str

NEIGHBORHOODS: List[Dict[str, Any]] = [
    {"id": 1, "name": "Maadi", "population": 250000, "type": "Residential", "x": 31.25, "y": 29.96},
    {"id": 2, "name": "Nasr City", "population": 500000, "type": "Mixed", "x": 31.34, "y": 30.06},
    {"id": 3, "name": "Downtown Cairo", "population": 100000, "type": "Business", "x": 31.24, "y": 30.04},
    {"id": 4, "name": "New Cairo", "population": 300000, "type": "Residential", "x": 31.47, "y": 30.03},
    {"id": 5, "name": "Heliopolis", "population": 200000, "type": "Mixed", "x": 31.32, "y": 30.09},
    {"id": 6, "name": "Zamalek", "population": 50000, "type": "Residential", "x": 31.22, "y": 30.06},
    {"id": 7, "name": "6th October City", "population": 400000, "type": "Mixed", "x": 30.98, "y": 29.93},
    {"id": 8, "name": "Giza", "population": 550000, "type": "Mixed", "x": 31.21, "y": 29.99},
    {"id": 9, "name": "Mohandessin", "population": 180000, "type": "Business", "x": 31.20, "y": 30.05},
    {"id": 10, "name": "Dokki", "population": 220000, "type": "Mixed", "x": 31.21, "y": 30.03},
    {"id": 11, "name": "Shubra", "population": 450000, "type": "Residential", "x": 31.24, "y": 30.11},
    {"id": 12, "name": "Helwan", "population": 350000, "type": "Industrial", "x": 31.33, "y": 29.85},
    {"id": 13, "name": "New Administrative Capital", "population": 50000, "type": "Government", "x": 31.80, "y": 30.02},
    {"id": 14, "name": "Al Rehab", "population": 120000, "type": "Residential", "x": 31.49, "y": 30.06},
    {"id": 15, "name": "Sheikh Zayed", "population": 150000, "type": "Residential", "x": 30.94, "y": 30.01},
]

FACILITIES: List[Dict[str, Any]] = [
    {"id": "F1", "name": "Cairo International Airport", "type": "Airport", "x": 31.41, "y": 30.11},
    {"id": "F2", "name": "Ramses Railway Station", "type": "Transit Hub", "x": 31.25, "y": 30.06},
    {"id": "F3", "name": "Cairo University", "type": "Education", "x": 31.21, "y": 30.03},
    {"id": "F4", "name": "Al-Azhar University", "type": "Education", "x": 31.26, "y": 30.05},
    {"id": "F5", "name": "Egyptian Museum", "type": "Tourism", "x": 31.23, "y": 30.05},
    {"id": "F6", "name": "Cairo International Stadium", "type": "Sports", "x": 31.30, "y": 30.07},
    {"id": "F7", "name": "Smart Village", "type": "Business", "x": 30.97, "y": 30.07},
    {"id": "F8", "name": "Cairo Festival City", "type": "Commercial", "x": 31.40, "y": 30.03},
    {"id": "F9", "name": "Qasr El Aini Hospital", "type": "Medical", "x": 31.23, "y": 30.03},
    {"id": "F10", "name": "Maadi Military Hospital", "type": "Medical", "x": 31.25, "y": 29.95},
]

EXISTING_ROADS: List[Dict[str, Any]] = [
    {"from": 1, "to": 3, "distance_km": 8.5, "capacity_veh_h": 3000, "condition": 7},
    {"from": 1, "to": 8, "distance_km": 6.2, "capacity_veh_h": 2500, "condition": 6},
    {"from": 2, "to": 3, "distance_km": 5.9, "capacity_veh_h": 2800, "condition": 8},
    {"from": 2, "to": 5, "distance_km": 4.0, "capacity_veh_h": 3200, "condition": 9},
    {"from": 3, "to": 5, "distance_km": 6.1, "capacity_veh_h": 3500, "condition": 7},
    {"from": 3, "to": 6, "distance_km": 3.2, "capacity_veh_h": 2000, "condition": 8},
    {"from": 3, "to": 9, "distance_km": 4.5, "capacity_veh_h": 2600, "condition": 6},
    {"from": 3, "to": 10, "distance_km": 3.8, "capacity_veh_h": 2400, "condition": 7},
    {"from": 4, "to": 2, "distance_km": 15.2, "capacity_veh_h": 3800, "condition": 9},
    {"from": 4, "to": 14, "distance_km": 5.3, "capacity_veh_h": 3000, "condition": 10},
    {"from": 5, "to": 11, "distance_km": 7.9, "capacity_veh_h": 3100, "condition": 7},
    {"from": 6, "to": 9, "distance_km": 2.2, "capacity_veh_h": 1800, "condition": 8},
    {"from": 7, "to": 8, "distance_km": 24.5, "capacity_veh_h": 3500, "condition": 8},
    {"from": 7, "to": 15, "distance_km": 9.8, "capacity_veh_h": 3000, "condition": 9},
    {"from": 8, "to": 10, "distance_km": 3.3, "capacity_veh_h": 2200, "condition": 7},
    {"from": 8, "to": 12, "distance_km": 14.8, "capacity_veh_h": 2600, "condition": 5},
    {"from": 9, "to": 10, "distance_km": 2.1, "capacity_veh_h": 1900, "condition": 7},
    {"from": 10, "to": 11, "distance_km": 8.7, "capacity_veh_h": 2400, "condition": 6},
    {"from": 11, "to": "F2", "distance_km": 3.6, "capacity_veh_h": 2200, "condition": 7},
    {"from": 12, "to": 1, "distance_km": 12.7, "capacity_veh_h": 2800, "condition": 6},
    {"from": 13, "to": 4, "distance_km": 45.0, "capacity_veh_h": 4000, "condition": 10},
    {"from": 14, "to": 13, "distance_km": 35.5, "capacity_veh_h": 3800, "condition": 9},
    {"from": 15, "to": 7, "distance_km": 9.8, "capacity_veh_h": 3000, "condition": 9},
    {"from": "F1", "to": 5, "distance_km": 7.5, "capacity_veh_h": 3500, "condition": 9},
    {"from": "F1", "to": "F2", "distance_km": 9.2, "capacity_veh_h": 3200, "condition": 8},
    {"from": "F2", "to": 3, "distance_km": 2.5, "capacity_veh_h": 2000, "condition": 7},
    {"from": "F7", "to": 15, "distance_km": 8.3, "capacity_veh_h": 2800, "condition": 8},
    {"from": "F8", "to": 4, "distance_km": 6.1, "capacity_veh_h": 3000, "condition": 9},
]

POTENTIAL_NEW_ROADS: List[Dict[str, Any]] = [
    {"from": 1, "to": 4, "distance_km": 22.8, "capacity": 4000, "cost_million_egp": 450},
    {"from": 1, "to": 14, "distance_km": 25.3, "capacity": 3800, "cost_million_egp": 500},
    {"from": 2, "to": 13, "distance_km": 48.2, "capacity": 4500, "cost_million_egp": 950},
    {"from": 3, "to": 13, "distance_km": 56.7, "capacity": 4500, "cost_million_egp": 1100},
    {"from": 5, "to": 4, "distance_km": 16.8, "capacity": 3500, "cost_million_egp": 320},
    {"from": 6, "to": 8, "distance_km": 7.5, "capacity": 2500, "cost_million_egp": 150},
    {"from": 7, "to": 13, "distance_km": 82.3, "capacity": 4000, "cost_million_egp": 1600},
    {"from": 9, "to": 11, "distance_km": 6.9, "capacity": 2800, "cost_million_egp": 140},
    {"from": 10, "to": "F7", "distance_km": 27.4, "capacity": 3200, "cost_million_egp": 550},
    {"from": 11, "to": 13, "distance_km": 62.1, "capacity": 4200, "cost_million_egp": 1250},
    {"from": 12, "to": 14, "distance_km": 30.5, "capacity": 3600, "cost_million_egp": 610},
    {"from": 14, "to": 5, "distance_km": 18.2, "capacity": 3300, "cost_million_egp": 360},
    {"from": 15, "to": 9, "distance_km": 22.7, "capacity": 3000, "cost_million_egp": 450},
    {"from": "F1", "to": 13, "distance_km": 40.2, "capacity": 4000, "cost_million_egp": 800},
    {"from": "F7", "to": 9, "distance_km": 26.8, "capacity": 3200, "cost_million_egp": 540},
]

TRAFFIC_PATTERNS: Dict[RoadId, Dict[str, int]] = {
    "1-3": {"morning": 2800, "afternoon": 1500, "evening": 2600, "night": 800},
    "1-8": {"morning": 2200, "afternoon": 1200, "evening": 2100, "night": 600},
    "2-3": {"morning": 2700, "afternoon": 1400, "evening": 2500, "night": 700},
    "2-5": {"morning": 3000, "afternoon": 1600, "evening": 2800, "night": 650},
    "3-5": {"morning": 3200, "afternoon": 1700, "evening": 3100, "night": 800},
    "3-6": {"morning": 1800, "afternoon": 1400, "evening": 1900, "night": 500},
    "3-9": {"morning": 2400, "afternoon": 1300, "evening": 2200, "night": 550},
    "3-10": {"morning": 2300, "afternoon": 1200, "evening": 2100, "night": 500},
    "4-2": {"morning": 3600, "afternoon": 1800, "evening": 3300, "night": 750},
    "4-14": {"morning": 2800, "afternoon": 1600, "evening": 2600, "night": 600},
    "5-11": {"morning": 2900, "afternoon": 1500, "evening": 2700, "night": 650},
    "6-9": {"morning": 1700, "afternoon": 1300, "evening": 1800, "night": 450},
    "7-8": {"morning": 3200, "afternoon": 1700, "evening": 3000, "night": 700},
    "7-15": {"morning": 2800, "afternoon": 1500, "evening": 2600, "night": 600},
    "8-10": {"morning": 2000, "afternoon": 1100, "evening": 1900, "night": 450},
    "8-12": {"morning": 2400, "afternoon": 1300, "evening": 2200, "night": 500},
    "9-10": {"morning": 1800, "afternoon": 1200, "evening": 1700, "night": 400},
    "10-11": {"morning": 2200, "afternoon": 1300, "evening": 2100, "night": 500},
    "11-F2": {"morning": 2100, "afternoon": 1200, "evening": 2000, "night": 450},
    "12-1": {"morning": 2600, "afternoon": 1400, "evening": 2400, "night": 550},
    "13-4": {"morning": 3800, "afternoon": 2000, "evening": 3500, "night": 800},
    "14-13": {"morning": 3600, "afternoon": 1900, "evening": 3300, "night": 750},
    "15-7": {"morning": 2800, "afternoon": 1500, "evening": 2600, "night": 600},
    "F1-5": {"morning": 3300, "afternoon": 2200, "evening": 3100, "night": 1200},
    "F1-2": {"morning": 3000, "afternoon": 2000, "evening": 2800, "night": 1100},
    "F2-3": {"morning": 1900, "afternoon": 1600, "evening": 1800, "night": 900},
    "F7-15": {"morning": 2600, "afternoon": 1500, "evening": 2400, "night": 550},
    "F8-4": {"morning": 2800, "afternoon": 1600, "evening": 2600, "night": 600},
}

METRO_LINES: List[Dict[str, Any]] = [
    {"id": "M1", "name": "Line 1 (Helwan-New Marg)", "stations": [12, 1, 3, "F2", 11], "daily_passengers": 1500000},
    {"id": "M2", "name": "Line 2 (Shubra-Giza)", "stations": [11, "F2", 3, 10, 8], "daily_passengers": 1200000},
    {"id": "M3", "name": "Line 3 (Airport-Imbaba)", "stations": ["F1", 5, 2, 3, 9], "daily_passengers": 800000},
]

BUS_ROUTES: List[Dict[str, Any]] = [
    {"id": "B1", "stops": [1, 3, 6, 9], "buses_assigned": 25, "daily_passengers": 35000},
    {"id": "B2", "stops": [7, 15, 8, 10, 3], "buses_assigned": 30, "daily_passengers": 42000},
    {"id": "B3", "stops": [2, 5, "F1"], "buses_assigned": 20, "daily_passengers": 28000},
    {"id": "B4", "stops": [4, 14, 2, 3], "buses_assigned": 22, "daily_passengers": 31000},
    {"id": "B5", "stops": [8, 12, 1], "buses_assigned": 18, "daily_passengers": 25000},
    {"id": "B6", "stops": [11, 5, 2], "buses_assigned": 24, "daily_passengers": 33000},
    {"id": "B7", "stops": [13, 4, 14], "buses_assigned": 15, "daily_passengers": 21000},
    {"id": "B8", "stops": ["F7", 15, 7], "buses_assigned": 12, "daily_passengers": 17000},
    {"id": "B9", "stops": [1, 8, 10, 9, 6], "buses_assigned": 28, "daily_passengers": 39000},
    {"id": "B10", "stops": ["F8", 4, 2, 5], "buses_assigned": 20, "daily_passengers": 28000},
]

PUBLIC_TRANSPORT_DEMAND: List[Dict[str, Any]] = [
    {"from": 3, "to": 5, "daily_passengers": 15000},
    {"from": 1, "to": 3, "daily_passengers": 12000},
    {"from": 2, "to": 3, "daily_passengers": 18000},
    {"from": "F2", "to": 11, "daily_passengers": 25000},
    {"from": "F1", "to": 3, "daily_passengers": 20000},
    {"from": 7, "to": 3, "daily_passengers": 14000},
    {"from": 4, "to": 3, "daily_passengers": 16000},
    {"from": 8, "to": 3, "daily_passengers": 22000},
    {"from": 3, "to": 9, "daily_passengers": 13000},
    {"from": 5, "to": 2, "daily_passengers": 17000},
    {"from": 11, "to": 3, "daily_passengers": 24000},
    {"from": 12, "to": 3, "daily_passengers": 11000},
    {"from": 1, "to": 8, "daily_passengers": 9000},
    {"from": 7, "to": "F7", "daily_passengers": 18000},
    {"from": 4, "to": "F8", "daily_passengers": 12000},
    {"from": 13, "to": 3, "daily_passengers": 8000},
    {"from": 14, "to": 4, "daily_passengers": 7000},
]

TOTAL_BUS_FLEET: int = sum(route["buses_assigned"] for route in BUS_ROUTES)

NODES: List[Dict[str, Any]] = [*NEIGHBORHOODS, *FACILITIES]

NODE_BY_ID: Dict[NodeId, Dict[str, Any]] = {node["id"]: node for node in NODES}


def normalize_road_id(from_id: NodeId, to_id: NodeId) -> RoadId:
    """Return a canonical road identifier for an undirected edge."""

    return f"{from_id}-{to_id}" if str(from_id) <= str(to_id) else f"{to_id}-{from_id}"


def build_road_index(roads: List[Dict[str, Any]]) -> Dict[RoadId, Dict[str, Any]]:
    """Index road records by canonical road ID."""

    return {normalize_road_id(road["from"], road["to"]): road for road in roads}


EXISTING_ROAD_INDEX: Dict[RoadId, Dict[str, Any]] = build_road_index(EXISTING_ROADS)
POTENTIAL_ROAD_INDEX: Dict[RoadId, Dict[str, Any]] = build_road_index(POTENTIAL_NEW_ROADS)
ROAD_INDEX: Dict[RoadId, Dict[str, Any]] = {**EXISTING_ROAD_INDEX, **POTENTIAL_ROAD_INDEX}

TIME_OF_DAY_ORDER: Tuple[str, ...] = ("morning", "afternoon", "evening", "night")


def get_node(node_id: NodeId) -> Dict[str, Any]:
    """Fetch a node record by ID."""

    return NODE_BY_ID[node_id]


def get_road(road_id: RoadId) -> Dict[str, Any]:
    """Fetch a road record by canonical road ID."""

    return ROAD_INDEX[road_id]


def get_traffic_pattern(road_id: RoadId) -> Dict[str, int]:
    """Fetch traffic flow values for a road if present."""

    return TRAFFIC_PATTERNS[road_id]


def all_node_ids() -> List[NodeId]:
    """Return all node IDs in the graph."""

    return [node["id"] for node in NODES]


def all_existing_road_ids() -> List[RoadId]:
    """Return canonical IDs for existing roads."""

    return list(EXISTING_ROAD_INDEX.keys())


def all_potential_road_ids() -> List[RoadId]:
    """Return canonical IDs for potential roads."""

    return list(POTENTIAL_ROAD_INDEX.keys())
