import React from 'react';

const tabs = [
  'Network Map',
  'MST Designer',
  'Route Planner',
  'Algorithm Race',
  'Public Transit',
  'Traffic Signals',
  'ML Prediction',
  'Performance Dashboard',
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">CSE112</div>
        <div>
          <h1>Smart City Network</h1>
          <p>Cairo transportation optimization dashboard</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'sidebar-tab active' : 'sidebar-tab'}
            onClick={() => onSelectTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stat">
          <span>Mode</span>
          <strong>Dark Dashboard</strong>
        </div>
        <div className="sidebar-stat">
          <span>Backend</span>
          <strong>FastAPI</strong>
        </div>
        <div className="sidebar-stat">
          <span>Frontend</span>
          <strong>React</strong>
        </div>
      </div>
    </aside>
  );
}
