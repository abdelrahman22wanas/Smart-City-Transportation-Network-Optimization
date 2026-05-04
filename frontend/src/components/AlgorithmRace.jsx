import React, { useState, useMemo } from 'react';
import { allNodes, normalizeRoadId } from '../data/cairoData';
import RoadNetworkMap from './RoadNetworkMap';

export default function AlgorithmRace({ compareResult, onRunCompare }) {
  const [source, setSource] = useState(allNodes[0]?.id ?? 1);
  const [destination, setDestination] = useState(allNodes[4]?.id ?? 5);
  const [activePath, setActivePath] = useState('both');

  const handleSourceChange = (value) => {
    const numValue = Number(value);
    setSource(isNaN(numValue) ? value : numValue);
  };

  const handleDestinationChange = (value) => {
    const numValue = Number(value);
    setDestination(isNaN(numValue) ? value : numValue);
  };

  const dijkstraPath = useMemo(
    () => compareResult?.result?.dijkstra?.path?.map(String) || [],
    [compareResult],
  );

  const astarPath = useMemo(
    () => compareResult?.result?.astar?.path?.map(String) || [],
    [compareResult],
  );

  const dijkstraEdges = useMemo(() => {
    const edges = compareResult?.result?.dijkstra?.edges || [];
    return edges.map(edge => edge.road_id);
  }, [compareResult]);

  const astarEdges = useMemo(() => {
    const edges = compareResult?.result?.astar?.edges || [];
    return edges.map(edge => edge.road_id);
  }, [compareResult]);

  const primaryPath = activePath === 'dijkstra' ? dijkstraPath : activePath === 'astar' ? astarPath : dijkstraPath;
  const secondaryPath = activePath === 'both' ? astarPath : [];
  
  const highlightedRoadIds = activePath === 'dijkstra' ? dijkstraEdges : activePath === 'astar' ? astarEdges : dijkstraEdges;
  const secondaryPathIds = activePath === 'both' ? astarEdges : [];

  const highlightedNodeIds = useMemo(() => {
    const ids = [];
    if (source) ids.push(source);
    if (destination) ids.push(destination);
    return ids;
  }, [source, destination]);

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
            <select value={source} onChange={(event) => handleSourceChange(event.target.value)}>
              {allNodes.map((node) => (
                <option key={node.id} value={node.id}>{node.name}</option>
              ))}
            </select>
          </label>
          <label className="control-chip">
            <span>Destination</span>
            <select value={destination} onChange={(event) => handleDestinationChange(event.target.value)}>
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
        <div className="map-panel">
          <RoadNetworkMap 
            highlightedRoadIds={highlightedRoadIds}
            highlightedNodeIds={highlightedNodeIds}
            primaryPath={primaryPath}
            secondaryPath={secondaryPath}
            showBaseNetwork={true}
          />
        </div>

        <div className="race-panels">
          <div className="path-toggle">
            <button 
              type="button"
              className={`toggle-btn ${activePath === 'both' ? 'active' : ''}`}
              onClick={() => setActivePath('both')}
            >
              Both
            </button>
            <button 
              type="button"
              className={`toggle-btn dijkstra ${activePath === 'dijkstra' ? 'active' : ''}`}
              onClick={() => setActivePath('dijkstra')}
            >
              Dijkstra
            </button>
            <button 
              type="button"
              className={`toggle-btn astar ${activePath === 'astar' ? 'active' : ''}`}
              onClick={() => setActivePath('astar')}
            >
              A*
            </button>
          </div>

          <div className="insight-panel">
            <h3>Dijkstra</h3>
            <div className="metric-grid">
              <div className="metric-card"><span>Visited</span><strong>{compareResult?.result?.dijkstra?.visited_nodes?.length ?? '—'}</strong></div>
              <div className="metric-card"><span>Time</span><strong>{compareResult?.result?.dijkstra?.execution_time_ms ?? '—'} ms</strong></div>
              <div className="metric-card"><span>Length</span><strong>{compareResult?.result?.dijkstra?.path_length ?? '—'}</strong></div>
              <div className="metric-card"><span>Distance</span><strong>{compareResult?.result?.dijkstra?.total_distance_km ?? '—'}</strong></div>
            </div>
            <div className="detail-list">
              <h4>Path</h4>
              {(dijkstraPath).map((nodeId, index) => (
                <div key={`d-${nodeId}-${index}`} className="detail-item dijkstra">
                  <span className="path-step">{index + 1}</span>
                  <span>{nodeId}</span>
                </div>
              ))}
              {dijkstraPath.length === 0 && (
                <div className="empty-state">Click "Run Race" to see Dijkstra path.</div>
              )}
            </div>
          </div>

          <div className="insight-panel">
            <h3>A*</h3>
            <div className="metric-grid">
              <div className="metric-card"><span>Visited</span><strong>{compareResult?.result?.astar?.visited_nodes?.length ?? '—'}</strong></div>
              <div className="metric-card"><span>Time</span><strong>{compareResult?.result?.astar?.execution_time_ms ?? '—'} ms</strong></div>
              <div className="metric-card"><span>Length</span><strong>{compareResult?.result?.astar?.path_length ?? '—'}</strong></div>
              <div className="metric-card"><span>Distance</span><strong>{compareResult?.result?.astar?.total_distance_km ?? '—'}</strong></div>
            </div>
            <div className="detail-list">
              <h4>Path</h4>
              {(astarPath).map((nodeId, index) => (
                <div key={`a-${nodeId}-${index}`} className="detail-item astar">
                  <span className="path-step">{index + 1}</span>
                  <span>{nodeId}</span>
                </div>
              ))}
              {astarPath.length === 0 && (
                <div className="empty-state">Click "Run Race" to see A* path.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}