/**
 * Aircraft Image Utility
 * Maps aircraft types to image URLs
 *
 * Using base64 SVG images for reliable display without external dependencies
 * In production, replace with actual aircraft photos
 */

/**
 * Generate SVG data URI for aircraft placeholder
 * @param {string} color - Background color
 * @param {string} text - Aircraft type text
 * @returns {string} Data URI
 */
function generateAircraftSVG(color, text) {
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="${color}"/>
      <text x="150" y="100" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
      <path d="M150 60 L160 70 L160 100 L155 110 L155 120 L145 120 L145 110 L140 100 L140 70 Z" fill="white" opacity="0.8"/>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Aircraft type to image mapping
const AIRCRAFT_IMAGES = {
  // Boeing aircraft
  B737: generateAircraftSVG('#0066cc', 'Boeing 737'),
  B738: generateAircraftSVG('#0066cc', 'Boeing 737-800'),
  B739: generateAircraftSVG('#0066cc', 'Boeing 737-900'),
  B752: generateAircraftSVG('#0066cc', 'Boeing 757-200'),
  B753: generateAircraftSVG('#0066cc', 'Boeing 757-300'),
  B762: generateAircraftSVG('#0066cc', 'Boeing 767-200'),
  B763: generateAircraftSVG('#0066cc', 'Boeing 767-300'),
  B772: generateAircraftSVG('#0066cc', 'Boeing 777-200'),
  B773: generateAircraftSVG('#0066cc', 'Boeing 777-300'),
  B77W: generateAircraftSVG('#0066cc', 'Boeing 777-300ER'),
  B788: generateAircraftSVG('#0066cc', 'Boeing 787-8'),
  B789: generateAircraftSVG('#0066cc', 'Boeing 787-9'),

  // Airbus aircraft
  A319: generateAircraftSVG('#cc0000', 'Airbus A319'),
  A320: generateAircraftSVG('#cc0000', 'Airbus A320'),
  A321: generateAircraftSVG('#cc0000', 'Airbus A321'),
  A332: generateAircraftSVG('#cc0000', 'Airbus A330-200'),
  A333: generateAircraftSVG('#cc0000', 'Airbus A330-300'),
  A359: generateAircraftSVG('#cc0000', 'Airbus A350-900'),
  A35K: generateAircraftSVG('#cc0000', 'Airbus A350-1000'),
  A388: generateAircraftSVG('#cc0000', 'Airbus A380'),

  // Regional jets
  CRJ9: generateAircraftSVG('#006600', 'CRJ-900'),
  E170: generateAircraftSVG('#006600', 'Embraer E170'),
  E175: generateAircraftSVG('#006600', 'Embraer E175'),
  E190: generateAircraftSVG('#006600', 'Embraer E190'),

  // Default fallback
  UNKNOWN: generateAircraftSVG('#666666', 'Aircraft')
};

/**
 * Get aircraft image URL by type code
 * @param {string} aircraftType - ICAO aircraft type code (e.g., 'B738', 'A320')
 * @returns {string} Image URL
 */
export function getAircraftImage(aircraftType) {
  // Type validation: ensure aircraftType is a string
  if (!aircraftType || typeof aircraftType !== 'string' || aircraftType === 'Unknown' || aircraftType === '--') {
    return AIRCRAFT_IMAGES.UNKNOWN;
  }

  // Normalize aircraft type (remove spaces, uppercase)
  const normalizedType = aircraftType.trim().toUpperCase();

  // Check for exact match
  if (AIRCRAFT_IMAGES[normalizedType]) {
    return AIRCRAFT_IMAGES[normalizedType];
  }

  // Try to match partial types (e.g., 'B737-800' → 'B738')
  const typeCode = normalizedType.replace(/[-\s]/g, '').substring(0, 4);
  if (AIRCRAFT_IMAGES[typeCode]) {
    return AIRCRAFT_IMAGES[typeCode];
  }

  // Try to match by prefix (e.g., 'B737' matches any Boeing 737)
  const prefix = typeCode.substring(0, 4);
  for (const [key, value] of Object.entries(AIRCRAFT_IMAGES)) {
    if (key.startsWith(prefix)) {
      return value;
    }
  }

  return AIRCRAFT_IMAGES.UNKNOWN;
}

/**
 * Get aircraft family name from type code
 * @param {string} aircraftType - ICAO aircraft type code
 * @returns {string} Aircraft family name
 */
export function getAircraftFamily(aircraftType) {
  // Type validation: ensure aircraftType is a string
  if (!aircraftType || typeof aircraftType !== 'string' || aircraftType === 'Unknown') {
    return 'Unknown Aircraft';
  }

  const type = aircraftType.trim().toUpperCase();

  // Boeing families
  if (type.startsWith('B7')) {
    if (type.startsWith('B73')) return 'Boeing 737 Family';
    if (type.startsWith('B75')) return 'Boeing 757';
    if (type.startsWith('B76')) return 'Boeing 767';
    if (type.startsWith('B77')) return 'Boeing 777 Family';
    if (type.startsWith('B78')) return 'Boeing 787 Dreamliner';
  }

  // Airbus families
  if (type.startsWith('A3')) {
    if (type.startsWith('A31') || type.startsWith('A32')) return 'Airbus A320 Family';
    if (type.startsWith('A33')) return 'Airbus A330 Family';
    if (type.startsWith('A35')) return 'Airbus A350 XWB';
    if (type.startsWith('A38')) return 'Airbus A380';
  }

  // Regional jets
  if (type.startsWith('CRJ')) return 'Bombardier CRJ Series';
  if (type.startsWith('E1') || type.startsWith('E19')) return 'Embraer E-Jet Family';

  return aircraftType;
}

/**
 * Determine aircraft size category
 * @param {string} aircraftType - ICAO aircraft type code
 * @returns {string} Size category ('small', 'medium', 'large', 'widebody')
 */
export function getAircraftSize(aircraftType) {
  // Type validation: ensure aircraftType is a string
  if (!aircraftType || typeof aircraftType !== 'string') return 'unknown';

  const type = aircraftType.trim().toUpperCase();

  // Widebody aircraft
  if (type.match(/^(B7[67]|B77|A33|A35|A38)/)) return 'widebody';

  // Large narrowbody
  if (type.match(/^(B75|B78|A32[01])/)) return 'large';

  // Medium narrowbody
  if (type.match(/^(B73|A319)/)) return 'medium';

  // Regional jets
  if (type.match(/^(CRJ|E1)/)) return 'small';

  return 'medium'; // Default
}

export default {
  getAircraftImage,
  getAircraftFamily,
  getAircraftSize
};
