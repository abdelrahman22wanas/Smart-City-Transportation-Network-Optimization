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
import PerformanceDashboard from './components/PerformanceDashboard';
import GlowCard from './components/GlowCard';

const defaultDashboardMetrics = {
  totalNetworkKm: '—',
  avgCongestionRatio: '—',
  busiestRoad: '—',
  mostIsolatedNode: '—',
};

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

  const contentByTab = {
    'Network Map': <NetworkMap />,
    'MST Designer': <MSTDesigner mstResult={mstResult} onRunMst={runMst} />,
    'Route Planner': <RoutePlanner routeResult={routeResult} onRunRoute={runRoute} />,
    'Algorithm Race': <AlgorithmRace compareResult={compareResult} onRunCompare={runCompare} />,
    'Public Transit': (
      <PublicTransit
        busResult={busResult}
        maintenanceResult={maintenanceResult}
        onRunBus={runBusScheduling}
        onRunMaintenance={runMaintenance}
      />
    ),
    'Traffic Signals': (
      <TrafficSignals
        signalsResult={signalsResult}
        emergencyResult={emergencyResult}
        onRunSignals={runSignals}
        onRunEmergency={runEmergency}
      />
    ),
    'ML Prediction': (
      <MLPrediction
        mlTrainResult={mlTrainResult}
        mlPredictResult={mlPredictResult}
        onTrain={runTrain}
        onPredict={runPredict}
      />
    ),
    'Performance Dashboard': <PerformanceDashboard metrics={dashboardMetrics} />,
  };

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
          <section className="hero-panel">
            <GlowCard className="hero-copy-card">
              <div>
              <p className="eyebrow">CSE112 · Design and Analysis of Algorithms</p>
              <h1>Smart City Transportation Network Optimization</h1>
              <p>
                A dark, data-rich Cairo dashboard for graph algorithms, dynamic programming,
                greedy optimization, and traffic prediction.
              </p>
              </div>
            </GlowCard>
            <div className="hero-stats">
              <GlowCard className="hero-stat-card">
                <span>Nodes</span>
                <strong>25</strong>
              </GlowCard>
              <GlowCard className="hero-stat-card">
                <span>Roads</span>
                <strong>43</strong>
              </GlowCard>
              <GlowCard className="hero-stat-card">
                <span>API Status</span>
                <strong>Ready</strong>
              </GlowCard>
            </div>
          </section>

          <section className="main-stage">{contentByTab[activeTab]}</section>
        </main>
      </div>
    </>
  );
}
