/**
 * Cairo Metro Network Data
 * Station/edge/line definitions with geographic coordinates
 * Updated with official Cairo Metro colors
 */

// Transit lines with official colors
export const TRANSIT_LINES = [
  { id: 'M1', name: 'Line 1 (Helwan - El-Marg)', color: '#EE312F', type: 'metro' },     // Red
  { id: 'M2', name: 'Line 2 (Shubra - El-Manshia)', color: '#009A44', type: 'metro' },     // Green
  { id: 'M3', name: 'Line 3 (Attaba - Adly Mansour)', color: '#F58220', type: 'metro' },     // Orange
  { id: 'M4', name: 'Line 4 (Giza - N.A.C)', color: '#004B9D', type: 'metro' },     // Blue
  { id: 'ML', name: 'Cairo Monorail', color: '#F9C000', type: 'monorail' }, // Gold
  { id: 'LRT', name: 'LRT (Al-Mokatam - El-Salam)', color: '#8E44AD', type: 'lrt' },      // Purple
];

// Cairo metro stations with real coordinates (official map positions)
export const STATIONS = [
  // M1 (Red Line) - Helwan to El-Marg
  { id: 'M1-01', name: 'Helwan', lat: 29.8580, lng: 31.3180, type: 'terminal', lines: ['M1'] },
  { id: 'M1-02', name: 'Ain Helwan', lat: 29.8640, lng: 31.3200, type: 'metro', lines: ['M1'] },
  { id: 'M1-03', name: 'El-Maasara', lat: 29.8780, lng: 31.3240, type: 'metro', lines: ['M1'] },
  { id: 'M1-04', name: 'Wadi Hof', lat: 29.8900, lng: 31.3270, type: 'metro', lines: ['M1'] },
  { id: 'M1-05', name: 'Hadayek Helwan', lat: 29.9030, lng: 31.3300, type: 'metro', lines: ['M1'] },
  { id: 'M1-06', name: 'El-Zahraa', lat: 29.9200, lng: 31.3200, type: 'metro', lines: ['M1'] },
  { id: 'M1-07', name: 'Maadi', lat: 29.9610, lng: 31.2550, type: 'metro', lines: ['M1'] },
  { id: 'M1-08', name: 'Karmat Ibn Tarek', lat: 29.9680, lng: 31.2460, type: 'metro', lines: ['M1'] },
  { id: 'M1-09', name: 'Sakanat El-Maadi', lat: 29.9760, lng: 31.2420, type: 'metro', lines: ['M1'] },
  { id: 'M1-10', name: 'Maadi Corners', lat: 29.9840, lng: 31.2380, type: 'metro', lines: ['M1'] },
  { id: 'M1-11', name: 'El-Mohandessin', lat: 30.0420, lng: 31.2100, type: 'metro', lines: ['M1'] },
  { id: 'M1-12', name: 'Boulak El-Dakrour', lat: 30.0460, lng: 31.2140, type: 'metro', lines: ['M1'] },
  { id: 'M1-13', name: 'Al-Mounira', lat: 30.0500, lng: 31.2180, type: 'metro', lines: ['M1'] },
  { id: 'M1-14', name: 'Zamalek', lat: 30.0580, lng: 31.2160, type: 'metro', lines: ['M1'] },
  { id: 'M1-15', name: 'Opera', lat: 30.0570, lng: 31.2240, type: 'hub', lines: ['M1', 'M2'] },
  { id: 'M1-16', name: 'Sadat', lat: 30.0550, lng: 31.2310, type: 'hub', lines: ['M1', 'M2'] },
  { id: 'M1-17', name: 'Al-Masjid Al-Nabawi', lat: 30.0560, lng: 31.2400, type: 'metro', lines: ['M1'] },
  { id: 'M1-18', name: 'Al-Manshia', lat: 30.0580, lng: 31.2490, type: 'hub', lines: ['M1', 'M2', 'M3'] },
  { id: 'M1-19', name: 'Ramses', lat: 30.0610, lng: 31.2570, type: 'hub', lines: ['M1', 'M2'] },
  { id: 'M1-20', name: 'Masjid El-Mansour', lat: 30.0660, lng: 31.2630, type: 'metro', lines: ['M1'] },
  { id: 'M1-21', name: 'El-Zahraa', lat: 30.0730, lng: 31.2680, type: 'metro', lines: ['M1'] },
  { id: 'M1-22', name: 'Mar Girgis', lat: 30.0800, lng: 31.2730, type: 'metro', lines: ['M1'] },
  { id: 'M1-23', name: 'El-Matareya', lat: 30.0880, lng: 31.2780, type: 'metro', lines: ['M1'] },
  { id: 'M1-24', name: 'Hadayeq El-Matareya', lat: 30.0950, lng: 31.2830, type: 'metro', lines: ['M1'] },
  { id: 'M1-25', name: 'Al-Marg', lat: 30.1000, lng: 31.2880, type: 'terminal', lines: ['M1'] },

  // M2 (Green Line) - Shubra to El-Manshia
  { id: 'M2-01', name: 'Shubra El-Kheima', lat: 30.1220, lng: 31.2400, type: 'terminal', lines: ['M2'] },
  { id: 'M2-02', name: 'Khalafawy', lat: 30.1180, lng: 31.2460, type: 'metro', lines: ['M2'] },
  { id: 'M2-03', name: 'St. Teresa', lat: 30.1120, lng: 31.2520, type: 'metro', lines: ['M2'] },
  { id: 'M2-04', name: 'Rashad', lat: 30.1060, lng: 31.2580, type: 'metro', lines: ['M2'] },
  { id: 'M2-05', name: 'Al-Mashraa', lat: 30.1000, lng: 31.2650, type: 'metro', lines: ['M2'] },
  { id: 'M2-06', name: 'Kerdasa', lat: 30.0940, lng: 31.2720, type: 'metro', lines: ['M2'] },
  { id: 'M2-07', name: 'Dokki', lat: 30.0430, lng: 31.2080, type: 'metro', lines: ['M2'] },
  { id: 'M2-08', name: 'El-Mansour', lat: 30.0480, lng: 31.2140, type: 'metro', lines: ['M2'] },
  { id: 'M2-09', name: 'Muneera', lat: 30.0530, lng: 31.2200, type: 'metro', lines: ['M2'] },
  { id: 'M2-10', name: 'Opera', lat: 30.0570, lng: 31.2240, type: 'hub', lines: ['M1', 'M2'] },
  { id: 'M2-11', name: 'Sadat', lat: 30.0550, lng: 31.2310, type: 'hub', lines: ['M1', 'M2'] },
  { id: 'M2-12', name: 'Saad Zaghloul', lat: 30.0580, lng: 31.2360, type: 'metro', lines: ['M2'] },
  { id: 'M2-13', name: 'Al-Manshia', lat: 30.0580, lng: 31.2490, type: 'hub', lines: ['M1', 'M2', 'M3'] },
  
  // M3 (Orange Line) - Attaba to Adly Mansour
  { id: 'M3-01', name: 'Attaba', lat: 30.0450, lng: 31.2330, type: 'hub', lines: ['M2', 'M3'] },
  { id: 'M3-02', name: 'Naguib', lat: 30.0480, lng: 31.2380, type: 'metro', lines: ['M3'] },
  { id: 'M3-03', name: 'Ramses', lat: 30.0610, lng: 31.2570, type: 'hub', lines: ['M1', 'M2', 'M3'] },
  { id: 'M3-04', name: 'Abbasia', lat: 30.0660, lng: 31.2720, type: 'metro', lines: ['M3'] },
  { id: 'M3-05', name: 'Al-Shohadaa', lat: 30.0730, lng: 31.2820, type: 'hub', lines: ['M2', 'M3'] },
  { id: 'M3-06', name: 'Hadayeq El-Matareya', lat: 30.0820, lng: 31.2920, type: 'metro', lines: ['M3'] },
  { id: 'M3-07', name: 'Al-Matareya', lat: 30.0880, lng: 31.3020, type: 'metro', lines: ['M3'] },
  { id: 'M3-08', name: 'Ezbet El-Nakhl', lat: 30.0980, lng: 31.3220, type: 'metro', lines: ['M3'] },
  { id: 'M3-09', name: 'Saddiqen', lat: 30.0920, lng: 31.3450, type: 'metro', lines: ['M3'] },
  { id: 'M3-10', name: 'Al-Mahkama', lat: 30.0820, lng: 31.3550, type: 'metro', lines: ['M3'] },
  { id: 'M3-11', name: 'Al-Moqatam', lat: 30.0720, lng: 31.3600, type: 'metro', lines: ['M3'] },
  { id: 'M3-12', name: 'Al-Khalifa', lat: 30.0620, lng: 31.3650, type: 'metro', lines: ['M3'] },
  { id: 'M3-13', name: 'Tora El-Maadi', lat: 30.0520, lng: 31.3700, type: 'metro', lines: ['M3'] },
  { id: 'M3-14', name: 'Maadi', lat: 29.9610, lng: 31.2550, type: 'hub', lines: ['M1', 'M3'] },
  { id: 'M3-15', name: 'Dar El-Salam', lat: 30.0580, lng: 31.3800, type: 'metro', lines: ['M3'] },
  { id: 'M3-16', name: 'Al-Hayk', lat: 30.0320, lng: 31.3700, type: 'metro', lines: ['M3'] },
  { id: 'M3-17', name: 'Wadi El-Natr', lat: 30.0280, lng: 31.3900, type: 'metro', lines: ['M3'] },
  { id: 'M3-18', name: 'Adly Mansour', lat: 30.0220, lng: 31.4000, type: 'terminal', lines: ['M3'] },

  // M4 (Blue Line) - Giza to New Administrative Capital
  { id: 'M4-01', name: 'Giza', lat: 29.9870, lng: 31.2150, type: 'terminal', lines: ['M4'] },
  { id: 'M4-02', name: 'Faisal', lat: 29.9760, lng: 31.2170, type: 'metro', lines: ['M4'] },
  { id: 'M4-03', name: 'El-Manshiya', lat: 30.0100, lng: 31.2240, type: 'metro', lines: ['M4'] },
  { id: 'M4-04', name: 'Muneera', lat: 30.0300, lng: 31.2300, type: 'metro', lines: ['M4'] },
  { id: 'M4-05', name: 'Wadi El-Natr', lat: 30.0380, lng: 31.2340, type: 'metro', lines: ['M4'] },
  { id: 'M4-06', name: 'Al-Mohandessin', lat: 30.0420, lng: 31.2100, type: 'hub', lines: ['M1', 'M4'] },
  { id: 'M4-07', name: 'Qubba', lat: 30.0530, lng: 31.2440, type: 'metro', lines: ['M4'] },
  { id: 'M4-08', name: 'Hadayeq Al-Mokattab', lat: 30.0630, lng: 31.2520, type: 'metro', lines: ['M4'] },
  { id: 'M4-09', name: 'City Center', lat: 30.0330, lng: 31.3950, type: 'metro', lines: ['M4'] },
  { id: 'M4-10', name: 'Government District', lat: 30.0260, lng: 31.4750, type: 'business', lines: ['M4'] },
  { id: 'M4-11', name: 'New Administrative Capital', lat: 30.0160, lng: 31.5450, type: 'terminal', lines: ['M4'] },

  // LRT
  { id: 'LRT-01', name: 'Embaba', lat: 30.0560, lng: 31.2020, type: 'terminal', lines: ['LRT'] },
  { id: 'LRT-02', name: 'Giza', lat: 29.9870, lng: 31.2150, type: 'hub', lines: ['LRT', 'M4'] },
  { id: 'LRT-03', name: 'Banha', lat: 30.1000, lng: 31.1500, type: 'terminal', lines: ['LRT'] },

  // Hubs / Interchanges
  { id: 'HUB-AIR', name: 'Cairo Airport', lat: 30.1200, lng: 31.3950, type: 'capital', lines: ['ML'] },
  { id: 'HUB-SAL', name: 'Al-Salam', lat: 30.1380, lng: 31.4450, type: 'terminal', lines: [] },
];

// Metro edges/connections
export const EDGES = [
  // M1 (Red Line) Connections
  { from: 'M1-01', to: 'M1-02', line: 'M1' },
  { from: 'M1-02', to: 'M1-03', line: 'M1' },
  { from: 'M1-03', to: 'M1-04', line: 'M1' },
  { from: 'M1-04', to: 'M1-05', line: 'M1' },
  { from: 'M1-05', to: 'M1-06', line: 'M1' },
  { from: 'M1-06', to: 'M1-07', line: 'M1' },
  { from: 'M1-07', to: 'M1-08', line: 'M1' },
  { from: 'M1-08', to: 'M1-09', line: 'M1' },
  { from: 'M1-09', to: 'M1-10', line: 'M1' },
  { from: 'M1-10', to: 'M1-11', line: 'M1' },
  { from: 'M1-11', to: 'M1-12', line: 'M1' },
  { from: 'M1-12', to: 'M1-13', line: 'M1' },
  { from: 'M1-13', to: 'M1-14', line: 'M1' },
  { from: 'M1-14', to: 'M1-15', line: 'M1' },
  { from: 'M1-15', to: 'M1-16', line: 'M1' },
  { from: 'M1-16', to: 'M1-17', line: 'M1' },
  { from: 'M1-17', to: 'M1-18', line: 'M1' },
  { from: 'M1-18', to: 'M1-19', line: 'M1' },
  { from: 'M1-19', to: 'M1-20', line: 'M1' },
  { from: 'M1-20', to: 'M1-21', line: 'M1' },
  { from: 'M1-21', to: 'M1-22', line: 'M1' },
  { from: 'M1-22', to: 'M1-23', line: 'M1' },
  { from: 'M1-23', to: 'M1-24', line: 'M1' },
  { from: 'M1-24', to: 'M1-25', line: 'M1' },

  // M2 (Green Line) Connections
  { from: 'M2-01', to: 'M2-02', line: 'M2' },
  { from: 'M2-02', to: 'M2-03', line: 'M2' },
  { from: 'M2-03', to: 'M2-04', line: 'M2' },
  { from: 'M2-04', to: 'M2-05', line: 'M2' },
  { from: 'M2-05', to: 'M2-06', line: 'M2' },
  { from: 'M2-06', to: 'M2-07', line: 'M2' },
  { from: 'M2-07', to: 'M2-08', line: 'M2' },
  { from: 'M2-08', to: 'M2-09', line: 'M2' },
  { from: 'M2-09', to: 'M2-10', line: 'M2' },
  { from: 'M2-10', to: 'M2-11', line: 'M2' },
  { from: 'M2-11', to: 'M2-12', line: 'M2' },
  { from: 'M2-12', to: 'M2-13', line: 'M2' },

  // M3 (Orange Line) Connections
  { from: 'M3-01', to: 'M3-02', line: 'M3' },
  { from: 'M3-02', to: 'M3-03', line: 'M3' },
  { from: 'M3-03', to: 'M3-04', line: 'M3' },
  { from: 'M3-04', to: 'M3-05', line: 'M3' },
  { from: 'M3-05', to: 'M3-06', line: 'M3' },
  { from: 'M3-06', to: 'M3-07', line: 'M3' },
  { from: 'M3-07', to: 'M3-08', line: 'M3' },
  { from: 'M3-08', to: 'M3-09', line: 'M3' },
  { from: 'M3-09', to: 'M3-10', line: 'M3' },
  { from: 'M3-10', to: 'M3-11', line: 'M3' },
  { from: 'M3-11', to: 'M3-12', line: 'M3' },
  { from: 'M3-12', to: 'M3-13', line: 'M3' },
  { from: 'M3-13', to: 'M3-14', line: 'M3' },
  { from: 'M3-14', to: 'M3-15', line: 'M3' },
  { from: 'M3-15', to: 'M3-16', line: 'M3' },
  { from: 'M3-16', to: 'M3-17', line: 'M3' },
  { from: 'M3-17', to: 'M3-18', line: 'M3' },

  // M4 (Blue Line) Connections
  { from: 'M4-01', to: 'M4-02', line: 'M4' },
  { from: 'M4-02', to: 'M4-03', line: 'M4' },
  { from: 'M4-03', to: 'M4-04', line: 'M4' },
  { from: 'M4-04', to: 'M4-05', line: 'M4' },
  { from: 'M4-05', to: 'M4-06', line: 'M4' },
  { from: 'M4-06', to: 'M4-07', line: 'M4' },
  { from: 'M4-07', to: 'M4-08', line: 'M4' },
  { from: 'M4-08', to: 'M4-09', line: 'M4' },
  { from: 'M4-09', to: 'M4-10', line: 'M4' },
  { from: 'M4-10', to: 'M4-11', line: 'M4' },

  // LRT Connections
  { from: 'LRT-01', to: 'LRT-02', line: 'LRT' },
  { from: 'LRT-02', to: 'LRT-03', line: 'LRT' },

  // Hub Interchanges
  { from: 'M1-15', to: 'M2-10', line: 'M1' },
  { from: 'M1-16', to: 'M2-11', line: 'M1' },
  { from: 'M1-18', to: 'M2-13', line: 'M1' },
  { from: 'M1-19', to: 'M3-03', line: 'M1' },
  { from: 'M3-03', to: 'M2-13', line: 'M3' },
  { from: 'M4-06', to: 'M1-11', line: 'M4' },
  { from: 'LRT-02', to: 'M4-01', line: 'LRT' },
];

/**
 * Convert geographic coordinates (lat/lng) to 3D world coordinates
 * Center: Downtown Cairo (30.04, 31.24)
 * Scale: 800 units per degree (roughly 111km per degree at equator)
 */
export function stationToWorld(lat, lng) {
  const CENTER_LAT = 30.04;
  const CENTER_LNG = 31.24;
  const SCALE = 800;

  const x = (lng - CENTER_LNG) * SCALE;
  const z = (lat - CENTER_LAT) * -SCALE; // flip Z for proper orientation

  return { x, z, y: 0 };
}

/**
 * Get station color based on type
 */
export function getStationColor(type) {
  const colorMap = {
    metro: 0x00d4ff,    // Cyan
    monorail: 0xffd700, // Gold
    lrt: 0xff4488,      // Pink
    hub: 0x00ff88,      // Green
    capital: 0x9d00ff,  // Purple
    business: 0xff9f43, // Orange
  };
  return colorMap[type] || 0x94a3b8;
}

