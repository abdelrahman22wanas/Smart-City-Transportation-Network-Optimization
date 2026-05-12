import React from 'react';
import { TRANSIT_LINES, STATIONS } from '../data/cairoNetwork';

interface SidebarProps {
  selectedLine: string | null;
  selectedStation: string | null;
  onSelectLine: (lineId: string | null) => void;
  onSelectStation: (stationId: string | null) => void;
}

export default function Sidebar({
  selectedLine,
  selectedStation,
  onSelectLine,
  onSelectStation,
}: SidebarProps) {
  const selectedStationData = STATIONS.find(s => s.id === selectedStation);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Cairo Metro</h1>
        <p className="subtitle">3D Network Visualization</p>
      </div>

      <div className="sidebar-section">
        <h2>Transit Lines</h2>
        <button
          className={`filter-btn ${!selectedLine ? 'active' : ''}`}
          onClick={() => onSelectLine(null)}
        >
          All Lines
        </button>
        {TRANSIT_LINES.map((line) => {
          const stationCount = STATIONS.filter(s => s.lines.includes(line.id)).length;
          return (
            <button
              key={line.id}
              className={`filter-btn ${selectedLine === line.id ? 'active' : ''}`}
              style={selectedLine === line.id ? { borderColor: line.color, backgroundColor: line.color + '20' } : {}}
              onClick={() => onSelectLine(line.id)}
            >
              <span className="line-dot" style={{ backgroundColor: line.color }} />
              <span className="line-name">{line.name}</span>
              <span className="station-count">{stationCount}</span>
            </button>
          );
        })}
      </div>

      {selectedStationData && (
        <div className="sidebar-section station-info">
          <h2>Station Info</h2>
          <div className="station-details">
            <div className="station-name">{selectedStationData.name}</div>
            <div className="station-type">
              <span className="badge">{selectedStationData.type}</span>
            </div>
            <div className="station-lines">
              {selectedStationData.lines.length > 0 ? (
                selectedStationData.lines.map((lineId) => {
                  const line = TRANSIT_LINES.find(l => l.id === lineId);
                  return (
                    <span key={lineId} className="line-badge" style={{ backgroundColor: line?.color }}>
                      {lineId}
                    </span>
                  );
                })
              ) : (
                <span className="line-badge">No lines</span>
              )}
            </div>
            <div className="station-coords">
              <small>
                {selectedStationData.lat.toFixed(4)}°N, {selectedStationData.lng.toFixed(4)}°E
              </small>
            </div>
            <button
              className="btn-secondary"
              onClick={() => onSelectStation(null)}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="sidebar-footer">
        <p className="hint">Drag to rotate • Scroll to zoom • Click stations for info</p>
      </div>
    </aside>
  );
}
