import React, { useState } from 'react';

export default function TrafficSignals({ signalsResult, emergencyResult, onRunSignals, onRunEmergency }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [startNode, setStartNode] = useState(7);
  const [hospitalId, setHospitalId] = useState('F9');

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Traffic Signals</h2>
          <p>Greedy signal priority and emergency preemption tools.</p>
        </div>
        <div className="control-grid">
          <label className="control-chip">
            <span>Time of Day</span>
            <select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value)}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>
          <button type="button" className="primary-button" onClick={() => onRunSignals?.(timeOfDay)}>
            Run Signal Priority
          </button>
          <label className="control-chip">
            <span>Emergency Start</span>
            <input type="text" value={startNode} onChange={(event) => setStartNode(event.target.value)} />
          </label>
          <label className="control-chip">
            <span>Hospital</span>
            <select value={hospitalId} onChange={(event) => setHospitalId(event.target.value)}>
              <option value="F9">F9 - Qasr El Aini Hospital</option>
              <option value="F10">F10 - Maadi Military Hospital</option>
            </select>
          </label>
          <button type="button" className="primary-button" onClick={() => onRunEmergency?.({ startNode, hospitalId })}>
            Run Preemption
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Signal Priority</h3>
          <div className="detail-list">
            {(signalsResult?.result?.signal_priorities || []).map((item) => (
              <div key={item.node_id} className="detail-item">
                <span>{item.node_name}</span>
                <small>{item.best_green_lane ? `${item.best_green_lane.road_id} | flow ${item.best_green_lane.flow}` : 'No connected roads'}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-panel large-panel">
          <h3>Emergency Preemption</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Path Length</span><strong>{emergencyResult?.result?.path?.length ?? '—'}</strong></div>
            <div className="metric-card"><span>Preempted</span><strong>{emergencyResult?.result?.preempted_intersections?.length ?? '—'}</strong></div>
          </div>
          <div className="detail-list">
            {(emergencyResult?.result?.preempted_intersections || []).map((item) => (
              <div key={item.node_id} className="detail-item">
                <span>{item.node_name}</span>
                <small>severity {item.severity}</small>
              </div>
            ))}
          </div>
          <div className="chart-placeholder">Before/after congestion comparison hook</div>
        </div>
      </div>
    </div>
  );
}
