# Smart City Transportation Network Optimization

This project models Cairo as a transportation network and uses graph algorithms, dynamic programming, greedy methods, and ML to solve routing and planning problems.

## 1. Tech Stack

### Backend
- **Python**: core implementation language.
- **FastAPI**: exposes algorithm results through HTTP endpoints.
- **Pydantic**: validates request/response data.
- **Uvicorn**: ASGI server used to run the API.
- **scikit-learn / NumPy**: used for traffic prediction and numeric processing.

### Frontend
- **React**: builds the dashboard UI.
- **Vite**: development server and build tool.
- **Axios**: sends requests to the backend API.
- **CSS**: handles layout, theming, and visual design.

### Data
- The network is hardcoded in the repository.
- It includes neighborhoods, facilities, roads, traffic patterns, bus routes, and demand data.
- This makes the project self-contained and easy to run locally.

---

## 2. How the Project Works

### Overall Flow
1. The user opens the React dashboard.
2. A tab is selected for the desired feature.
3. The frontend sends a request to a FastAPI endpoint.
4. The backend runs the selected algorithm on the Cairo dataset.
5. The result is returned as JSON.
6. The React UI renders the result in a map, chart, table, or summary card.

### Main Features
- **Network Map**: shows the Cairo transport graph visually.
- **MST Designer**: compares spanning tree construction with Kruskal and Prim.
- **Route Planner**: finds routes using Dijkstra and A* / traffic-aware variants.
- **Algorithm Race**: compares routing algorithms side by side.
- **Public Transit**: solves bus scheduling and road maintenance with dynamic programming.
- **Traffic Signals**: optimizes signal timing and emergency routing with greedy methods.
- **ML Prediction**: trains a traffic model and predicts road flow.
- **Infrastructure**: shows the network dataset and planning layer.
- **Performance Dashboard**: displays summary metrics from the graph data.

### Backend Logic
- Each algorithm lives in `backend/algorithms/`.
- Router files in `backend/routers/` expose those algorithms through endpoints.
- `backend/main.py` wires everything together and enables CORS, logging, and health checks.

### Frontend Logic
- `frontend/src/App.jsx` controls tab state and calls API functions.
- Each tab component receives result data and callback functions from `App.jsx`.
- The visual maps and result panels update after each API call.

---

## 3. Folder Structure

### Root
- `README.md` - short project summary and setup notes.
- `PROJECT_GUIDE.md` - this detailed explanation file.
- `docker-compose.yml` - container setup for full-stack running.
- `vercel.json` - frontend deployment config.
- `package-lock.json` - npm dependency lockfile.

### `backend/`
- `main.py` - FastAPI application entrypoint.
- `config/` - environment and app settings.
- `data/` - Cairo network dataset and helper lookups.
- `algorithms/` - all graph, DP, greedy, and ML modules.
- `routers/` - API endpoints grouped by feature.
- `utils/` - shared utilities such as logging.

### `frontend/`
- `src/App.jsx` - application controller and tab routing.
- `src/api/client.js` - API client used for backend requests.
- `src/components/` - all visual tabs and reusable UI pieces.
- `src/data/` - frontend-side Cairo map data.
- `src/context/` - shared state management.
- `src/hooks/` - reusable hooks if needed.
- `src/index.css` - global styling.

---

## 4. Backend Components

### `backend/data/cairo_data.py`
- Stores the graph dataset.
- Defines neighborhoods, facilities, roads, traffic patterns, bus routes, and demand.
- Also provides normalized road IDs and index helpers.

### `backend/algorithms/`
- `dijkstra.py` - shortest path search.
- `a_star.py` - heuristic path search.
- `time_dependent_dijkstra.py` - traffic-aware routing.
- `prim.py` and `kruskal.py` - minimum spanning tree algorithms.
- `dp_bus_scheduling.py` - bus allocation optimization.
- `dp_road_maintenance.py` - budget-based road repair planning.
- `greedy_signals.py` - traffic signal prioritization.
- `greedy_emergency.py` - emergency routing.
- `ml_predictor.py` - traffic prediction model.

### `backend/routers/`
- `routing.py` - route planning endpoints.
- `mst.py` - MST endpoints.
- `dp.py` - dynamic programming endpoints.
- `greedy.py` - greedy algorithm endpoints.
- `ml.py` - machine learning endpoints.
- `compare.py` - algorithm comparison endpoint.

---

## 5. Frontend Components

### Main Shell
- `App.jsx` decides which tab to display and handles all API calls.
- `Sidebar.jsx` lets the user switch between tabs.

### Maps and Visualization
- `NetworkMap.jsx` / `NetworkMap3D.jsx` - network visualization.
- `RoadNetworkMap.jsx` - road-layer visualization.
- `BusMap.jsx` and `BusNetworkMap.jsx` - bus route views.
- `Node.jsx`, `NodeTooltip.jsx`, `GlowCard.jsx`, `HUD.jsx` - UI helpers.

### Feature Tabs
- `MSTDesigner.jsx`
- `RoutePlanner.jsx`
- `AlgorithmRace.jsx`
- `PublicTransit.jsx`
- `TrafficSignals.jsx`
- `MLPrediction.jsx`
- `Infrastructure.jsx`
- `PerformanceDashboard.jsx`

---

## 6. Data Flow Summary

### Example: Route Planning
1. User selects source and destination.
2. `RoutePlanner.jsx` calls `/api/route`.
3. Backend routes the request to the routing algorithm.
4. The shortest or best route is computed from the Cairo graph.
5. The returned path is highlighted on the map.

### Example: Bus Scheduling
1. User enters fleet size.
2. Frontend calls `/api/dp/bus-scheduling`.
3. Backend runs dynamic programming on bus routes.
4. The best route set is returned with served passengers and used buses.

### Example: Road Maintenance
1. User enters budget.
2. Frontend calls `/api/dp/road-maintenance`.
3. Backend estimates repair cost and benefit for each road.
4. The selected repair set is returned.

---

## 7. Notes

- The project is designed for academic algorithm comparison and visualization.
- The dataset is static, so the results are reproducible.
- The app is organized so each feature has a separate UI tab and API route.
- The project is easy to extend by adding new algorithms, endpoints, or visual tabs.
