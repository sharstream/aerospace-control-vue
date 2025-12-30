/**
 * Aircraft Image Utility
 * Maps aircraft types to real aircraft photos from free sources
 *
 * Photo sources: Unsplash, Pexels (free for commercial use)
 */

// Aircraft type to image mapping with real photos
const AIRCRAFT_IMAGES = {
  // Boeing 737 Family
  B737: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
  B738: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',
  B739: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop',

  // Boeing 757
  B752: 'https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?w=800&h=600&fit=crop',
  B753: 'https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?w=800&h=600&fit=crop',

  // Boeing 767
  B762: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop',
  B763: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop',

  // Boeing 777 Family
  B772: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
  B773: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
  B77W: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',

  // Boeing 787 Dreamliner
  B788: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop',
  B789: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&h=600&fit=crop',

  // Airbus A320 Family
  A319: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop',
  A320: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop',
  A321: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&h=600&fit=crop',

  // Airbus A330 Family
  A332: 'https://images.unsplash.com/photo-1583604310111-9b707b1d0d80?w=800&h=600&fit=crop',
  A333: 'https://images.unsplash.com/photo-1583604310111-9b707b1d0d80?w=800&h=600&fit=crop',

  // Airbus A350
  A359: 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800&h=600&fit=crop',
  A35K: 'https://images.unsplash.com/photo-1562832135-14a35d25edef?w=800&h=600&fit=crop',

  // Airbus A380
  A388: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop',

  // Regional Jets
  CRJ9: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
  E170: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
  E175: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',
  E190: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&h=600&fit=crop',

  // Default fallback - generic commercial aircraft
  UNKNOWN: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&h=600&fit=crop'
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
