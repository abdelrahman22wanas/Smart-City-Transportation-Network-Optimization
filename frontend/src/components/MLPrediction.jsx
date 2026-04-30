import React, { useState } from 'react';
import { existingRoads } from '../data/cairoData';

export default function MLPrediction({ mlTrainResult, mlPredictResult, onTrain, onPredict }) {
  const [road, setRoad] = useState('1-3');
  const [timeOfDay, setTimeOfDay] = useState('morning');

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>ML Prediction</h2>
          <p>Train the traffic-flow model and compare predicted versus actual flow.</p>
        </div>
        <div className="control-grid">
          <button type="button" className="primary-button" onClick={() => onTrain?.()}>
            Train Model
          </button>
          <label className="control-chip">
            <span>Road</span>
            <select value={road} onChange={(event) => setRoad(event.target.value)}>
              {existingRoads.map((roadItem) => {
                const roadId = `${roadItem.from}-${roadItem.to}`;
                return <option key={roadId} value={roadId}>{roadId}</option>;
              })}
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
          <button type="button" className="primary-button" onClick={() => onPredict?.({ road, timeOfDay })}>
            Predict
          </button>
        </div>
      </div>

      <div className="tab-grid two-column">
        <div className="insight-panel large-panel">
          <h3>Training Metrics</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>MAE</span><strong>{mlTrainResult?.result?.training?.mae ?? '—'}</strong></div>
            <div className="metric-card"><span>R2</span><strong>{mlTrainResult?.result?.training?.r2_score ?? '—'}</strong></div>
            <div className="metric-card"><span>Loss Points</span><strong>{mlTrainResult?.result?.training?.loss_curve?.length ?? '—'}</strong></div>
            <div className="metric-card"><span>Status</span><strong>{mlTrainResult?.result?.training?.status ?? '—'}</strong></div>
          </div>
          <div className="chart-placeholder">Training loss curve hook</div>
        </div>

        <div className="insight-panel large-panel">
          <h3>Prediction</h3>
          <div className="metric-grid">
            <div className="metric-card"><span>Predicted</span><strong>{mlPredictResult?.result?.predicted_flow ?? '—'}</strong></div>
            <div className="metric-card"><span>Actual</span><strong>{mlPredictResult?.result?.actual_flow ?? '—'}</strong></div>
            <div className="metric-card"><span>Error</span><strong>{mlPredictResult?.result?.error ?? '—'}</strong></div>
            <div className="metric-card"><span>Abs Error</span><strong>{mlPredictResult?.result?.absolute_error ?? '—'}</strong></div>
          </div>
          <div className="chart-placeholder">Predicted versus actual bar chart hook</div>
        </div>
      </div>
    </div>
  );
}
