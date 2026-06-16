import React from 'react';

const TABS = [
  { id: 'Network Map', label: 'Network Map', icon: '🗺️' },
  { id: 'MST Designer', label: 'MST Designer', icon: '🌐' },
  { id: 'Route Planner', label: 'Route Planner', icon: '🛤️' },
  { id: 'Algorithm Race', label: 'Algorithm Race', icon: '🏃' },
  { id: 'Public Transit', label: 'Public Transit', icon: '🚍' },
  { id: 'Traffic Signals', label: 'Traffic Signals', icon: '🚦' },
  { id: 'ML Prediction', label: 'ML Prediction', icon: '🤖' },
  { id: 'Infrastructure', label: 'Infrastructure', icon: '🏗️' },
  { id: 'Performance Dashboard', label: 'Dashboard', icon: '📊' },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <nav className="nav-sidebar">
      <div className="nav-brand" onClick={() => onSelectTab('Home')}>
        <div className="nav-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="nav-brand-text">
          <h1>Smart City</h1>
          <p>Cairo Transport</p>
        </div>
      </div>

      <div className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-footer">
        <p>CSE112 · DAA Project</p>
        <p className="nav-hint">Click tabs to navigate</p>
      </div>
    </nav>
  );
}