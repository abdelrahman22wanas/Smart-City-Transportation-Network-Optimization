import React, { useState, useMemo, useEffect } from 'react';
import { normalizeRoadId } from '../data/cairoData';
import RoadNetworkMap from './RoadNetworkMap';

export default function PublicTransit({ busResult, maintenanceResult, onRunBus, onRunMaintenance }) {
  const [busCount, setBusCount] = useState(214);
  const [budget, setBudget] = useState(500);
  const [activeView, setActiveView] = useState('bus');

  const busRouteEdges = useMemo(() => {
    if (!busResult?.result?.selected_routes) return [];
    const edges = new Set();
    busResult.result.selected_routes.forEach((route) => {
      const stops = route.stops || [];
      for (let i = 0; i < stops.length - 1; i++) {
        const edgeId = normalizeRoadId(stops[i], stops[i + 1]);
        edges.add(edgeId);
      }
    });
    return [...edges];
  }, [busResult]);

  const busRouteNodes = useMemo(() => {
    if (!busResult?.result?.selected_routes) return [];
    const nodes = new Set();
    busResult.result.selected_routes.forEach((route) => {
      const stops = route.stops || [];
      stops.forEach((nodeId) => nodes.add(nodeId));
    });
    return [...nodes];
  }, [busResult]);

  const maintenanceEdges = useMemo(() => {
    if (!maintenanceResult?.result?.selected_roads) return [];
    return maintenanceResult.result.selected_roads.map((road) => 
      normalizeRoadId(road.from, road.to)
    );
  }, [maintenanceResult]);

  const maintenanceNodes = useMemo(() => {
    if (!maintenanceResult?.result?.selected_roads) return [];
    const nodes = new Set();
    maintenanceResult.result.selected_roads.forEach((road) => {
      if (road.from) nodes.add(road.from);
      if (road.to) nodes.add(road.to);
    });
    return [...nodes];
  }, [maintenanceResult]);

  // Auto-switch view when results arrive for better UX
  useEffect(() => {
    if (busResult?.result) setActiveView('bus');
  }, [busResult]);

  useEffect(() => {
    if (maintenanceResult?.result) setActiveView('maintenance');
  }, [maintenanceResult]);

  const highlightedRoadIds = activeView === 'bus' ? busRouteEdges : maintenanceEdges;
  const highlightedNodeIds = activeView === 'bus' ? busRouteNodes : maintenanceNodes;
  const showBaseNetwork = true;

  const handleRunBus = () => {
    console.log('[PublicTransit] Solve Bus Scheduling clicked', { busCount });
    onRunBus?.(busCount);
  };

  const handleRunMaintenance = () => {
    console.log('[PublicTransit] Solve Maintenance clicked', { budget });
    onRunMaintenance?.(budget);
  };

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
          <button type="button" className="primary-button" onClick={handleRunBus}>
            Solve Bus Scheduling
          </button>
          <label className="control-chip">
            <span>Maintenance Budget</span>
            <input type="number" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
          </label>
          <button type="button" className="primary-button" onClick={handleRunMaintenance}>
            Solve Maintenance
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="map-panel">
          <RoadNetworkMap 
            highlightedRoadIds={highlightedRoadIds}
            highlightedNodeIds={highlightedNodeIds}
            showBaseNetwork={showBaseNetwork}
          />
        </div>

        <div className="insight-panel">
          <div className="view-toggle">
            <button 
              type="button"
              className={`toggle-btn ${activeView === 'bus' ? 'active' : ''}`}
              onClick={() => setActiveView('bus')}
            >
              Bus Routes
            </button>
            <button 
              type="button"
              className={`toggle-btn ${activeView === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveView('maintenance')}
            >
              Road Maintenance
            </button>
          </div>

          {activeView === 'bus' && (
            <>
              <h3>Bus Scheduling</h3>
              <div className="metric-grid">
                <div className="metric-card">
                  <span>Served Passengers</span>
                  <strong>{busResult?.result?.served_passengers ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Used Buses</span>
                  <strong>{busResult?.result?.used_buses ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Remaining</span>
                  <strong>{busResult?.result?.remaining_buses ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Routes Chosen</span>
                  <strong>{busResult?.result?.selected_routes?.length ?? '—'}</strong>
                </div>
              </div>
              <div className="detail-list">
                <h4>Selected Routes</h4>
                {(busResult?.result?.selected_routes || []).map((route) => (
                  <div key={route.id} className="detail-item">
                    <span>{route.id}</span>
                    <small>{route.buses_assigned} buses | {route.daily_passengers} passengers</small>
                  </div>
                ))}
                {(!busResult?.result?.selected_routes || busResult.result.selected_routes.length === 0) && (
                  <div className="empty-state">
                    Click "Solve Bus Scheduling" to optimize bus allocation.
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === 'maintenance' && (
            <>
              <h3>Road Maintenance</h3>
              <div className="metric-grid">
                <div className="metric-card">
                  <span>Improvement</span>
                  <strong>{maintenanceResult?.result?.total_condition_improvement ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Used Budget</span>
                  <strong>{maintenanceResult?.result?.used_budget_million_egp ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Remaining</span>
                  <strong>{maintenanceResult?.result?.remaining_budget_million_egp ?? '—'}</strong>
                </div>
                <div className="metric-card">
                  <span>Roads Chosen</span>
                  <strong>{maintenanceResult?.result?.selected_roads?.length ?? '—'}</strong>
                </div>
              </div>
              <div className="detail-list">
                <h4>Selected Roads</h4>
                {(maintenanceResult?.result?.selected_roads || []).map((road, index) => (
                  <div key={`${road.from}-${road.to}-${index}`} className="detail-item">
                    <span>{normalizeRoadId(road.from, road.to)}</span>
                    <small>cost {road.estimated_repair_cost_million_egp}M | score {road.condition_improvement_score}</small>
                  </div>
                ))}
                {(!maintenanceResult?.result?.selected_roads || maintenanceResult.result.selected_roads.length === 0) && (
                  <div className="empty-state">
                    Click "Solve Maintenance" to optimize road repairs.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}