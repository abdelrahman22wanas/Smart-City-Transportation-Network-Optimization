import React, { useState, useEffect, useRef } from 'react';
import { allNodes, existingRoads, potentialNewRoads, trafficPatterns } from '../data/cairoData';

export default function MLPrediction({ mlTrainResult, mlPredictResult, onTrain, onPredict }) {
  const [road, setRoad] = useState('2-5');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const chartCanvasRef = useRef(null);

  useEffect(() => {
    if (mlPredictResult?.result) {
      drawPredictionChart(mlPredictResult.result);
    }
  }, [mlPredictResult]);

  useEffect(() => {
    // Set canvas resolution for high DPI displays and redraw on resize
    const canvas = chartCanvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // Redraw if we have data
      if (mlPredictResult?.result) {
        drawPredictionChart(mlPredictResult.result);
      }
    }
  }, [mlPredictResult]);

  const drawPredictionChart = (data) => {
    const canvas = chartCanvasRef.current;
    if (!canvas || !data) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#0f1c2e');
    bgGradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const times = ['morning', 'afternoon', 'evening', 'night'];
    const timeLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const roadId = data.road_id;
    
    const actualData = times.map(t => trafficPatterns[roadId]?.[t] || 0);
    const predictedData = data.all_time_predictions
      ? times.map(t => data.all_time_predictions[t] ?? actualData[times.indexOf(t)])
      : times.map((t, i) => t === data.time_of_day ? data.predicted_flow : actualData[i]);
    
    const maxValue = Math.max(...actualData, ...predictedData, data.capacity || 3000) * 1.1;
    const padding = 70;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Grid
    ctx.strokeStyle = 'rgba(139, 157, 195, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Y-axis labels
      const value = Math.round(maxValue * (1 - i / 5));
      ctx.fillStyle = '#6b7c95';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
    
    // Draw line chart
    const drawLine = (dataPoints, color, isDashed = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (isDashed) ctx.setLineDash([8, 4]);
      else ctx.setLineDash([]);
      
      ctx.beginPath();
      dataPoints.forEach((value, i) => {
        const x = padding + (chartWidth / (times.length - 1)) * i;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      // Draw points
      dataPoints.forEach((value, i) => {
        const x = padding + (chartWidth / (times.length - 1)) * i;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner dot
        ctx.fillStyle = '#0a1628';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    drawLine(actualData, '#00ff88', false);
    drawLine(predictedData, '#00d4ff', true);
    
    // X-axis labels
    times.forEach((time, i) => {
      const x = padding + (chartWidth / (times.length - 1)) * i;
      ctx.fillStyle = time === data.time_of_day ? '#00d4ff' : '#8b9dc3';
      ctx.font = time === data.time_of_day ? 'bold 12px Inter, sans-serif' : '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(timeLabels[i], x, height - padding + 25);
    });
    
    // Legend
    const legendY = 25;
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(padding, legendY - 8, 20, 3);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Actual', padding + 28, legendY);
    
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(padding + 100, legendY - 6);
    ctx.lineTo(padding + 120, legendY - 6);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText('Predicted', padding + 128, legendY);
  };

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      await onTrain?.();
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    try {
      await onPredict?.({ road, timeOfDay });
    } finally {
      setIsPredicting(false);
    }
  };

  const roadOptions = existingRoads.map(r => `${r.from}-${r.to}`);

  const result = mlPredictResult?.result;
  const predictedCongestion = result?.predicted_congestion;
  const actualCongestion = result?.actual_congestion;

  const getCongestionColor = (level) => {
    switch(level) {
      case 'Low': return '#00ff88';
      case 'Medium': return '#ffd700';
      case 'High': return '#ff8c00';
      case 'Critical': return '#ff4444';
      default: return '#8b9dc3';
    }
  };

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>ML Prediction</h2>
          <p>Linear regression traffic flow prediction</p>
        </div>
        <div className="control-grid">
          <button 
            type="button" 
            className="primary-button" 
            onClick={handleTrain}
            disabled={isTraining}
          >
            🧠 {isTraining ? 'Training...' : 'Train Model'}
          </button>
          
          <div className="control-group-inline">
            <label className="control-chip">
              <span>Road</span>
              <select value={road} onChange={(event) => setRoad(event.target.value)}>
                {roadOptions.map((roadId) => (
                  <option key={roadId} value={roadId}>{roadId}</option>
                ))}
              </select>
            </label>
            <label className="control-chip">
              <span>Time</span>
              <select value={timeOfDay} onChange={(event) => setTimeOfDay(event.target.value)}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </label>
            <button 
              type="button" 
              className="primary-button" 
              onClick={handlePredict}
              disabled={isPredicting}
            >
              ? {isPredicting ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </div>
      </div>

      <div className="tab-grid">
        <div className="metric-grid four-column">
          <div className="metric-card" key={`pred-${result?.predicted_flow}`}>
            <span>PREDICTED FLOW</span>
            <strong style={{ color: '#00d4ff' }}>{result?.predicted_flow ?? '—'}</strong>
            <small>veh/h</small>
          </div>
          <div className="metric-card" key={`actual-${result?.actual_flow}`}>
            <span>ACTUAL FLOW</span>
            <strong style={{ color: '#00ff88' }}>{result?.actual_flow ?? '—'}</strong>
            <small>veh/h</small>
          </div>
          <div className="metric-card">
            <span>MAE</span>
            <strong>{result?.absolute_error?.toFixed(2) ?? mlTrainResult?.result?.training?.mae ?? '—'}</strong>
          </div>
          <div className="metric-card">
            <span>R²</span>
            <strong>{mlTrainResult?.result?.training?.r2_score?.toFixed(4) ?? '—'}</strong>
          </div>
        </div>

        <div className="insight-panel large-panel">
          <h3>PREDICTED VS ACTUAL ⚡ ALL TIMES</h3>
          <canvas 
            key={`${result?.road_id}-${result?.time_of_day}`}
            ref={chartCanvasRef} 
            style={{ width: '100%', height: '300px', display: 'block' }}
            className="chart-canvas"
          />
        </div>

        {result && (
          <div className="info-panel" style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #1a2942 100%)',
            border: '1px solid #2a3f5f',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#00d4ff' }}>Congestion Forecast</h4>
                <p style={{ margin: 0, color: '#8b9dc3', fontSize: '14px' }}>
                  Road {result.road_id} • {result.time_of_day.charAt(0).toUpperCase() + result.time_of_day.slice(1)} • Capacity: {result.capacity} veh/h
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  background: getCongestionColor(predictedCongestion?.level),
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {predictedCongestion?.level ?? 'Unknown'}
                </div>
                <div style={{ marginTop: '4px', color: '#8b9dc3', fontSize: '12px' }}>
                  {predictedCongestion?.percentage ?? 0}% capacity
                </div>
              </div>
            </div>
            
            <div style={{ 
              marginTop: '16px', 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px' 
            }}>
              <div style={{ 
                padding: '12px', 
                background: 'rgba(0, 212, 255, 0.1)', 
                borderRadius: '4px',
                border: '1px solid rgba(0, 212, 255, 0.3)'
              }}>
                <div style={{ color: '#00d4ff', fontSize: '12px', marginBottom: '4px' }}>PREDICTED</div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                  {predictedCongestion?.level ?? '—'}
                </div>
                <div style={{ color: '#8b9dc3', fontSize: '11px' }}>
                  {predictedCongestion?.percentage ?? 0}% ({result.predicted_flow} veh/h)
                </div>
              </div>
              
              <div style={{ 
                padding: '12px', 
                background: 'rgba(0, 255, 136, 0.1)', 
                borderRadius: '4px',
                border: '1px solid rgba(0, 255, 136, 0.3)'
              }}>
                <div style={{ color: '#00ff88', fontSize: '12px', marginBottom: '4px' }}>ACTUAL</div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                  {actualCongestion?.level ?? '—'}
                </div>
                <div style={{ color: '#8b9dc3', fontSize: '11px' }}>
                  {actualCongestion?.percentage ?? 0}% ({result.actual_flow} veh/h)
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2a3f5f' }}>
              <div style={{ color: '#8b9dc3', fontSize: '12px', marginBottom: '8px' }}>
                <strong>Congestion Levels:</strong>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                <span><span style={{ color: '#00ff88' }}>●</span> Low (&lt;50%)</span>
                <span><span style={{ color: '#ffd700' }}>●</span> Medium (50-75%)</span>
                <span><span style={{ color: '#ff8c00' }}>●</span> High (75-90%)</span>
                <span><span style={{ color: '#ff4444' }}>●</span> Critical (&gt;90%)</span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="info-panel">
            <h4>About ML Prediction</h4>
            <p>
              Use ML-based traffic prediction (scikit-learn) trained on temporal traffic data to forecast congestion levels.
            </p>
            <ul>
              <li><strong>Train Model</strong>: Train neural network on historical traffic patterns</li>
              <li><strong>Predict</strong>: Forecast traffic flow and congestion for specific road/time</li>
              <li><strong>Congestion Levels</strong>: Low, Medium, High, Critical based on capacity ratio</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
