import React, { useMemo, useState } from 'react';
import { allNodes } from '../data/cairoData';

export default function RoutePlanner({ routeResult, onRunRoute }) {
  const [source, setSource] = useState(allNodes[0]?.id ?? 1);
  const [destination, setDestination] = useState(allNodes[4]?.id ?? 5);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [mode, setMode] = useState('standard');

  const nodeOptions = useMemo(() => allNodes, []);
  const highlightedRoadIds = routeResult?.result?.edges?.map((edge) => edge.road_id) || [];

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Route Planner</h2>
          <p>Pick a route and compare standard versus emergency search.</p>
        </div>
        <div className="control-grid">
          <label className="control-chip">
            <span>Source</span>
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              {nodeOptions.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </label>
          <label className="control-chip">
            <span>Destination</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {nodeOptions.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </label>
          <label className="control-chip">
            <span>Time of Day</span>
            <select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value)}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>
          <label className="control-chip">
            <span>Mode</span>
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="standard">Standard</option>
              <option value="emergency">Emergency</option>
            </select>
          </label>
          <button
            type="button"
            className="primary-button"
            onClick={() => onRunRoute?.({ source, destination, timeOfDay, mode })}
          >
            Find Route
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Route Output</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Algorithm</span><strong>{routeResult?.algorithm ?? '—'}</strong></div>
            <div className="metric-card"><span>Distance</span><strong>{routeResult?.result?.total_distance_km ?? routeResult?.result?.total_weight ?? '—'}</strong></div>
            <div className="metric-card"><span>Reachable</span><strong>{routeResult?.result?.reachable ? 'Yes' : '—'}</strong></div>
            <div className="metric-card"><span>Execution</span><strong>{routeResult?.execution_time_ms ?? '—'} ms</strong></div>
          </div>
          <div className="detail-list">
            {(routeResult?.result?.path || []).map((nodeId, index) => (
              <div key={`${nodeId}-${index}`} className="detail-item">
                <span>{index + 1}. {nodeId}</span>
              </div>
            ))}
          </div>
          <div className="chart-placeholder">
            Congestion overlay and step-by-step path animation hook here.
          </div>
        </div>

        <div className="insight-panel large-panel">
          <h3>Path Edges</h3>
          <div className="detail-list">
            {(routeResult?.result?.edges || []).map((edge, index) => (
              <div key={`${edge.road_id}-${index}`} className="detail-item">
                <span>{edge.road_id}</span>
                <small>{edge.from} → {edge.to} | {edge.segment_distance_km ?? edge.segment_weight ?? '—'}</small>
              </div>
            ))}
          </div>
          <div className="chart-placeholder">
            Road highlight: {highlightedRoadIds.length ? highlightedRoadIds.join(', ') : 'none'}
          </div>
        </div>
      </div>
    </div>
  );
}
