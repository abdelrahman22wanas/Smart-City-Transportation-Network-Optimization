import React, { useEffect, useMemo, useState } from 'react';
import apiClient from './api/client';
import './index.css';
import Sidebar from './components/Sidebar';
import NetworkMap from './components/NetworkMap';
import MSTDesigner from './components/MSTDesigner';
import RoutePlanner from './components/RoutePlanner';
import AlgorithmRace from './components/AlgorithmRace';
import PublicTransit from './components/PublicTransit';
import TrafficSignals from './components/TrafficSignals';
import MLPrediction from './components/MLPrediction';
import Infrastructure from './components/Infrastructure';
import PerformanceDashboard from './components/PerformanceDashboard';
import { allNodes, existingRoads, trafficPatterns } from './data/cairoData';

function computeDashboardMetrics() {
  const totalNetworkKm = existingRoads.reduce((sum, r) => sum + r.distance_km, 0).toFixed(1);

  // Busiest road by morning traffic
  const busiestEntry = Object.entries(trafficPatterns).reduce((best, [id, p]) =>
    p.morning > (best[1]?.morning ?? 0) ? [id, p] : best, ['', null]);
  const busiestRoad = busiestEntry[0];

  // Avg congestion ratio across all roads/times
  const congestionValues = existingRoads.flatMap(r => {
    const key = `${r.from}-${r.to}`;
    const revKey = `${r.to}-${r.from}`;
    const pattern = trafficPatterns[key] || trafficPatterns[revKey];
    if (!pattern) return [];
    return Object.values(pattern).map(flow => flow / r.capacity_veh_h);
  });
  const avgCongestion = congestionValues.length
    ? (congestionValues.reduce((a, b) => a + b, 0) / congestionValues.length * 100).toFixed(1) + '%'
    : '—';

  // Most isolated node = fewest road connections
  const degree = {};
  allNodes.forEach(n => { degree[n.id] = 0; });
  existingRoads.forEach(r => { degree[r.from] = (degree[r.from] || 0) + 1; degree[r.to] = (degree[r.to] || 0) + 1; });
  const minId = Object.entries(degree).reduce((a, b) => b[1] < a[1] ? b : a)[0];
  const minNode = allNodes.find(n => String(n.id) === String(minId));

  return {
    totalNetworkKm: `${totalNetworkKm} km`,
    avgCongestionRatio: avgCongestion,
    busiestRoad,
    mostIsolatedNode: minNode?.name ?? minId,
  };
}

const defaultDashboardMetrics = computeDashboardMetrics();

export default function App() {
  const [activeTab, setActiveTab] = useState('Network Map');
  const [mstResult, setMstResult] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [busResult, setBusResult] = useState(null);
  const [maintenanceResult, setMaintenanceResult] = useState(null);
  const [signalsResult, setSignalsResult] = useState(null);
  const [emergencyResult, setEmergencyResult] = useState(null);
  const [mlTrainResult, setMlTrainResult] = useState(null);
  const [mlPredictResult, setMlPredictResult] = useState(null);
  const [dashboardMetrics] = useState(defaultDashboardMetrics);
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${((index * 37) % 100) + 0.3}%`,
        delay: `${(index % 9) * -1.4}s`,
        duration: `${10 + (index % 7) * 2}s`,
        size: `${2 + (index % 4)}px`,
      })),
    [],
  );

  useEffect(() => {
    void apiClient.get('/health').catch(() => null);
  }, []);

  async function runMst({ algorithm, includeNew }) {
    const response = await apiClient.get('/api/mst', {
      params: { algorithm, include_new: includeNew },
    });
    setMstResult(response.data);
    setActiveTab('MST Designer');
  }

  async function runRoute({ source, destination, timeOfDay, mode }) {
    const response = await apiClient.get('/api/route', {
      params: { from: source, to: destination, time: timeOfDay, mode },
    });
    setRouteResult(response.data);
    setActiveTab('Route Planner');
  }

  async function runCompare({ source, destination }) {
    const response = await apiClient.get('/api/compare/dijkstra-vs-astar', {
      params: { from: source, to: destination },
    });
    setCompareResult(response.data);
    setActiveTab('Algorithm Race');
  }

  async function runBusScheduling(totalBuses) {
    const response = await apiClient.get('/api/dp/bus-scheduling', {
      params: { total_buses: totalBuses },
    });
    setBusResult(response.data);
    setActiveTab('Public Transit');
  }

  async function runMaintenance(budget) {
    const response = await apiClient.get('/api/dp/road-maintenance', {
      params: { budget },
    });
    setMaintenanceResult(response.data);
    setActiveTab('Public Transit');
  }

  async function runSignals(timeOfDay) {
    const response = await apiClient.get('/api/greedy/signals', {
      params: { time: timeOfDay },
    });
    setSignalsResult(response.data);
    setActiveTab('Traffic Signals');
  }

  async function runEmergency({ startNode, hospitalId }) {
    const response = await apiClient.get('/api/greedy/emergency', {
      params: { from: startNode, to: hospitalId },
    });
    setEmergencyResult(response.data);
    setActiveTab('Traffic Signals');
  }

  async function runTrain() {
    const response = await apiClient.get('/api/ml/train');
    setMlTrainResult(response.data);
    setActiveTab('ML Prediction');
  }

  async function runPredict({ road, timeOfDay }) {
    const response = await apiClient.get('/api/ml/predict', {
      params: { road, time: timeOfDay },
    });
    setMlPredictResult(response.data);
    setActiveTab('ML Prediction');
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Network Map':
        return <NetworkMap />;
      case 'MST Designer':
        return <MSTDesigner mstResult={mstResult} onRunMst={runMst} />;
      case 'Route Planner':
        return <RoutePlanner routeResult={routeResult} onRunRoute={runRoute} />;
      case 'Algorithm Race':
        return <AlgorithmRace compareResult={compareResult} onRunCompare={runCompare} />;
      case 'Public Transit':
        return (
          <PublicTransit
            busResult={busResult}
            maintenanceResult={maintenanceResult}
            onRunBus={runBusScheduling}
            onRunMaintenance={runMaintenance}
          />
        );
      case 'Traffic Signals':
        return (
          <TrafficSignals
            signalsResult={signalsResult}
            emergencyResult={emergencyResult}
            onRunSignals={runSignals}
            onRunEmergency={runEmergency}
          />
        );
      case 'ML Prediction':
        return (
          <MLPrediction
            mlTrainResult={mlTrainResult}
            mlPredictResult={mlPredictResult}
            onTrain={runTrain}
            onPredict={runPredict}
          />
        );
      case 'Infrastructure':
        return <Infrastructure />;
      case 'Performance Dashboard':
        return <PerformanceDashboard metrics={dashboardMetrics} />;
      default:
        return <NetworkMap />;
    }
  };

  const isMapTab = activeTab === 'Network Map';

  return (
    <>
      <div className="particle-field" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle-dot"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="app-shell">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <main className="content-shell">
          {isMapTab ? (
            <div className="map-fullscreen">
              <NetworkMap />
            </div>
          ) : (
            <section className="main-stage scrollable">
              <div className="page-header">
                <div>
                  <p className="eyebrow">CSE112 · Design and Analysis of Algorithms</p>
                  <h1>Smart City Transportation Network Optimization</h1>
                  <p>
                    A dark, data-rich Cairo dashboard for graph algorithms, dynamic programming,
                    greedy optimization, and traffic prediction.
                  </p>
                </div>
                <div className="hero-stats">
                  <div className="hero-stat-card">
                    <span>Nodes</span>
                    <strong>25</strong>
                  </div>
                  <div className="hero-stat-card">
                    <span>Roads</span>
                    <strong>43</strong>
                  </div>
                  <div className="hero-stat-card">
                    <span>API Status</span>
                    <strong>Ready</strong>
                  </div>
                </div>
              </div>
              {renderContent()}
            </section>
          )}
        </main>
      </div>
    </>
  );
}