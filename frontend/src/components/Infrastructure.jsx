import React, { useState } from 'react';
import { neighborhoods, facilities, existingRoads, potentialNewRoads, trafficPatterns } from '../data/cairoData';

const allNodesList = [...neighborhoods, ...facilities];

function exportData(section, data) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cairo-${section}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateReport(nodeCount, roadCount, potentialRoadCount) {
  const totalKm = existingRoads.reduce((s, r) => s + r.distance_km, 0).toFixed(1);
  const avgCapacity = Math.round(existingRoads.reduce((s, r) => s + r.capacity_veh_h, 0) / existingRoads.length);
  const lines = [
    'Cairo Transportation Network Report',
    '====================================',
    `Nodes: ${nodeCount}  |  Roads: ${roadCount}  |  Potential Roads: ${potentialRoadCount}`,
    `Total Network Length: ${totalKm} km`,
    `Average Road Capacity: ${avgCapacity} veh/h`,
    '',
    'Top 5 Busiest Roads (Morning):',
    ...Object.entries(trafficPatterns)
      .sort((a, b) => b[1].morning - a[1].morning)
      .slice(0, 5)
      .map(([id, p]) => `  ${id}: ${p.morning} veh/h`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cairo-network-report.txt';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Infrastructure() {
  const [activeSection, setActiveSection] = useState('nodes');
  const [selectedItem, setSelectedItem] = useState(null);


  const nodeCount = allNodesList.length;
  const roadCount = existingRoads.length;
  const potentialRoadCount = potentialNewRoads.length;
  const facilityCount = facilities.length;

  return (
    <div className="tab-shell">
      <div className="tab-controls">
        <div>
          <h2>Infrastructure Configuration</h2>
          <p>Manage nodes, roads, facilities, and network settings.</p>
        </div>
        <div className="control-grid">
          <button 
            type="button" 
            className={`secondary-button ${activeSection === 'nodes' ? 'active' : ''}`}
            onClick={() => setActiveSection('nodes')}
          >
            Nodes ({nodeCount})
          </button>
          <button 
            type="button" 
            className={`secondary-button ${activeSection === 'roads' ? 'active' : ''}`}
            onClick={() => setActiveSection('roads')}
          >
            Roads ({roadCount})
          </button>
          <button 
            type="button" 
            className={`secondary-button ${activeSection === 'potential' ? 'active' : ''}`}
            onClick={() => setActiveSection('potential')}
          >
            Potential ({potentialRoadCount})
          </button>
          <button 
            type="button" 
            className={`secondary-button ${activeSection === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveSection('facilities')}
          >
            Facilities ({facilityCount})
          </button>
        </div>
      </div>

      <div className="infrastructure-grid">
        <div className="infrastructure-list">
          <div className="list-header">
            <h3>
              {activeSection === 'nodes' && 'Neighborhoods & Nodes'}
              {activeSection === 'roads' && 'Existing Roads'}
              {activeSection === 'potential' && 'Potential New Roads'}
              {activeSection === 'facilities' && 'Facilities'}
            </h3>
          </div>

          <div className="list-content">
            {activeSection === 'nodes' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Population</th>
                    <th>Coords</th>
                  </tr>
                </thead>
                <tbody>
                  {allNodesList.map((node) => (
                    <tr 
                      key={node.id}
                      className={selectedItem?.id === node.id ? 'selected' : ''}
                      onClick={() => setSelectedItem(node)}
                    >
                      <td>{node.id}</td>
                      <td>{node.name}</td>
                      <td>
                        <span className={`type-badge type-${node.type?.toLowerCase()}`}>
                          {node.type}
                        </span>
                      </td>
                      <td>{node.population?.toLocaleString() ?? '—'}</td>
                      <td className="coord-cell">
                        {node.x?.toFixed(2)}, {node.y?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeSection === 'roads' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Distance (km)</th>
                    <th>Travel Time (min)</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {existingRoads.map((road, idx) => (
                    <tr key={idx}>
                      <td>{road.from}</td>
                      <td>{road.to}</td>
                      <td>{road.distance_km}</td>
                      <td>{road.travel_time_min}</td>
                      <td>${road.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeSection === 'potential' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Distance (km)</th>
                    <th>Est. Cost</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {potentialNewRoads.map((road, idx) => (
                    <tr key={idx}>
                      <td>{road.from}</td>
                      <td>{road.to}</td>
                      <td>{road.distance_km}</td>
                      <td>${road.cost_million_egp}M</td>
                      <td>
                        <span className="priority-badge">
                          {(road.distance_km < 5 ? 'High' : road.distance_km < 10 ? 'Medium' : 'Low')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeSection === 'facilities' && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility, idx) => (
                    <tr key={idx}>
                      <td>{facility.name}</td>
                      <td>{facility.type}</td>
                      <td>{facility.location}</td>
                      <td>{facility.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="infrastructure-details">
          <div className="details-header">
            <h3>{selectedItem ? 'Details' : 'Network Stats'}</h3>
          </div>
          
          {!selectedItem && (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">⬡</span>
                <span className="stat-label">Nodes</span>
                <strong className="stat-value">{nodeCount}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-icon">━</span>
                <span className="stat-label">Roads</span>
                <strong className="stat-value">{roadCount}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-icon">┅</span>
                <span className="stat-label">Potential</span>
                <strong className="stat-value">{potentialRoadCount}</strong>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⚑</span>
                <span className="stat-label">Facilities</span>
                <strong className="stat-value">{facilityCount}</strong>
              </div>
            </div>
          )}

          {selectedItem && (
            <div className="detail-content">
              {activeSection === 'nodes' && (
                <>
                  <div className="detail-row">
                    <span className="detail-label">ID</span>
                    <span className="detail-value">{selectedItem.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{selectedItem.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{selectedItem.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Population</span>
                    <span className="detail-value">{selectedItem.population?.toLocaleString() ?? 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Coordinates</span>
                    <span className="detail-value coord">{selectedItem.x}, {selectedItem.y}</span>
                  </div>
                  <div className="detail-actions">
                    <button type="button" className="danger-button" onClick={() => setSelectedItem(null)}>✕ Deselect</button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-grid">
              <button type="button" className="quick-action" onClick={() => exportData(activeSection, {
                nodes: allNodesList, roads: existingRoads, potential: potentialNewRoads, facilities
              }[activeSection] ?? allNodesList)}>
                ⬇ Export Data
              </button>
              <button type="button" className="quick-action" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) alert(`Import ready: ${file.name}\n(Connect to state to apply)`);
                };
                input.click();
              }}>
                ⬆ Import Data
              </button>
              <button type="button" className="quick-action" onClick={() => {
                setSelectedItem(null);
                setActiveSection('nodes');
              }}>
                ↺ Reset View
              </button>
              <button type="button" className="quick-action" onClick={() => generateReport(nodeCount, roadCount, potentialRoadCount)}>
                📄 Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}