import React from 'react';
import { allNodes, existingRoads, facilities, neighborhoods, normalizeRoadId, potentialNewRoads } from '../data/cairoData';

const TYPE_COLORS = {
  Residential: '#4f8cff',
  Business: '#ff9f43',
  Medical: '#ff5d73',
  Government: '#b46bff',
  Airport: '#ffd166',
  Mixed: '#2dd4bf',
  Industrial: '#94a3b8',
  'Transit Hub': '#f97316',
  Education: '#22c55e',
  Tourism: '#eab308',
  Sports: '#14b8a6',
  Commercial: '#fb7185',
};

const VIEWBOX = { width: 1000, height: 700 };

const allRoads = [
  ...existingRoads.map((road) => ({ ...road, isPotential: false })),
  ...potentialNewRoads.map((road) => ({ ...road, isPotential: true })),
];

const nodeMap = Object.fromEntries(allNodes.map((node) => [node.id, node]));

function project(node) {
  const minX = 30.9;
  const maxX = 31.85;
  const minY = 29.84;
  const maxY = 30.13;
  const x = ((node.x - minX) / (maxX - minX)) * 900 + 50;
  const y = VIEWBOX.height - (((node.y - minY) / (maxY - minY)) * 620 + 40);
  return { x, y };
}

function roadStroke(road, highlightedRoadIds) {
  const roadId = normalizeRoadId(road.from, road.to);
  if (highlightedRoadIds.includes(roadId)) {
    return '#7dd3fc';
  }
  return road.isPotential ? 'rgba(255,255,255,0.22)' : 'rgba(148,163,184,0.55)';
}

function nodeRadius(node) {
  if (typeof node.population !== 'number') {
    return 12;
  }
  return Math.max(12, Math.min(32, 10 + node.population / 25000));
}

function connectedRoadLabels(nodeId) {
  const labels = [];
  for (const road of allRoads) {
    if (road.from === nodeId || road.to === nodeId) {
      labels.push(normalizeRoadId(road.from, road.to));
    }
  }
  return labels;
}

export default function NetworkMap({
  highlightedRoadIds = [],
  selectedNodes = [],
  onNodeClick,
  onNodeHover,
}) {
  return (
    <div className="network-map-panel">
      <div className="network-map-header">
        <div>
          <h2>Network Map</h2>
          <p>Interactive graph of Cairo neighborhoods, facilities, and transport links.</p>
        </div>
        <div className="network-map-legend">
          {Object.entries(TYPE_COLORS).slice(0, 5).map(([label, color]) => (
            <span key={label} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} className="network-map-svg" role="img" aria-label="Cairo transportation network map">
        <defs>
          <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {allRoads.map((road) => {
          const source = nodeMap[road.from];
          const target = nodeMap[road.to];
          if (!source || !target) {
            return null;
          }
          const start = project(source);
          const end = project(target);
          const roadId = normalizeRoadId(road.from, road.to);
          const isHighlighted = highlightedRoadIds.includes(roadId);
          return (
            <g key={roadId}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isHighlighted ? 'url(#roadGlow)' : roadStroke(road, highlightedRoadIds)}
                strokeWidth={isHighlighted ? 4 : 2}
                strokeDasharray={road.isPotential ? '8 8' : '0'}
                opacity={isHighlighted ? 1 : 0.9}
              />
            </g>
          );
        })}

        {allNodes.map((node) => {
          const point = project(node);
          const color = TYPE_COLORS[node.type] || '#94a3b8';
          const selected = selectedNodes.includes(node.id);
          const connections = connectedRoadLabels(node.id);
          return (
            <g
              key={node.id}
              transform={`translate(${point.x}, ${point.y})`}
              onClick={() => onNodeClick?.(node)}
              onMouseEnter={() => onNodeHover?.(node, connections)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={nodeRadius(node)}
                fill={color}
                stroke={selected ? '#ffffff' : 'rgba(15,23,42,0.95)'}
                strokeWidth={selected ? 4 : 2}
              />
              <text
                y={nodeRadius(node) + 16}
                textAnchor="middle"
                className="network-node-label"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="network-map-note">
        <span>Solid edges = existing roads</span>
        <span>Dashed edges = potential new roads</span>
      </div>
    </div>
  );
}
