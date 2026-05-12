# Smart City Transportation Network Optimization

CSE112 - Design and Analysis of Algorithms Project

## Overview

This is a comprehensive smart city transportation network optimization system for Greater Cairo, Egypt. It includes metro lines, bus networks, traffic signal optimization, and ML-based prediction.

## What's New (Latest Updates)

### 1. Light Mode Theme
- Complete UI redesign with white/light professional theme
- Cairo Metro official colors (Line 1 Red, Line 2 Green, Line 3 Orange, Line 4 Blue)
- Clean, modern interface

### 2. Metro Map (Enhanced)
- 2x larger scale (2000x1300 viewBox)
- Interactive preview modal with mouse controls
- Scroll to zoom, drag to pan
- Station labels on hover
- Line filtering by color
- Official Cairo Metro colors

### 3. Bus Network (NEW!)
- 7 city bus networks from Mwazalat Misr:
  - Greater Cairo
  - Sheikh Zayed
  - 6th October
  - 10th Ramadan
  - Obour
  - Shorouk
  - New Cairo
- City selector dropdown
- Interactive stops with hover details
- Route visualization with colors

### 4. Traffic Light Optimization
- Enhanced ML training with real Cairo intersection data
- 10 major intersection coordinates added
- Peak hour patterns (morning, afternoon, evening, night)
- Signal timing parameters

### 5. Enhanced ML Prediction
- Traffic flow prediction model
- Training metrics (MAE, R² score)
- Loss curve visualization
- Prediction vs actual comparison

## Navigation Tabs

| Tab | Description |
|-----|-------------|
| 🚇 Metro Map | Cairo Metro lines (M1-M4) |
| 🚌 Bus Network | Mwazalat Misr bus routes |
| 🌐 MST Designer | Minimum Spanning Tree |
| 🛤️ Route Planner | Pathfinding (Dijkstra/A*) |
| 🏃 Algorithm Race | Compare algorithms |
| 🚍 Public Transit | Bus scheduling |
| 🚦 Traffic Signals | Signal optimization |
| 🤖 ML Prediction | Traffic prediction |
| 🏗️ Infrastructure | Network configuration |
| 📊 Dashboard | Performance metrics |

## Tech Stack

- **Frontend**: React 19, Vite, Three.js
- **Backend**: Python FastAPI, scikit-learn
- **Styling**: CSS custom properties, light mode

## Running the Project

### Prerequisites
```bash
# Node.js and Python installed
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NetworkMap.jsx     # Metro map
│   │   │   ├── BusMap.jsx         # Bus network
│   │   │   ├── MLPrediction.jsx   # ML training
│   │   │   └── ...
│   │   ├── data/
│   │   │   ├── cairoNetwork.js   # Metro stations
│   │   │   └── busNetwork.js      # Bus routes (NEW!)
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── algorithms/
│   │   ├── ml_predictor.py       # ML model
│   │   ├── dijkstra.py
│   │   ├── a_star.py
│   │   └── ...
│   ├── data/
│   │   └── cairo_data.py         # Network data
│   └── requirements.txt
```

## Data Sources

- **Metro**: Cairo Metro official data (~133 stations)
- **Bus**: MwazalatMisr.com maps (7 cities)
- **Traffic Lights**: Cairo traffic research papers
- **Roads**: Cairo road network data

## Algorithms Implemented

| Algorithm | Type | Description |
|------------|------|-------------|
| Dijkstra | Graph | Shortest path |
| A* | Graph | Heuristic pathfinding |
| Kruskal | Graph | MST (edges) |
| Prim | Graph | MST (vertices) |
| Genetic Algorithm | Optimization | Traffic signals |
| MLP Neural Network | ML | Traffic prediction |

## Features in Development

- [x] Light mode theme
- [x] Metro map with zoom/pan
- [x] Bus network visualization
- [x] City selector
- [x] ML prediction model
- [ ] Offline map support
- [ ] Mobile responsiveness
- [ ] Real-time data integration

## License

CSE112 - Design and Analysis of Algorithms
Faculty of Engineering, Cairo University

---

## Version History

- v2.0 (Current) - Major update with bus networks, light mode, enhanced ML
- v1.0 - Initial release with metro map only