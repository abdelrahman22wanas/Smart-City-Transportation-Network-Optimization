import React, { useState } from 'react';

export default function PublicTransit({ busResult, maintenanceResult, onRunBus, onRunMaintenance }) {
  const [busCount, setBusCount] = useState(214);
  const [budget, setBudget] = useState(500);

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Public Transit</h2>
          <p>Optimize bus allocation and road repairs with dynamic programming.</p>
        </div>
        <div className="control-grid">
          <label className="control-chip">
            <span>Total Buses</span>
            <input type="number" value={busCount} onChange={(event) => setBusCount(Number(event.target.value))} />
          </label>
          <button type="button" className="primary-button" onClick={() => onRunBus?.(busCount)}>
            Solve Bus Scheduling
          </button>
          <label className="control-chip">
            <span>Maintenance Budget</span>
            <input type="number" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
          </label>
          <button type="button" className="primary-button" onClick={() => onRunMaintenance?.(budget)}>
            Solve Maintenance
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Bus Scheduling</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Served Passengers</span><strong>{busResult?.result?.served_passengers ?? '—'}</strong></div>
            <div className="metric-card"><span>Used Buses</span><strong>{busResult?.result?.used_buses ?? '—'}</strong></div>
            <div className="metric-card"><span>Remaining</span><strong>{busResult?.result?.remaining_buses ?? '—'}</strong></div>
            <div className="metric-card"><span>Routes Chosen</span><strong>{busResult?.result?.selected_routes?.length ?? '—'}</strong></div>
          </div>
          <div className="detail-list">
            {(busResult?.result?.selected_routes || []).map((route) => (
              <div key={route.id} className="detail-item">
                <span>{route.id}</span>
                <small>{route.buses_assigned} buses | {route.daily_passengers} passengers</small>
              </div>
            ))}
          </div>
          <div className="chart-placeholder">DP table visualisation hook</div>
        </div>

        <div className="insight-panel large-panel">
          <h3>Road Maintenance</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Improvement</span><strong>{maintenanceResult?.result?.total_condition_improvement ?? '—'}</strong></div>
            <div className="metric-card"><span>Used Budget</span><strong>{maintenanceResult?.result?.used_budget_million_egp ?? '—'}</strong></div>
            <div className="metric-card"><span>Remaining</span><strong>{maintenanceResult?.result?.remaining_budget_million_egp ?? '—'}</strong></div>
            <div className="metric-card"><span>Roads Chosen</span><strong>{maintenanceResult?.result?.selected_roads?.length ?? '—'}</strong></div>
          </div>
          <div className="detail-list">
            {(maintenanceResult?.result?.selected_roads || []).map((road) => (
              <div key={`${road.from}-${road.to}`} className="detail-item">
                <span>{road.from} → {road.to}</span>
                <small>cost {road.estimated_repair_cost_million_egp}M | score {road.condition_improvement_score}</small>
              </div>
            ))}
          </div>
          <div className="chart-placeholder">Road repair table visualisation hook</div>
        </div>
      </div>
    </div>
  );
}
