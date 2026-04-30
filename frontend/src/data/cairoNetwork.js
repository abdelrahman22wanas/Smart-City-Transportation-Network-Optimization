/**
 * Cairo Network Nodes with real lat/lng coordinates
 * All nodes will be rendered in 3D space using coordinate mapping
 */

export const CAIRO_NODES = [
  // Neighborhoods
  { id: 1, name: 'Maadi', lat: 29.9605, lng: 31.2415, type: 'Residential', population: 250000 },
  { id: 2, name: 'Nasr City', lat: 30.0405, lng: 31.3607, type: 'Business', population: 500000 },
  { id: 3, name: 'Downtown Cairo', lat: 30.0330, lng: 31.2407, type: 'Mixed', population: 450000 },
  { id: 4, name: 'New Cairo', lat: 30.0327, lng: 31.4847, type: 'Business', population: 320000 },
  { id: 5, name: 'Heliopolis', lat: 30.0800, lng: 31.3407, type: 'Residential', population: 280000 },
  { id: 6, name: 'Zamalek', lat: 30.0607, lng: 31.2207, type: 'Residential', population: 180000 },
  { id: 7, name: '6th October City', lat: 29.9930, lng: 30.8807, type: 'Industrial', population: 380000 },
  { id: 8, name: 'Giza', lat: 30.0130, lng: 31.2107, type: 'Residential', population: 520000 },
  { id: 9, name: 'Mohandessin', lat: 30.0530, lng: 31.2007, type: 'Business', population: 280000 },
  { id: 10, name: 'Dokki', lat: 30.0330, lng: 31.2107, type: 'Residential', population: 200000 },
  { id: 11, name: 'Shubra', lat: 30.1430, lng: 31.2407, type: 'Residential', population: 420000 },
  { id: 12, name: 'Helwan', lat: 29.8630, lng: 31.3407, type: 'Industrial', population: 380000 },
  { id: 13, name: 'New Administrative Capital', lat: 30.0330, lng: 31.7447, type: 'Government', population: 500000 },
  { id: 14, name: 'Al Rehab', lat: 30.0405, lng: 31.4847, type: 'Residential', population: 220000 },
  { id: 15, name: 'Sheikh Zayed', lat: 30.0430, lng: 30.8707, type: 'Residential', population: 310000 },

  // Facilities
  { id: 'F1', name: 'Cairo International Airport', lat: 30.0705, lng: 31.4047, type: 'Airport', population: 50000 },
  { id: 'F2', name: 'Ramses Station', lat: 30.0605, lng: 31.2407, type: 'Transit', population: 40000 },
  { id: 'F3', name: 'Cairo University', lat: 30.0330, lng: 31.2107, type: 'Education', population: 30000 },
  { id: 'F4', name: 'Al-Azhar University', lat: 30.0530, lng: 31.2507, type: 'Education', population: 25000 },
  { id: 'F5', name: 'Egyptian Museum', lat: 30.0480, lng: 31.2407, type: 'Tourism', population: 15000 },
  { id: 'F6', name: 'Cairo Stadium', lat: 30.0705, lng: 31.3007, type: 'Sports', population: 45000 },
  { id: 'F7', name: 'Smart Village', lat: 30.0330, lng: 30.8107, type: 'Business', population: 35000 },
  { id: 'F8', name: 'Cairo Festival City', lat: 30.0330, lng: 31.4047, type: 'Commercial', population: 55000 },
  { id: 'F9', name: 'Qasr El Aini Hospital', lat: 30.0330, lng: 31.2407, type: 'Medical', population: 5000 },
  { id: 'F10', name: 'Maadi Military Hospital', lat: 29.9605, lng: 31.2415, type: 'Medical', population: 8000 },
];

/**
 * Convert lat/lng to 3D X/Z coordinates
 * Center: Downtown Cairo (30.0330, 31.2407)
 * Scale: 800 units per degree (roughly 111km per degree at equator)
 */
export function coordinateToWorld(lat, lng) {
  const CENTER_LAT = 30.0330;
  const CENTER_LNG = 31.2407;
  const SCALE = 800;

  const x = (lng - CENTER_LNG) * SCALE;
  const z = (lat - CENTER_LAT) * -SCALE; // flip Z for proper orientation

  return { x, z, y: 0 };
}

/**
 * Get node radius based on population
 */
export function getNodeRadius(population) {
  if (population < 100000) return 6;
  if (population < 250000) return 8;
  if (population < 400000) return 10;
  return 13;
}

/**
 * Get node color by type
 */
export const NODE_COLORS = {
  Residential: 0x0066ff,    // Blue
  Business: 0xff6600,       // Orange
  Industrial: 0xcc2200,     // Red
  Government: 0x9d00ff,     // Purple
  Medical: 0x00ff88,        // Green
  Airport: 0xffd700,        // Gold
  Transit: 0x00f5ff,        // Cyan
  Education: 0xaa88ff,      // Light Purple
  Tourism: 0xff88aa,        // Pink
  Commercial: 0x88ffcc,     // Mint
  Sports: 0xffaa00,         // Amber
  Mixed: 0x7da3fc,          // Light Blue
};

export function getNodeColor(type) {
  return NODE_COLORS[type] || NODE_COLORS.Residential;
}
