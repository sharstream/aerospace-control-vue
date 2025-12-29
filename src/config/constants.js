/**
 * SkySentinel Global Configuration
 *
 * Georgia state bounding box configuration matching backend API
 * Area: 24.9 sq degrees (under 25 sq deg threshold = 1 credit per request)
 *
 * Centered on Hartsfield-Jackson Atlanta International Airport
 * Coverage: North GA mountains to Middle Georgia, Augusta area to Alabama border
 */

// Georgia state bounding box (matching backend - 24.9 sq deg)
// Format: Leaflet.js [latitude, longitude]
export const GEORGIA_BBOX = {
  southWest: [31.15, -86.92], // Middle Georgia to Alabama border
  northEast: [36.14, -81.93] // North GA mountains to Augusta
};

// Hartsfield-Jackson Atlanta International Airport coordinates
export const ATLANTA_CENTER = [33.6407, -84.4277]; // [latitude, longitude]

// Backend API bounding box format (for reference)
export const BACKEND_BBOX = {
  lamin: 31.15, // South - Middle Georgia (Macon area)
  lamax: 36.14, // North - North Georgia mountains
  lomin: -86.92, // West - Alabama border
  lomax: -81.93 // East - Augusta area
};

// Area calculation
export const BBOX_AREA = {
  latitudeSpan: 4.99, // degrees (36.14 - 31.15)
  longitudeSpan: 4.99, // degrees (-81.93 - (-86.92))
  totalArea: 24.9, // square degrees
  pricingTier: 1 // OpenSky credits per request
};
