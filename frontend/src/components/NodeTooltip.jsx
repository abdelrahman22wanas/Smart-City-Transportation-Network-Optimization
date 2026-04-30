import React from 'react';

export default function NodeTooltip({ node, connections = [] }) {
  if (!node) {
    return null;
  }

  return (
    <div className="node-tooltip">
      <h4>{node.name}</h4>
      <div className="tooltip-meta">
        <span>Type: {node.type}</span>
        {typeof node.population === 'number' ? <span>Population: {node.population.toLocaleString()}</span> : null}
        <span>Coords: {node.x}, {node.y}</span>
      </div>
      <div className="tooltip-connections">
        <strong>Connected roads</strong>
        <div>
          {connections.length ? connections.map((roadId) => <span key={roadId}>{roadId}</span>) : <span>None</span>}
        </div>
      </div>
    </div>
  );
}
