import React, { useState, useRef } from 'react';
import { BUS_CITIES, BUS_NETWORKS, getBusNetwork } from '../data/busNetwork';

function project(stop, minLat, maxLat, minLng, maxLng, width, height) {
  const x = ((stop.lng - minLng) / (maxLng - minLng)) * width + 50;
  const y = height - ((stop.lat - minLat) / (maxLat - minLat)) * height - 30;
  return { x, y };
}

export default function BusMap({ onCitySelect }) {
  const [selectedCity, setSelectedCity] = useState('cairo');
  const [hoveredStop, setHoveredStop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);

  const busNetwork = getBusNetwork(selectedCity);
  
  if (!busNetwork) {
    return <div className="loading">Loading bus network...</div>;
  }

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    onCitySelect?.(cityId);
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  const stops = busNetwork.stops;
  const routes = busNetwork.routes;
  
  const minLat = Math.min(...stops.map(s => s.lat)) - 0.02;
  const maxLat = Math.max(...stops.map(s => s.lat)) + 0.02;
  const minLng = Math.min(...stops.map(s => s.lng)) - 0.02;
  const maxLng = Math.max(...stops.map(s => s.lng)) + 0.02;
  
  const width = 800;
  const height = 600;

  return (
    <div className="bus-map-panel">
      <div className="bus-map-header">
        <div>
          <h2>Bus Network - {busNetwork.name}</h2>
          <p>Mwazalat Misr bus routes and stops</p>
        </div>
        <div className="bus-map-controls">
          <select 
            value={selectedCity} 
            onChange={(e) => handleCityChange(e.target.value)}
            className="city-select"
          >
            {BUS_CITIES.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <button className="map-control-btn" onClick={handleZoomOut}>−</button>
          <span className="zoom-display">{Math.round(zoom * 100)}%</span>
          <button className="map-control-btn" onClick={handleZoomIn}>+</button>
          <button className="map-control-btn" onClick={handleReset}>⟲</button>
        </div>
      </div>

      <div className="bus-routes-legend">
        {routes.map(route => (
          <div key={route.id} className="route-legend-item">
            <span 
              className="route-dot" 
              style={{ background: busNetwork.color }}
            />
            <span className="route-name">{route.name}</span>
            <span className={`route-type ${route.type}`}>{route.type}</span>
          </div>
        ))}
      </div>

      <div 
        className="bus-map-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="bus-map-svg"
          style={{ 
            transform,
            transformOrigin: 'center',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <rect x="0" y="0" width={width} height={height} fill="#FFFFFF" />
          
          <g className="grid-lines">
            {Array.from({ length: 15 }).map((_, i) => (
              <React.Fragment key={i}>
                <line 
                  x1={0} y1={i * 42} x2={width} y2={i * 42} 
                  stroke="#E0E0E0" strokeWidth={1} 
                />
                <line 
                  x1={i * 55} y1={0} x2={i * 55} y2={height} 
                  stroke="#E0E0E0" strokeWidth={1} 
                />
              </React.Fragment>
            ))}
          </g>

          <g className="bus-stops">
            {stops.map(stop => {
              const point = project(stop, minLat, maxLat, minLng, maxLng, width, height);
              const isHovered = hoveredStop === stop.id;
              return (
                <g 
                  key={stop.id}
                  transform={`translate(${point.x}, ${point.y})`}
                  onMouseEnter={() => setHoveredStop(stop.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {(isHovered) && (
                    <circle
                      r={18}
                      fill={busNetwork.color}
                      opacity={0.2}
                    />
                  )}
                  <circle
                    r={isHovered ? 8 : 5}
                    fill={busNetwork.color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                  {(isHovered) && (
                    <g transform="translate(12, -8)">
                      <rect
                        x={-2}
                        y={-14}
                        width={stop.name.length * 7 + 12}
                        height={20}
                        fill="#212529"
                        rx={4}
                      />
                      <text
                        x={4}
                        y={2}
                        fill="#FFFFFF"
                        fontSize={11}
                        fontWeight="600"
                      >
                        {stop.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
          
          <g className="stop-labels" opacity={0.6}>
            {stops.slice(0, 15).map(stop => {
              const point = project(stop, minLat, maxLat, minLng, maxLng, width, height);
              return (
                <text
                  key={`label-${stop.id}`}
                  x={point.x}
                  y={point.y + 18}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#6C757D"
                >
                  {stop.name}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="bus-map-stats">
        <div className="stat-card">
          <span className="stat-value">{stops.length}</span>
          <span className="stat-label">Bus Stops</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{routes.length}</span>
          <span className="stat-label">Routes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{busNetwork.name}</span>
          <span className="stat-label">City</span>
        </div>
      </div>

      <div className="bus-map-note">
        <span>Scroll to zoom • Drag to move • Hover stops for names</span>
      </div>
    </div>
  );
}