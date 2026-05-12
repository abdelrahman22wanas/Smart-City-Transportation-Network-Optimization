import React, { useState, useRef } from 'react';
import { CITY_TABS, getCityById } from '../data/mawasalatData';

const MAP_STYLE = {
  background: '#F5F0E8',
  headerTeal: '#1A6B8A',
  headerGreen: '#4CAF50',
  station: '#FFFFFF',
  stationStroke: '#1A1A1A',
  text: '#2C2C2C',
  grid: '#DDDDDD',
  road: '#E8DDB5',
  roadLabel: '#AAAAAA',
  legendBg: '#FFFFFF',
  landmarkGray: '#888888',
};

export default function BusNetworkMap() {
  const [selectedCity, setSelectedCity] = useState('shorouk');
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [hoveredStop, setHoveredStop] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [visibleRoutes, setVisibleRoutes] = useState(() => {
    const city = getCityById(selectedCity);
    return city ? city.routes.map(r => r.id) : [];
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const city = getCityById(selectedCity);
  if (!city) return <div>Loading...</div>;

  const { width: mapWidth, height: mapHeight } = city.mapSize;

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    const newCity = getCityById(cityId);
    setVisibleRoutes(newCity ? newCity.routes.map(r => r.id) : []);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(z => Math.min(Math.max(z + delta, 0.4), 2.5));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleRoute = (routeId) => {
    setVisibleRoutes(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const getAllStops = () => {
    const stopMap = new Map();
    city.routes.forEach(route => {
      route.stops.forEach(stop => {
        if (!stopMap.has(stop.id)) {
          stopMap.set(stop.id, { ...stop, routes: [route.id], colors: [route.color] });
        } else {
          const existing = stopMap.get(stop.id);
          if (!existing.routes.includes(route.id)) {
            existing.routes.push(route.id);
            existing.colors.push(route.color);
          }
        }
      });
    });
    return Array.from(stopMap.values());
  };

  const allStops = getAllStops();

  const getStopType = (stop, routeColors) => {
    if (stop.terminal && stop.type === 'central_hub') return 'hub';
    if (stop.type === 'terminal') return 'terminal';
    if (stop.routes && stop.routes.length > 1) return 'interchange';
    return 'intermediate';
  };

  const renderStationMarker = (stop, stopType, colors) => {
    const cx = stop.x;
    const cy = stop.y;
    const isHovered = hoveredStop === stop.id;
    const isSelected = selectedStop && selectedStop.id === stop.id;

    if (stopType === 'hub') {
      return (
        <g key={stop.id}>
          <circle cx={cx} cy={cy} r={12} fill={MAP_STYLE.station} stroke={colors[0]} strokeWidth={3} />
          <circle cx={cx} cy={cy} r={7} fill={MAP_STYLE.station} stroke={colors[0]} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={3} fill={MAP_STYLE.station} />
          <text x={cx + 18} y={cy + 4} fill="#fff" fontSize="6" fontWeight="bold">P+R</text>
        </g>
      );
    }

    if (stopType === 'terminal') {
      return (
        <g key={stop.id}>
          <circle cx={cx} cy={cy} r={8} fill={MAP_STYLE.station} stroke={colors[0]} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={4} fill={MAP_STYLE.station} />
        </g>
      );
    }

    if (stopType === 'interchange') {
      return (
        <g key={stop.id}>
          <circle cx={cx} cy={cy} r={6} fill={MAP_STYLE.station} stroke={MAP_STYLE.stationStroke} strokeWidth={2} />
          {colors.map((color, i) => {
            const angle = (i * 360) / colors.length;
            const rad = (angle * Math.PI) / 180;
            const px = cx + 5 * Math.cos(rad);
            const py = cy + 5 * Math.sin(rad);
            return <circle key={i} cx={px} cy={py} r={2} fill={color} />;
          })}
        </g>
      );
    }

    return (
      <circle key={stop.id} cx={cx} cy={cy} r={4} fill={MAP_STYLE.station} stroke={colors[0]} strokeWidth={1.5} />
    );
  };

  const renderRouteLine = (route, stops) => {
    if (!visibleRoutes.includes(route.id)) return null;
    
    const isHighlighted = !hoveredRoute || hoveredRoute === route.id;
    const opacity = isHighlighted ? 1 : 0.2;
    const pathData = stops.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');

    return (
      <path
        key={route.id}
        d={pathData}
        fill="none"
        stroke={route.color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={route.oneWay ? '8 4' : 'none'}
        opacity={opacity}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHoveredRoute(route.id)}
        onMouseLeave={() => setHoveredRoute(null)}
      />
    );
  };

  const handleStopClick = (stop) => {
    setSelectedStop(stop.id === selectedStop?.id ? null : stop);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      minHeight: '800px',
      fontFamily: '"Cairo", "Noto Sans", sans-serif',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header - Diagonal Split */}
      <div style={{ 
        background: `linear-gradient(135deg, ${MAP_STYLE.headerTeal} 50%, ${MAP_STYLE.headerGreen} 50%)`,
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: 'bold', fontFamily: '"Cairo", sans-serif' }}>شبكة مواصلات مصر</h2>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontFamily: '"Cairo", sans-serif' }}>لمدينة {city.nameAr}</p>
        </div>
        
        {/* Logo */}
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          background: '#fff', 
          border: `3px solid ${MAP_STYLE.headerTeal}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '18px', color: MAP_STYLE.headerTeal }}>🚌</span>
        </div>
      </div>

      {/* City Switcher Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        padding: '10px 24px', 
        background: '#F5F0E8', 
        borderBottom: '1px solid #DDD',
        flexWrap: 'wrap',
      }}>
        {CITY_TABS.map(tab => (
          <button 
            key={tab.id}
            onClick={() => handleCityChange(tab.id)}
            style={{ 
              padding: '6px 14px', 
              background: selectedCity === tab.id ? MAP_STYLE.headerTeal : 'transparent', 
              border: selectedCity === tab.id ? `2px solid ${MAP_STYLE.headerTeal}` : '1px solid #CCC', 
              borderRadius: '6px',
              color: selectedCity === tab.id ? '#fff' : '#666', 
              fontSize: '11px', 
              fontWeight: '600', 
              cursor: 'pointer',
              fontFamily: '"Cairo", sans-serif',
            }}
          >
            {tab.nameAr}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleReset} style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '4px', color: '#666', fontSize: '11px', cursor: 'pointer' }}>Reset</button>
          <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.4))} style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '4px', color: '#666', fontSize: '14px', cursor: 'pointer' }}>−</button>
          <span style={{ fontSize: '10px', color: '#666', minWidth: '35px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))} style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '4px', color: '#666', fontSize: '14px', cursor: 'pointer' }}>+</button>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={containerRef} style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        overflow: 'hidden', 
        background: MAP_STYLE.background,
        cursor: dragging ? 'grabbing' : 'grab',
        border: '1px solid #CCC',
      }}
        onWheel={handleWheel} 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp}
      >
        <div style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
          transformOrigin: 'center center', 
          transition: dragging ? 'none' : 'transform 0.15s ease',
        }}>
          <svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
            {/* Background */}
            <rect x="0" y="0" width={mapWidth} height={mapHeight} fill={MAP_STYLE.background} />
            
            {/* Grid */}
            <g stroke={MAP_STYLE.grid} strokeWidth="0.5" strokeDasharray="3 6">
              {Array.from({ length: Math.ceil(mapWidth / 100) }).map((_, i) => (
                <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={mapHeight} />
              ))}
              {Array.from({ length: Math.ceil(mapHeight / 100) }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 100} x2={mapWidth} y2={i * 100} />
              ))}
            </g>

            {/* Route Lines */}
            {city.routes.map(route => renderRouteLine(route, route.stops))}

            {/* Station Markers */}
            {allStops.map(stop => {
              const colors = stop.colors || [city.routes.find(r => r.stops.some(s => s.id === stop.id))?.color || '#666'];
              const stopType = getStopType(stop, colors);
              const isVisible = visibleRoutes.some(routeId => {
                const route = city.routes.find(r => r.id === routeId);
                return route?.stops.some(s => s.id === stop.id);
              });
              
              if (!isVisible) return null;
              
              return (
                <g 
                  key={stop.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredStop(stop.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                  onClick={(e) => { e.stopPropagation(); handleStopClick(stop); }}
                >
                  {renderStationMarker(stop, stopType, colors)}
                </g>
              );
            })}

            {/* Station Labels (for terminals and interchanges) */}
            {allStops.map(stop => {
              const stopType = getStopType(stop, stop.colors || []);
              if (stopType === 'intermediate') return null;
              
              const isVisible = visibleRoutes.some(routeId => {
                const route = city.routes.find(r => r.id === routeId);
                return route?.stops.some(s => s.id === stop.id);
              });
              if (!isVisible) return null;

              const isLeft = stop.x < mapWidth / 2;
              return (
                <g key={`label-${stop.id}`}>
                  <text 
                    x={stop.x + (isLeft ? -14 : 14)} 
                    y={stop.y - 4} 
                    textAnchor={isLeft ? 'end' : 'start'} 
                    fill={MAP_STYLE.text} 
                    fontSize="10" 
                    fontWeight="600"
                    fontFamily='"Cairo", sans-serif'
                  >
                    {stop.nameAr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredStop && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          padding: '10px 14px',
          borderRadius: '6px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          border: '1px solid #eee',
          zIndex: 100,
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', color: MAP_STYLE.text, fontFamily: '"Cairo", sans-serif' }}>
            {allStops.find(s => s.id === hoveredStop)?.nameAr}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
            {allStops.find(s => s.id === hoveredStop)?.routes?.map(routeId => (
              <span key={routeId} style={{ 
                padding: '2px 8px', 
                background: city.routes.find(r => r.id === routeId)?.color || '#666', 
                borderRadius: '8px', 
                color: '#fff', 
                fontSize: '9px', 
                fontWeight: '600' 
              }}>
                {routeId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend Boxes */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        padding: '12px 24px', 
        background: MAP_STYLE.legendBg, 
        borderTop: '1px solid #DDD',
        flexWrap: 'wrap',
      }}>
        {/* مفتاح المسارات */}
        <div style={{ 
          padding: '10px 14px', 
          background: '#fff', 
          border: '1px solid #DDD', 
          borderRadius: '6px',
          minWidth: '200px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: MAP_STYLE.headerTeal, marginBottom: '8px', fontFamily: '"Cairo", sans-serif' }}>مفتاح المسارات</div>
          {city.routes.map(route => (
            <div 
              key={route.id}
              onClick={() => toggleRoute(route.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '4px', 
                cursor: 'pointer',
                opacity: visibleRoutes.includes(route.id) ? 1 : 0.4,
              }}
            >
              <span style={{ 
                padding: '2px 8px', 
                background: route.color, 
                borderRadius: '4px', 
                color: '#fff', 
                fontSize: '9px', 
                fontWeight: 'bold' 
              }}>
                {route.id}
              </span>
              <span style={{ fontSize: '9px', color: '#666', fontFamily: '"Cairo", sans-serif' }}>{route.nameAr}</span>
            </div>
          ))}
        </div>

        {/* مفتاح الخريطة */}
        <div style={{ 
          padding: '10px 14px', 
          background: '#fff', 
          border: '1px solid #DDD', 
          borderRadius: '6px',
          minWidth: '180px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: MAP_STYLE.headerTeal, marginBottom: '8px', fontFamily: '"Cairo", sans-serif' }}>مفتاح الخريطة</div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #666', background: '#fff' }} /> محطة وسطية
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #333', background: '#fff' }} /> ◎ محطة نهاية تبادلية
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #666', background: '#fff' }} /> ◑ محطة وسطية تبادلية
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #666', background: '#fff' }} /> ⊙ محطة نهاية مركزية
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #000', background: '#fff' }} /> P+R إنتظار ملاكي
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '3px', background: '#888' }} /> خط سير خارجي
          </div>
          <div style={{ fontSize: '9px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '3px', background: '#333' }} /> خط سير داخلي
          </div>
          <div style={{ fontSize: '9px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '3px', background: '#333', borderStyle: 'dashed', borderWidth: '2px' }} /> → إتجاه واحد
          </div>
        </div>
      </div>
    </div>
  );
}