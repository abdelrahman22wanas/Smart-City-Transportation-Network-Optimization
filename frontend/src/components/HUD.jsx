import React, { useMemo } from 'react';
import { STATIONS, EDGES, TRANSIT_LINES } from '../data/cairoNetwork';

export default function HUD({ selectedLine }) {
  const stats = useMemo(() => {
    let visibleStations = STATIONS;
    let visibleEdges = EDGES;

    if (selectedLine) {
      visibleStations = STATIONS.filter(s => s.lines.includes(selectedLine));
      visibleEdges = EDGES.filter(e => e.line === selectedLine);
    }

    const totalDistance = visibleEdges.reduce((sum, edge) => sum + (edge.distance_km || 0), 0);

    return {
      stations: visibleStations.length,
      edges: visibleEdges.length,
      distance: totalDistance.toFixed(1),
      hubs: visibleStations.filter(s => s.type === 'hub' || s.type === 'capital').length,
    };
  }, [selectedLine]);

  const selectedLineName = selectedLine
    ? TRANSIT_LINES.find(l => l.id === selectedLine)?.name
    : 'All Lines';

  return (
    <div className="hud">
      {/* Top Left - Stats */}
      <div className="hud-stats">
        <div className="hud-title">
          {selectedLineName}
        </div>
        <div className="stat-grid">
          <div className="stat-box">
            <span className="stat-label">Stations</span>
            <span className="stat-value">{stats.stations}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Connections</span>
            <span className="stat-value">{stats.edges}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total km</span>
            <span className="stat-value">{stats.distance}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Hubs</span>
            <span className="stat-value">{stats.hubs}</span>
          </div>
        </div>
      </div>

      {/* Bottom - Legend */}
      <div className="hud-legend">
        <div className="legend-title">Node Types</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#00d4ff' }} />
            <span>Metro Station</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#00ff88' }} />
            <span>Hub</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#9d00ff' }} />
            <span>Capital</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#ff9f43' }} />
            <span>Business</span>
          </div>
        </div>
      </div>

      {/* Top Right - Controls */}
      <div className="hud-controls">
        <div className="control-group">
          <div className="control-label">Controls</div>
          <div className="control-keys">
            <kbd>Drag</kbd> Rotate
          </div>
          <div className="control-keys">
            <kbd>Scroll</kbd> Zoom
          </div>
          <div className="control-keys">
            <kbd>Click</kbd> Select
          </div>
        </div>
      </div>
    </div>
  );
}
