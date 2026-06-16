import React from 'react';
import apiClient from '../api/client';

const STATS = [
  { label: 'Nodes', value: 25 },
  { label: 'Roads', value: 43 },
  { label: 'Network Km', value: '158.6' },
  { label: 'Algorithms', value: 10 },
  { label: 'API Status', value: 'Ready' },
  { label: 'Metro Lines', value: 3 },
];

const NAV_CARDS = [
  { id: 'Network Map', label: 'Network Map', icon: '🗺️', desc: 'Interactive Cairo road network' },
  { id: 'MST Designer', label: 'MST Designer', icon: '🌐', desc: 'Kruskal & Prim MST algorithms' },
  { id: 'Route Planner', label: 'Route Planner', icon: '🛤️', desc: 'Dijkstra & A* pathfinding' },
  { id: 'Algorithm Race', label: 'Algorithm Race', icon: '🏃', desc: 'Dijkstra vs A* side-by-side' },
  { id: 'Public Transit', label: 'Public Transit', icon: '🚍', desc: 'Bus scheduling & road maintenance' },
  { id: 'Traffic Signals', label: 'Traffic Signals', icon: '🚦', desc: 'Greedy signal & emergency routing' },
  { id: 'ML Prediction', label: 'ML Prediction', icon: '🤖', desc: 'Traffic flow prediction with scikit-learn' },
  { id: 'Infrastructure', label: 'Infrastructure', icon: '🏗️', desc: 'Network expansion & road planning' },
];

export default function HomePage({ onSelectTab }) {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <p className="home-eyebrow">CSE112 · Design and Analysis of Algorithms</p>
        <h1 className="home-title">Smart City Transportation<br />Network Optimization</h1>
        <p className="home-desc">
          A comprehensive dashboard for optimizing the Greater Cairo transportation network
          using graph algorithms, dynamic programming, greedy optimization, and machine learning.
          Explore MST design, shortest-path routing, traffic-aware scheduling, and ML-based
          traffic flow prediction — all in one immersive interface.
        </p>
      </div>

      <div className="home-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="home-stat-card">
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>

      <div className="home-nav-grid">
        {NAV_CARDS.map((tab) => (
          <button
            key={tab.id}
            className="home-nav-card"
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="home-nav-icon">{tab.icon}</span>
            <span className="home-nav-label">{tab.label}</span>
            <span className="home-nav-desc">{tab.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
