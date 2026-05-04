import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { neighborhoods, facilities, existingRoads, potentialNewRoads, nodeById } from '../data/cairoData';
import apiClient from '../api/client';

const NODE_COLORS = {
  Residential: '#3b82f6',
  Business: '#f97316',
  Mixed: '#8b5cf6',
  Industrial: '#64748b',
  Government: '#a855f7',
  Medical: '#ef4444',
  Airport: '#eab308',
  'Transit Hub': '#06b6d4',
  Education: '#10b981',
  Tourism: '#ec4899',
  Sports: '#f59e0b',
  Commercial: '#14b8a6',
};

export default function NetworkMap() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [showPotentialRoads, setShowPotentialRoads] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  const allNodes = useMemo(() => [...neighborhoods, ...facilities], []);
  
  const { minX, maxX, minY, maxY, viewMinX, viewMaxX, viewMinY, viewMaxY } = useMemo(() => {
    const minX = Math.min(...allNodes.map(n => n.x));
    const maxX = Math.max(...allNodes.map(n => n.x));
    const minY = Math.min(...allNodes.map(n => n.y));
    const maxY = Math.max(...allNodes.map(n => n.y));
    
    const padding = 0.05;
    const xRange = maxX - minX;
    const yRange = maxY - minY;
    
    return {
      minX, maxX, minY, maxY,
      viewMinX: minX - xRange * padding,
      viewMaxX: maxX + xRange * padding,
      viewMinY: minY - yRange * padding,
      viewMaxY: maxY + yRange * padding
    };
  }, [allNodes]);
  
  const width = 1200;
  const height = 800;
  
  const scaleX = useCallback((x) => ((x - viewMinX) / (viewMaxX - viewMinX)) * width, [viewMinX, viewMaxX, width]);
  const scaleY = useCallback((y) => height - ((y - viewMinY) / (viewMaxY - viewMinY)) * height, [viewMinY, viewMaxY, height]);
  
  const getNodeSize = useCallback((node) => {
    if (node.population) {
      return Math.sqrt(node.population / 10000) + 4;
    }
    return 8;
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (selectedNodes.length === 0) {
      setSelectedNodes([node.id]);
      setRouteData(null);
    } else if (selectedNodes.length === 1) {
      if (selectedNodes[0] !== node.id) {
        setSelectedNodes([...selectedNodes, node.id]);
      } else {
        setSelectedNodes([]);
        setRouteData(null);
      }
    } else {
      setSelectedNodes([node.id]);
      setRouteData(null);
    }
  }, [selectedNodes]);

  useEffect(() => {
    if (selectedNodes.length === 2) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      setLoading(true);
      fetchTimeoutRef.current = setTimeout(() => {
        apiClient.get('/api/route', {
          params: { 
            from: selectedNodes[0], 
            to: selectedNodes[1],
            time: 'morning',
            mode: 'standard'
          }
        })
        .then(response => {
          setRouteData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      }, 300);
    }
    
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [selectedNodes]);

  const getConnectedRoads = useCallback((nodeId) => {
    return existingRoads.filter(r => r.from === nodeId || r.to === nodeId);
  }, []);

  const pathSet = useMemo(() => {
    if (!routeData?.result?.path) return new Set();
    const path = routeData.result.path;
    const edges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      edges.add(`${path[i]}-${path[i + 1]}`);
      edges.add(`${path[i + 1]}-${path[i]}`);
    }
    return edges;
  }, [routeData]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0a0a0f', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(15, 15, 25, 0.9)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Network Map</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b0', fontSize: '13px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={showPotentialRoads} 
            onChange={(e) => setShowPotentialRoads(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Show Potential New Roads
        </label>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#808090' }}>
          <div style={{ marginBottom: '8px', fontWeight: 600, color: '#a0a0b0' }}>Node Types:</div>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: color }} />
              <span>{type}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '12px', fontSize: '11px', color: '#606070', borderTop: '1px solid rgba(99, 102, 241, 0.2)', paddingTop: '8px' }}>
          Click two nodes to see route
        </div>
      </div>

      {hoveredNode && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          background: 'rgba(15, 15, 25, 0.95)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          minWidth: '250px',
          maxWidth: '350px'
        }}>
          <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>{hoveredNode.name}</h4>
          <div style={{ fontSize: '13px', color: '#a0a0b0', lineHeight: '1.6' }}>
            <div><strong>Type:</strong> {hoveredNode.type}</div>
            {hoveredNode.population && <div><strong>Population:</strong> {hoveredNode.population.toLocaleString()}</div>}
            {hoveredNode.capacity && <div><strong>Capacity:</strong> {hoveredNode.capacity.toLocaleString()}</div>}
            <div><strong>ID:</strong> {hoveredNode.id}</div>
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <strong>Connected Roads:</strong> {getConnectedRoads(hoveredNode.id).length}
            </div>
          </div>
        </div>
      )}

      {selectedNodes.length === 2 && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(15, 15, 25, 0.95)',
          padding: '16px 24px',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}>
          <div style={{ color: '#fff', fontSize: '14px' }}>
            Route: <strong>{nodeById[selectedNodes[0]]?.name}</strong> → <strong>{nodeById[selectedNodes[1]]?.name}</strong>
          </div>
          {loading && (
            <div style={{ color: '#808090', fontSize: '12px', marginTop: '4px' }}>
              Loading route...
            </div>
          )}
          {routeData && routeData.result && (
            <div style={{ color: '#22d3ee', fontSize: '12px', marginTop: '4px' }}>
              Distance: {routeData.result.total_distance?.toFixed(1)} km | 
              Time: {routeData.result.total_time?.toFixed(0)} min | 
              Nodes: {routeData.result.path?.length || 0}
            </div>
          )}
        </div>
      )}

      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: 'block', margin: '0 auto' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {existingRoads.map((road, idx) => {
          const fromNode = nodeById[road.from];
          const toNode = nodeById[road.to];
          if (!fromNode || !toNode) return null;
          
          const isInPath = pathSet.has(`${road.from}-${road.to}`);
          
          return (
            <line
              key={`existing-${idx}`}
              x1={scaleX(fromNode.x)}
              y1={scaleY(fromNode.y)}
              x2={scaleX(toNode.x)}
              y2={scaleY(toNode.y)}
              stroke={isInPath ? '#22d3ee' : '#4a5568'}
              strokeWidth={isInPath ? 3 : 1.5}
              opacity={isInPath ? 1 : 0.6}
            />
          );
        })}

        {showPotentialRoads && potentialNewRoads.map((road, idx) => {
          const fromNode = nodeById[road.from];
          const toNode = nodeById[road.to];
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={`potential-${idx}`}
              x1={scaleX(fromNode.x)}
              y1={scaleY(fromNode.y)}
              x2={scaleX(toNode.x)}
              y2={scaleY(toNode.y)}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.4}
            />
          );
        })}

        {allNodes.map((node) => {
          const cx = scaleX(node.x);
          const cy = scaleY(node.y);
          const radius = getNodeSize(node);
          const color = NODE_COLORS[node.type] || '#6366f1';
          const isSelected = selectedNodes.includes(node.id);
          const isHovered = hoveredNode?.id === node.id;
          
          return (
            <g key={node.id}>
              {(isSelected || isHovered) && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 6}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.5}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={color}
                stroke="#fff"
                strokeWidth={1.5}
                opacity={isSelected || isHovered ? 1 : 0.9}
                style={{ cursor: 'pointer', filter: isHovered ? 'url(#glow)' : 'none' }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              />
              {(isSelected || isHovered) && (
                <text
                  x={cx}
                  y={cy - radius - 6}
                  textAnchor="middle"
                  fill="#e0e0e0"
                  fontSize="10"
                  fontWeight="500"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {node.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
