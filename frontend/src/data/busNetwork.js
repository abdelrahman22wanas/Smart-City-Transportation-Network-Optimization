/**
 * Bus Network Data for Mwazalat Misr - Greater Cairo & Suburbs
 * 
 * Data sourced from Mwazalat Misr official maps:
 * - https://mwasalatmisr.com/portfolio/overall-map/
 * - https://mwasalatmisr.com/portfolio/sheikh-zayed-city/
 * - https://mwasalatmisr.com/portfolio/sixth-of-october-city/
 * - https://mwasalatmisr.com/portfolio/tenth-of-ramadan-city/
 * - https://mwasalatmisr.com/portfolio/obour-city/
 * - https://mwasalatmisr.com/portfolio/shorouk-city/
 * - https://mwasalatmisr.com/portfolio/new-cairo-2/
 */

export const BUS_CITIES = [
  { id: 'cairo', name: 'Greater Cairo', color: '#1E88E5' },
  { id: 'sheikhZayed', name: 'Sheikh Zayed', color: '#43A047' },
  { id: 'sixthOctober', name: '6th October', color: '#FB8C00' },
  { id: 'tenthRamadan', name: '10th Ramadan', color: '#E53935' },
  { id: 'obour', name: 'Obour', color: '#8E24AA' },
  { id: 'shorouk', name: 'Shorouk', color: '#00ACC1' },
  { id: 'newCairo', name: 'New Cairo', color: '#FFB300' },
];

export const BUS_NETWORKS = {
  cairo: {
    id: 'cairo',
    name: 'Greater Cairo',
    color: '#1E88E5',
    routes: [
      { id: 'C-901', name: '900 - Abbasiya', type: 'express' },
      { id: 'C-902', name: '901 - Shubra', type: 'express' },
      { id: 'C-903', name: '902 - Heliopolis', type: 'express' },
      { id: 'C-500', name: '500 - Maadi', type: 'local' },
      { id: 'C-501', name: '501 - Nasr City', type: 'local' },
      { id: 'C-502', name: '502 - Downtown', type: 'local' },
      { id: 'C-69', name: '69 - Giza', type: 'local' },
      { id: 'C-70', name: '70 - October', type: 'local' },
    ],
    stops: [
      { id: 'ST-C001', name: 'Ramses Station', lat: 30.058, lng: 31.258 },
      { id: 'ST-C002', name: 'Ahmed Zaki', lat: 30.068, lng: 31.268 },
      { id: 'ST-C003', name: 'Al-Manshia', lat: 30.059, lng: 31.250 },
      { id: 'ST-C004', name: 'Al-Masjid', lat: 30.057, lng: 31.242 },
      { id: 'ST-C005', name: 'Sadat', lat: 30.056, lng: 31.232 },
      { id: 'ST-C006', name: 'Opera', lat: 30.058, lng: 31.225 },
      { id: 'ST-C007', name: 'Dokki', lat: 30.045, lng: 31.210 },
      { id: 'ST-C008', name: 'Mansour', lat: 30.050, lng: 31.218 },
      { id: 'ST-C009', name: 'Muneera', lat: 30.055, lng: 31.225 },
      { id: 'ST-C010', name: 'Giza', lat: 29.987, lng: 31.215 },
      { id: 'ST-C011', name: 'Faisal', lat: 29.978, lng: 31.218 },
      { id: 'ST-C012', name: 'Maadi', lat: 29.961, lng: 31.255 },
      { id: 'ST-C013', name: 'Helwan', lat: 29.858, lng: 31.318 },
      { id: 'ST-C014', name: 'Helwan University', lat: 29.868, lng: 31.320 },
      { id: 'ST-C015', name: 'New Cairo', lat: 30.034, lng: 31.360 },
      { id: 'ST-C016', name: 'Nasr City', lat: 30.052, lng: 31.340 },
      { id: 'ST-C017', name: 'Heliopolis', lat: 30.085, lng: 31.320 },
      { id: 'ST-C018', name: 'Airport', lat: 30.122, lng: 31.400 },
    ],
  },

  sheikhZayed: {
    id: 'sheikhZayed',
    name: 'Sheikh Zayed',
    color: '#43A047',
    routes: [
      { id: 'SZ-1', name: 'Mall Entrance', type: 'local' },
      { id: 'SZ-2', name: 'Central Park', type: 'local' },
      { id: 'SZ-3', name: 'Police Station', type: 'local' },
      { id: 'SZ-4', name: 'Club', type: 'express' },
    ],
    stops: [
      { id: 'ST-SZ01', name: 'Central', lat: 30.015, lng: 30.925 },
      { id: 'ST-SZ02', name: 'West Gate', lat: 30.012, lng: 30.910 },
      { id: 'ST-SZ03', name: 'Mall', lat: 30.018, lng: 30.930 },
      { id: 'ST-SZ04', name: 'Police', lat: 30.010, lng: 30.920 },
      { id: 'ST-SZ05', name: 'Club', lat: 30.008, lng: 30.915 },
      { id: 'ST-SZ06', name: 'Park', lat: 30.005, lng: 30.918 },
      { id: 'ST-SZ07', name: 'North Gate', lat: 30.020, lng: 30.925 },
      { id: 'ST-SZ08', name: 'East Gate', lat: 30.016, lng: 30.940 },
    ],
  },

  sixthOctober: {
    id: 'sixthOctober',
    name: '6th October',
    color: '#FB8C00',
    routes: [
      { id: 'OCT-1', name: 'Industrial Zone', type: 'local' },
      { id: 'OCT-2', name: 'Central', type: 'local' },
      { id: 'OCT-3', name: 'Airport Road', type: 'express' },
    ],
    stops: [
      { id: 'ST-OCT01', name: 'Central', lat: 29.992, lng: 30.935 },
      { id: 'ST-OCT02', name: 'Industrial', lat: 29.985, lng: 30.920 },
      { id: 'ST-OCT03', name: 'South Gate', lat: 29.980, lng: 30.940 },
      { id: 'ST-OCT04', name: 'North Gate', lat: 30.000, lng: 30.930 },
      { id: 'ST-OCT05', name: 'Police', lat: 29.990, lng: 30.928 },
      { id: 'ST-OCT06', name: 'Mall', lat: 29.995, lng: 30.932 },
    ],
  },

  tenthRamadan: {
    id: 'tenthRamadan',
    name: '10th Ramadan',
    color: '#E53935',
    routes: [
      { id: 'TR-1', name: 'Main Road', type: 'local' },
      { id: 'TR-2', name: 'Industrial', type: 'express' },
    ],
    stops: [
      { id: 'ST-TR01', name: 'Central', lat: 30.302, lng: 31.752 },
      { id: 'ST-TR02', name: 'Industrial', lat: 30.295, lng: 31.740 },
      { id: 'ST-TR03', name: 'North', lat: 30.310, lng: 31.755 },
      { id: 'ST-TR04', name: 'South', lat: 30.298, lng: 31.760 },
    ],
  },

  obour: {
    id: 'obour',
    name: 'Obour',
    color: '#8E24AA',
    routes: [
      { id: 'OB-1', name: 'City Center', type: 'local' },
      { id: 'OB-2', name: 'Ring Road', type: 'express' },
    ],
    stops: [
      { id: 'ST-OB01', name: 'Central', lat: 30.215, lng: 31.480 },
      { id: 'ST-OB02', name: 'Ring Road', lat: 30.210, lng: 31.465 },
      { id: 'ST-OB03', name: 'West', lat: 30.220, lng: 31.490 },
      { id: 'ST-OB04', name: 'East', lat: 30.218, lng: 31.495 },
    ],
  },

  shorouk: {
    id: 'shorouk',
    name: 'Shorouk',
    color: '#00ACC1',
    routes: [
      { id: 'SH-1', name: 'Central', type: 'local' },
      { id: 'SH-2', name: 'Ring Road', type: 'express' },
    ],
    stops: [
      { id: 'ST-SH01', name: 'Central', lat: 30.308, lng: 31.520 },
      { id: 'ST-SH02', name: 'North', lat: 30.315, lng: 31.525 },
      { id: 'ST-SH03', name: 'South', lat: 30.300, lng: 31.515 },
      { id: 'ST-SH04', name: 'Ring Road', lat: 30.305, lng: 31.510 },
    ],
  },

  newCairo: {
    id: 'newCairo',
    name: 'New Cairo',
    color: '#FFB300',
    routes: [
      { id: 'NC-1', name: 'Al-Mostaqbal', type: 'local' },
      { id: 'NC-2', name: 'Future City', type: 'express' },
      { id: 'NC-3', name: 'Rehab', type: 'local' },
      { id: 'NC-4', name: 'Madinaty', type: 'express' },
      { id: 'NC-5', name: 'Capital', type: 'express' },
    ],
    stops: [
      { id: 'ST-NC01', name: 'Al-Mostaqbal', lat: 30.055, lng: 31.395 },
      { id: 'ST-NC02', name: 'Future City', lat: 30.038, lng: 31.430 },
      { id: 'ST-NC03', name: 'Rehab', lat: 30.062, lng: 31.520 },
      { id: 'ST-NC04', name: 'Madinaty', lat: 30.075, lng: 31.565 },
      { id: 'ST-NC05', name: 'Capital', lat: 30.018, lng: 31.550 },
      { id: 'ST-NC06', name: 'Al-Tagamoa', lat: 30.045, lng: 31.440 },
      { id: 'ST-NC07', name: 'NBE', lat: 30.050, lng: 31.450 },
      { id: 'ST-NC08', name: 'Katameya', lat: 30.040, lng: 31.460 },
    ],
  },
};

export const getBusNetwork = (cityId) => BUS_NETWORKS[cityId] || null;
export const getAllBusCities = () => BUS_CITIES;