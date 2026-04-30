import React from 'react';

export default function PerformanceDashboard({ metrics }) {
  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Performance Dashboard</h2>
          <p>Runtime comparisons, cost analysis, and congestion summaries.</p>
        </div>
      </div>

      <div className="metric-grid dashboard-grid">
        <div className="metric-card"><span>Total Network Km</span><strong>{metrics?.totalNetworkKm ?? '—'}</strong></div>
        <div className="metric-card"><span>Avg Congestion</span><strong>{metrics?.avgCongestionRatio ?? '—'}</strong></div>
        <div className="metric-card"><span>Busiest Road</span><strong>{metrics?.busiestRoad ?? '—'}</strong></div>
        <div className="metric-card"><span>Most Isolated Node</span><strong>{metrics?.mostIsolatedNode ?? '—'}</strong></div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Runtime Comparison</h3>
          <div className="chart-placeholder">Runtime bar chart hook</div>
        </div>
        <div className="insight-panel large-panel">
          <h3>MST Cost Breakdown</h3>
          <div className="chart-placeholder">Cost pie chart hook</div>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Congestion Heatmap</h3>
          <div className="chart-placeholder">Heatmap visualisation hook</div>
        </div>
        <div className="insight-panel large-panel">
          <h3>Key Notes</h3>
          <div className="detail-list">
            <div className="detail-item">
              <span>Network span</span>
              <small>15 neighborhoods, 10 facilities, mixed road network</small>
            </div>
            <div className="detail-item">
              <span>Optimization focus</span>
              <small>MST, routing, DP, greedy, and ML prediction</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
