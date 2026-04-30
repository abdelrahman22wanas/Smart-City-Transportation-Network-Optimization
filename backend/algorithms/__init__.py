"""Smart City Transportation Network Algorithms.

This package contains implementations of classic graph algorithms and machine learning
for the Cairo transportation network optimization system.

Algorithms:
- a_star: A* search for emergency routing
- dijkstra: Standard shortest path algorithm
- kruskal: Kruskal's MST algorithm
- prim: Prim's MST algorithm
- time_dependent_dijkstra: Traffic-aware routing
- dp_bus_scheduling: Dynamic programming for bus allocation
- dp_road_maintenance: Dynamic programming for road maintenance
- greedy_signals: Greedy traffic signal optimization
- greedy_emergency: Greedy emergency preemption
- ml_predictor: ML-based traffic prediction
"""

from backend.algorithms import (
    a_star,
    dijkstra,
    kruskal,
    prim,
    time_dependent_dijkstra,
    dp_bus_scheduling,
    dp_road_maintenance,
    greedy_signals,
    greedy_emergency,
    ml_predictor,
)

__all__ = [
    "a_star",
    "dijkstra",
    "kruskal",
    "prim",
    "time_dependent_dijkstra",
    "dp_bus_scheduling",
    "dp_road_maintenance",
    "greedy_signals",
    "greedy_emergency",
    "ml_predictor",
]
