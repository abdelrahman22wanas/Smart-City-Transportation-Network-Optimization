import React, { useMemo, useState } from 'react';
import { allNodes, normalizeRoadId } from '../data/cairoData';
import RoadNetworkMap from './RoadNetworkMap';

export default function RoutePlanner({ routeResult, onRunRoute }) {
  const [source, setSource] = useState(allNodes[0]?.id ?? 1);
  const [destination, setDestination] = useState(allNodes[4]?.id ?? 5);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [mode, setMode] = useState('standard');

  const nodeOptions = useMemo(() => allNodes, []);
  
  const highlightedRoadIds = useMemo(() => {
    if (routeResult?.result?.edges?.length > 0) {
      return routeResult.result.edges.map((edge) => edge.road_id).filter(Boolean);
    }
    if (routeResult?.result?.path?.length > 1) {
      const path = routeResult.result.path;
      const roadIds = [];
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        roadIds.push(normalizeRoadId(from, to));
      }
      return roadIds;
    }
    return [];
  }, [routeResult]);

  const primaryPath = useMemo(
    () => routeResult?.result?.path?.map(String) || [],
    [routeResult],
  );

  const highlightedNodeIds = useMemo(() => {
    const ids = [];
    if (source) ids.push(source);
    if (destination) ids.push(destination);
    return ids;
  }, [source, destination]);

  const handleSourceChange = (value) => {
    const numValue = Number(value);
    setSource(isNaN(numValue) ? value : numValue);
  };

  const handleDestinationChange = (value) => {
    const numValue = Number(value);
    setDestination(isNaN(numValue) ? value : numValue);
  };

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
            <select value={source} onChange={(event) => handleSourceChange(event.target.value)}>
              {nodeOptions.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </label>
          <label className="control-chip">
            <span>Destination</span>
            <select value={destination} onChange={(event) => handleDestinationChange(event.target.value)}>
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
        <div className="map-panel">
          <RoadNetworkMap 
            highlightedRoadIds={highlightedRoadIds}
            highlightedNodeIds={highlightedNodeIds}
            primaryPath={primaryPath}
            showBaseNetwork={true}
          />
        </div>

        <div className="insight-panel">
          <h3>Route Output</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Algorithm</span>
              <strong>{routeResult?.algorithm ?? '—'}</strong>
            </div>
            <div className="metric-card">
              <span>Distance</span>
              <strong>{routeResult?.result?.total_distance_km ?? routeResult?.result?.total_weight ?? '—'}</strong>
            </div>
            <div className="metric-card">
              <span>Reachable</span>
              <strong>{routeResult?.result?.reachable ? 'Yes' : '—'}</strong>
            </div>
            <div className="metric-card">
              <span>Execution</span>
              <strong>{routeResult?.execution_time_ms ?? '—'} ms</strong>
            </div>
          </div>

          <div className="detail-list">
            <h4>Path Nodes</h4>
            {(routeResult?.result?.path || []).map((nodeId, index) => (
              <div key={`path-${nodeId}-${index}`} className="detail-item">
                <span className="path-step">{index + 1}</span>
                <span>{nodeId}</span>
              </div>
            ))}
            {(!routeResult?.result?.path || routeResult.result.path.length === 0) && (
              <div className="empty-state">
                Click "Find Route" to compute the shortest path and see the network visualization.
              </div>
            )}
          </div>

          <div className="detail-list">
            <h4>Path Edges</h4>
            {(routeResult?.result?.edges || []).map((edge, index) => (
              <div key={`edge-${edge.road_id}-${index}`} className="detail-item">
                <span>{edge.road_id}</span>
                <small>{edge.from} → {edge.to} | {edge.segment_distance_km ?? edge.segment_weight ?? '—'} km</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}