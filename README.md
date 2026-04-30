# Smart City Transportation Network Optimization
> CSE112 - Design and Analysis of Algorithms | Alamein International University

## Live Demo
- Frontend: [https://your-vercel-or-github-pages-url](https://smart-city-transportation-network-o.vercel.app)
- Backend: https://your-render-backend-url

## Project Overview
This project models the Greater Cairo transportation network as a weighted graph and applies classic algorithms and machine learning to optimize routing, infrastructure planning, traffic control, and public transit allocation.

The system is split into a Python FastAPI backend and a React frontend. All core datasets are hardcoded in the repository so the project is self-contained and easy to run locally or in Docker.

## Algorithms Implemented
- Kruskal's algorithm for infrastructure MST design
- Prim's algorithm for MST comparison
- Dijkstra's algorithm for standard shortest paths
- A* search for emergency routing
- Time-dependent Dijkstra for traffic-aware routing
- Dynamic programming for bus scheduling
- Dynamic programming for road maintenance planning
- Greedy traffic-signal prioritization
- Greedy emergency preemption routing
- ML-based traffic prediction with scikit-learn
- Side-by-side Dijkstra vs A* comparison

## Project Structure
- `backend/data/cairo_data.py` - hardcoded Cairo dataset
- `backend/algorithms/` - all algorithm implementations
- `backend/routers/` - FastAPI route handlers
- `backend/main.py` - FastAPI app entrypoint
- `frontend/src/` - React application, components, and styling
- `docker-compose.yml` - full-stack orchestration

## Setup & Installation

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### Option 2: Manual Setup
Backend:
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints Reference
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

## Performance Analysis
- MST comparison shows the tradeoff between Kruskal and Prim on the same road set.
- Route planning contrasts static shortest paths with traffic-aware and emergency-aware routing.
- DP modules demonstrate constrained optimization under fleet and budget limits.
- The ML model predicts road-level traffic flow from historical temporal patterns.

## Screenshots
Add screenshots of the dashboard tabs here after running the frontend.

## ML Traffic Prediction
The traffic model is trained on the road-level temporal flow data for morning, afternoon, evening, and night. It predicts vehicle flow from a road ID and time of day, then returns the predicted value alongside the actual value and model metrics.

## Team
- Your Name
- Team Member 2
- Team Member 3

## License
For academic use as part of CSE112.

<!--
LinkedIn Post Template:
Just built a Smart City Transportation Optimization System for Cairo!
Dijkstra, A*, Kruskal's MST, Dynamic Programming + ML traffic prediction.
Stack: React + FastAPI + Python + scikit-learn/TensorFlow
Live Demo: [link]
#SmartCity #Algorithms #Python #React #CSE112 #Cairo #MachineLearning #AlgorithmsInAction
-->
