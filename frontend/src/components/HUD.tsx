import React, { useMemo, useState, useEffect } from 'react';
import { STATIONS, EDGES, TRANSIT_LINES } from '../data/cairoNetwork';

interface HUDProps {
  selectedLine: string | null;
  onResetView?: () => void;
  onSelectLine?: (lineId: string | null) => void;
}

interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  period: string;
}

export default function HUD({ selectedLine, onResetView, onSelectLine }: HUDProps) {
  const [passengers, setPassengers] = useState(142830);
  const [time, setTime] = useState<TimeDisplay>({ hours: 0, minutes: 0, seconds: 0, period: 'AM' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassengers(prev => {
        const change = Math.floor(Math.random() * 81) - 40;
        return Math.max(100000, prev + change);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const period = hours >= 12 ? 'PM' : 'AM';
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
      setTime({ hours, minutes, seconds, period });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        onResetView?.();
      } else if (e.key >= '1' && e.key <= '6') {
        const lineIndex = parseInt(e.key) - 1;
        if (lineIndex < TRANSIT_LINES.length) {
          onSelectLine?.(TRANSIT_LINES[lineIndex].id);
        }
      } else if (e.key === 'Escape') {
        onSelectLine?.(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResetView, onSelectLine]);

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="hud">
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
            <span className="stat-label">Segments</span>
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
        <div className="passenger-stat" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label" style={{ fontSize: '10px' }}>Passengers</span>
            <span className="stat-value" style={{ fontSize: '16px', color: '#00d4ff' }}>{formatNumber(passengers)}</span>
          </div>
        </div>
        <div className="time-stat" style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label" style={{ fontSize: '10px' }}>Live Time</span>
            <span style={{ fontSize: '14px', fontFamily: "'Courier New', monospace", color: '#00ff88', fontWeight: 600 }}>
              {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')} {time.period}
            </span>
          </div>
        </div>
      </div>

      <div className="hud-legend">
        <div className="legend-title">Transit Lines</div>
        <div className="legend-items">
          {TRANSIT_LINES.map((line) => (
            <div
              key={line.id}
              className="legend-item"
              onClick={() => onSelectLine?.(selectedLine === line.id ? null : line.id)}
              style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', background: selectedLine === line.id ? 'rgba(0,212,255,0.1)' : 'transparent' }}
            >
              <div className="legend-dot" style={{ backgroundColor: line.color, boxShadow: `0 0 8px ${line.color}` }} />
              <span>{line.name}</span>
            </div>
          ))}
        </div>
        <div className="legend-title" style={{ marginTop: '16px' }}>Station Types</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#00d4ff' }} />
            <span>Metro</span>
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
        <div className="control-group" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="control-label">Shortcuts</div>
          <div className="control-keys">
            <kbd>R</kbd> Reset
          </div>
          <div className="control-keys">
            <kbd>1-6</kbd> Lines
          </div>
          <div className="control-keys">
            <kbd>Esc</kbd> Clear
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={onResetView}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '6px',
              color: '#00d4ff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            }}
          >
            Reset View
          </button>
          <button
            onClick={handleFullscreen}
            style={{
              padding: '8px 12px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '6px',
              color: '#00d4ff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
            }}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  );
}