# Smart City Transportation Network Optimization
**Course:** Design and Analysis of Algorithms (CSE112)  
**University:** Alamein International University

## Abstract
This project models Greater Cairo as a weighted transportation network and applies classical algorithms to solve routing, infrastructure, public transit, traffic control, and prediction tasks. The system combines a FastAPI backend, a React frontend, and a self-contained dataset of neighborhoods, facilities, roads, traffic patterns, bus routes, and demand records. The result is an interactive dashboard that demonstrates how graph algorithms, dynamic programming, greedy strategies, and machine learning can support smart-city transportation planning.

## 1. Introduction
Urban transportation systems require efficient planning to reduce congestion, improve mobility, and prioritize limited resources. Cairo provides a realistic case study because it includes dense neighborhoods, major facilities, mixed road conditions, and uneven traffic demand.  

This project turns the city into a graph-based optimization platform where users can:
- inspect the road network,
- compare shortest-path and spanning-tree algorithms,
- optimize bus and road planning,
- test greedy traffic decisions,
- and predict traffic flow using machine learning.

## 2. Problem Definition
The city is represented as a graph:
- **Nodes**: neighborhoods and facilities
- **Edges**: roads and transport links
- **Weights**: distance, travel time, road condition, traffic flow, or repair cost

The main goals are:
- minimize travel cost and travel time,
- build efficient network structures,
- allocate buses under fleet limits,
- select roads for maintenance under budget limits,
- and predict traffic patterns from historical data.

## 3. Data Modeling
The project uses an embedded Cairo dataset so it runs without external databases.

### 3.1 Nodes
- **Neighborhoods**: residential, business, industrial, and mixed areas
- **Facilities**: airports, hospitals, universities, stations, and commercial centers

### 3.2 Roads
The road dataset contains:
- current roads,
- potential new roads,
- road distance,
- capacity,
- and condition scores.

### 3.3 Traffic and Transit
The dataset also includes:
- morning / afternoon / evening / night traffic patterns,
- metro lines,
- bus routes,
- and public transit demand pairs.

## 4. Algorithms and Design

### 4.1 Minimum Spanning Tree
Used to design a low-cost connected infrastructure network.
- **Kruskal's algorithm** builds the tree by sorting edges by weight.
- **Prim's algorithm** grows the tree from a starting node.

### 4.2 Shortest Path Routing
Used to find efficient routes across the network.
- **Dijkstra** handles standard routing.
- **A\*** adds heuristic guidance for faster search.
- **Time-dependent Dijkstra** adjusts route choice based on traffic patterns.

### 4.3 Dynamic Programming
Used for constrained optimization.
- **Bus scheduling** is modeled as a knapsack problem.
- **Road maintenance** is also modeled as a knapsack problem using estimated repair cost and improvement score.

### 4.4 Greedy Methods
Used where local optimal choices are useful.
- **Traffic signals** are prioritized by traffic load.
- **Emergency routing** gives priority to urgent paths and critical destinations.

### 4.5 Machine Learning
Used to predict traffic flow.
- The model learns from road ID and time-of-day patterns.
- It supports traffic forecasting for planning and visualization.

## 5. System Architecture
The system is split into two layers:

### Backend
- Built with **FastAPI**
- Exposes REST endpoints for each algorithm
- Loads the Cairo dataset from `backend/data/`
- Executes algorithms from `backend/algorithms/`

### Frontend
- Built with **React**
- Uses a tab-based interface
- Calls backend APIs through Axios
- Renders maps, cards, comparison views, and dashboard summaries

### Communication Flow
1. User selects a feature tab.
2. Frontend sends an API request.
3. Backend executes the selected algorithm.
4. Response is returned as JSON.
5. Frontend renders the result visually.

## 6. User Interface and Visualization
The interface includes:
- **Network Map** for city-wide graph visualization
- **MST Designer** for spanning-tree analysis
- **Route Planner** for pathfinding
- **Algorithm Race** for comparing routing algorithms
- **Public Transit** for bus and maintenance optimization
- **Traffic Signals** for greedy traffic strategies
- **ML Prediction** for forecasting traffic flow
- **Performance Dashboard** for summary metrics

## 7. Example API Endpoints
- `GET /health`
- `GET /api/mst?algorithm=kruskal&include_new=true`
- `GET /api/route?from=1&to=5&time=morning&mode=emergency`
- `GET /api/dp/bus-scheduling`
- `GET /api/dp/road-maintenance?budget=500`
- `GET /api/greedy/signals?time=morning`
- `GET /api/greedy/emergency?from=7&to=F9`
- `GET /api/ml/train`
- `GET /api/ml/predict?road=1-3&time=morning`
- `GET /api/compare/dijkstra-vs-astar?from=X&to=Y&time=T`

## 8. Discussion
The project shows clear tradeoffs between algorithms:
- MST methods reduce infrastructure cost but do not solve routing directly.
- Dijkstra is reliable for exact shortest paths.
- A\* can be faster when the heuristic is informative.
- Dynamic programming is effective for constrained allocation problems.
- Greedy methods are simple and fast, but not always globally optimal.
- Machine learning adds forecasting ability beyond classical optimization.

## 9. Conclusion
This project demonstrates how algorithmic techniques can be applied to a realistic smart-city transportation model. It integrates graph theory, optimization, greedy decision-making, and predictive modeling into one interactive system. The result is both an educational tool and a practical simulation of transportation planning workflows.

## 10. Future Work
- Connect to live traffic data
- Add real GIS maps
- Expand the ML model with richer features
- Store results in a database
- Add mobile-friendly views
- Improve route realism with multi-modal transit support

## 11. References
- FastAPI documentation
- React documentation
- Vite documentation
- scikit-learn documentation
- Standard algorithm textbooks and lecture notes

