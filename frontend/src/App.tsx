import React, { useState, useCallback } from 'react';
import NetworkMap3D from './components/NetworkMap3D';
import Sidebar from './components/Sidebar';
import HUD from './components/HUD';
import './index.css';

export default function App() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleResetView = useCallback(() => {
    setSelectedStation(null);
    setSelectedLine(null);
    setResetKey(prev => prev + 1);
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <NetworkMap3D
          key={resetKey}
          selectedLine={selectedLine}
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
          onResetView={handleResetView}
        />
        <HUD
          selectedLine={selectedLine}
          onResetView={handleResetView}
          onSelectLine={setSelectedLine}
        />
      </div>
      <Sidebar
        selectedLine={selectedLine}
        selectedStation={selectedStation}
        onSelectLine={setSelectedLine}
        onSelectStation={setSelectedStation}
      />
    </div>
  );
}
