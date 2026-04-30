import React, { useState } from 'react';
import { allNodes } from '../data/cairoData';

export default function AlgorithmRace({ compareResult, onRunCompare }) {
  const [source, setSource] = useState(allNodes[0]?.id ?? 1);
  const [destination, setDestination] = useState(allNodes[4]?.id ?? 5);

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Algorithm Race</h2>
          <p>Compare Dijkstra and A* side by side for the same route.</p>
        </div>
        <div className="control-grid">
          <label className="control-chip">
            <span>Source</span>
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              {allNodes.map((node) => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </label>
          <label className="control-chip">
            <span>Destination</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {allNodes.map((node) => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="primary-button"
            onClick={() => onRunCompare?.({ source, destination })}
          >
            Run Race
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Dijkstra</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Visited</span><strong>{compareResult?.result?.dijkstra?.visited_nodes?.length ?? '—'}</strong></div>
            <div className="metric-card"><span>Time</span><strong>{compareResult?.result?.dijkstra?.execution_time_ms ?? '—'} ms</strong></div>
            <div className="metric-card"><span>Length</span><strong>{compareResult?.result?.dijkstra?.path_length ?? '—'}</strong></div>
            <div className="metric-card"><span>Distance</span><strong>{compareResult?.result?.dijkstra?.total_distance_km ?? '—'}</strong></div>
          </div>
          <div className="detail-list">
            {(compareResult?.result?.dijkstra?.visited_nodes || []).map((nodeId, index) => (
              <div key={`d-${nodeId}-${index}`} className="detail-item">{index + 1}. {nodeId}</div>
            ))}
          </div>
        </div>

        <div className="insight-panel large-panel">
          <h3>A*</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Visited</span><strong>{compareResult?.result?.astar?.visited_nodes?.length ?? '—'}</strong></div>
            <div className="metric-card"><span>Time</span><strong>{compareResult?.result?.astar?.execution_time_ms ?? '—'} ms</strong></div>
            <div className="metric-card"><span>Length</span><strong>{compareResult?.result?.astar?.path_length ?? '—'}</strong></div>
            <div className="metric-card"><span>Distance</span><strong>{compareResult?.result?.astar?.total_distance_km ?? '—'}</strong></div>
          </div>
          <div className="detail-list">
            {(compareResult?.result?.astar?.visited_nodes || []).map((nodeId, index) => (
              <div key={`a-${nodeId}-${index}`} className="detail-item">{index + 1}. {nodeId}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
