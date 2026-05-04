import React, { useMemo, useState } from 'react';
import RoadNetworkMap from './RoadNetworkMap';

export default function MSTDesigner({ mstResult, onRunMst }) {
  const [algorithm, setAlgorithm] = useState('kruskal');
  const [includeNew, setIncludeNew] = useState(true);

  const highlightedRoadIds = useMemo(
    () => mstResult?.result?.mst_edges?.map((edge) => edge.road_id) || [],
    [mstResult],
  );

  const highlightedNodeIds = useMemo(() => {
    if (!mstResult?.result?.mst_edges?.length) return [];
    const nodeIds = new Set();
    mstResult.result.mst_edges.forEach((edge) => {
      if (edge.from) nodeIds.add(edge.from);
      if (edge.to) nodeIds.add(edge.to);
    });
    return [...nodeIds];
  }, [mstResult]);

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>MST Designer</h2>
          <p>Compare Kruskal and Prim while toggling potential new roads.</p>
        </div>
        <div className="control-row">
          <label className="control-chip">
            <span>Algorithm</span>
            <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}>
              <option value="kruskal">Kruskal</option>
              <option value="prim">Prim</option>
            </select>
          </label>
          <label className="control-chip">
            <span>Include New Roads</span>
            <input
              type="checkbox"
              checked={includeNew}
              onChange={(event) => setIncludeNew(event.target.checked)}
            />
          </label>
          <button
            type="button"
            className="primary-button"
            onClick={() => onRunMst?.({ algorithm, includeNew })}
          >
            Run MST
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="map-panel">
          <RoadNetworkMap 
            highlightedRoadIds={highlightedRoadIds}
            highlightedNodeIds={highlightedNodeIds}
            showBaseNetwork={true}
          />
        </div>
        <div className="insight-panel">
          <h3>MST Output</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Total Cost</span>
              <strong>{mstResult?.result?.total_cost ?? '—'}</strong>
            </div>
            <div className="metric-card">
              <span>Edges Selected</span>
              <strong>{mstResult?.result?.mst_edges?.length ?? '—'}</strong>
            </div>
            <div className="metric-card">
              <span>New Roads</span>
              <strong>{mstResult?.result?.selected_new_roads?.length ?? '—'}</strong>
            </div>
            <div className="metric-card">
              <span>Execution</span>
              <strong>{mstResult?.execution_time_ms ?? '—'} ms</strong>
            </div>
          </div>

          <div className="detail-list">
            <h4>MST Edges</h4>
            {(mstResult?.result?.mst_edges || []).map((edge, index) => (
              <div key={`${edge.road_id}-${index}`} className="detail-item">
                <span>{index + 1}. {edge.road_id}</span>
                <small>{edge.from} → {edge.to} | weight {edge.adjusted_weight}</small>
              </div>
            ))}
            {(!mstResult?.result?.mst_edges || mstResult.result.mst_edges.length === 0) && (
              <div className="empty-state">
                Click "Run MST" to compute the minimum spanning tree and see the network visualization.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}