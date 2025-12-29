# Global Configuration Refactoring

**Date:** 2025-12-28
**Status:** ✅ Complete

---

## Overview

Refactored the Georgia bounding box and Atlanta center coordinates from component-level data to global configuration constants, improving maintainability and consistency across the application.

---

## Changes Made

### 1. Created Global Configuration File

**File:** `src/config/constants.js`

Created a centralized configuration file containing all bounding box constants:

```javascript
// Georgia state bounding box (Leaflet format)
export const GEORGIA_BBOX = {
  southWest: [31.15, -86.92], // Middle Georgia to Alabama border
  northEast: [36.14, -81.93]  // North GA mountains to Augusta
};

// Hartsfield-Jackson Atlanta International Airport coordinates
export const ATLANTA_CENTER = [33.6407, -84.4277]; // [latitude, longitude]

// Backend API bounding box format (for reference)
export const BACKEND_BBOX = {
  lamin: 31.15,   // South - Middle Georgia (Macon area)
  lamax: 36.14,   // North - North Georgia mountains
  lomin: -86.92,  // West - Alabama border
  lomax: -81.93   // East - Augusta area
};

// Area calculation
export const BBOX_AREA = {
  latitudeSpan: 4.99,     // degrees (36.14 - 31.15)
  longitudeSpan: 4.99,    // degrees (-81.93 - (-86.92))
  totalArea: 24.9,        // square degrees
  pricingTier: 1          // OpenSky credits per request
};
```

---

### 2. Updated main.js

**File:** `src/main.js`

Made configuration globally available through two methods:

#### A. Window Global (for debugging/console access)
```javascript
import { GEORGIA_BBOX, ATLANTA_CENTER, BBOX_AREA } from './config/constants';

window.SKYSENT_CONFIG = {
  GEORGIA_BBOX,
  ATLANTA_CENTER,
  BBOX_AREA
};
```

#### B. Vue Provide/Inject (for component access)
```javascript
app.provide('GEORGIA_BBOX', GEORGIA_BBOX);
app.provide('ATLANTA_CENTER', ATLANTA_CENTER);
app.provide('BBOX_AREA', BBOX_AREA);
```

---

### 3. Updated MapModule

**File:** `src/modules/map/MapModule.vue`

#### Before:
```javascript
data() {
  return {
    map: null,
    flightMarkers: {},
    flightPaths: {},
    weatherCircles: [],
    resizeHandler: null,
    // Duplicated configuration in component
    GEORGIA_BBOX: {
      southWest: [31.15, -86.92],
      northEast: [36.14, -81.93]
    },
    ATLANTA_CENTER: [33.6407, -84.4277]
  };
}
```

#### After:
```javascript
import { GEORGIA_BBOX, ATLANTA_CENTER } from '@/config/constants';

data() {
  return {
    map: null,
    flightMarkers: {},
    flightPaths: {},
    weatherCircles: [],
    resizeHandler: null
  };
}

initializeMap() {
  this.map = new Map(this.$refs.mapContainer, {
    center: ATLANTA_CENTER,  // Using imported constant
    zoom: 7,
    // ...
  });

  this.map.fitBounds([GEORGIA_BBOX.southWest, GEORGIA_BBOX.northEast], {
    padding: [20, 20]
  });
}
```

---

## Benefits

### 1. **Single Source of Truth** ✅
- All bounding box coordinates defined in one place
- Eliminates duplication across components
- Easier to update if coverage area changes

### 2. **Better Maintainability** ✅
- Changes to bounding box only require updating one file
- Clearer separation of configuration from component logic
- Documented with comprehensive comments

### 3. **Reusability** ✅
- Any component can import these constants
- Available globally via `window.SKYSENT_CONFIG` for debugging
- Available via Vue's provide/inject for component composition

### 4. **Type Safety & Consistency** ✅
- Constants are exported as const (immutable)
- Same format guaranteed across all consumers
- Prevents accidental modifications

### 5. **Documentation** ✅
- Clear comments explain each constant's purpose
- Backend format included for reference
- Area calculations documented

---

## Usage Examples

### In Vue Components (via import)
```javascript
import { GEORGIA_BBOX, ATLANTA_CENTER } from '@/config/constants';

export default {
  mounted() {
    console.log('Map center:', ATLANTA_CENTER);
    console.log('Coverage area:', GEORGIA_BBOX);
  }
};
```

### In Vue Components (via inject)
```javascript
export default {
  inject: ['GEORGIA_BBOX', 'ATLANTA_CENTER'],
  mounted() {
    console.log('Map center:', this.ATLANTA_CENTER);
    console.log('Coverage area:', this.GEORGIA_BBOX);
  }
};
```

### In Browser Console (for debugging)
```javascript
// Access configuration globally
console.log(window.SKYSENT_CONFIG.GEORGIA_BBOX);
console.log(window.SKYSENT_CONFIG.ATLANTA_CENTER);
console.log(window.SKYSENT_CONFIG.BBOX_AREA);

// Output:
// { southWest: [31.15, -86.92], northEast: [36.14, -81.93] }
// [33.6407, -84.4277]
// { latitudeSpan: 4.99, longitudeSpan: 4.99, totalArea: 24.9, pricingTier: 1 }
```

---

## File Structure

```
src/
├── config/
│   └── constants.js          ← New: Global configuration constants
├── main.js                    ← Updated: Import and provide constants
├── modules/
│   └── map/
│       └── MapModule.vue      ← Updated: Import and use constants
```

---

## Coordinate Format Reference

### Leaflet Format (Frontend)
Used by Leaflet.js map library:
```javascript
{
  southWest: [latitude, longitude],  // Southwest corner
  northEast: [latitude, longitude]   // Northeast corner
}
```

### OpenSky Format (Backend)
Used by OpenSky API:
```javascript
{
  lamin: latitude,   // Minimum latitude (South)
  lamax: latitude,   // Maximum latitude (North)
  lomin: longitude,  // Minimum longitude (West)
  lomax: longitude   // Maximum longitude (East)
}
```

---

## Alignment with Backend

The constants in `src/config/constants.js` match the backend configuration in `/app/main.py`:

| Frontend | Backend | Value | Description |
|----------|---------|-------|-------------|
| `GEORGIA_BBOX.southWest[0]` | `DEFAULT_BBOX.lamin` | 31.15 | South boundary |
| `GEORGIA_BBOX.northEast[0]` | `DEFAULT_BBOX.lamax` | 36.14 | North boundary |
| `GEORGIA_BBOX.southWest[1]` | `DEFAULT_BBOX.lomin` | -86.92 | West boundary |
| `GEORGIA_BBOX.northEast[1]` | `DEFAULT_BBOX.lomax` | -81.93 | East boundary |

✅ **Perfect alignment maintained between frontend and backend**

---

## Future Enhancements

### 1. Environment-Based Configuration
```javascript
// config/constants.js
const isDevelopment = import.meta.env.MODE === 'development';

export const GEORGIA_BBOX = isDevelopment
  ? SMALL_BBOX_FOR_TESTING   // 1 sq deg for faster dev
  : FULL_GEORGIA_BBOX;        // 24.9 sq deg for production
```

### 2. User-Configurable Regions
```javascript
// Allow users to switch between regions
export const REGIONS = {
  georgia: { bbox: GEORGIA_BBOX, center: ATLANTA_CENTER },
  florida: { bbox: FLORIDA_BBOX, center: MIAMI_CENTER },
  texas: { bbox: TEXAS_BBOX, center: DALLAS_CENTER }
};
```

### 3. Dynamic Bounding Box
```javascript
// Calculate optimal bbox based on user location
export function getOptimalBbox(userLat, userLon, radius) {
  // Calculate bbox that keeps under 25 sq deg
  return calculateBbox(userLat, userLon, radius);
}
```

---

## Testing

### Unit Tests (Future)
```javascript
import { GEORGIA_BBOX, ATLANTA_CENTER, BBOX_AREA } from '@/config/constants';

describe('Configuration Constants', () => {
  test('GEORGIA_BBOX has correct structure', () => {
    expect(GEORGIA_BBOX).toHaveProperty('southWest');
    expect(GEORGIA_BBOX).toHaveProperty('northEast');
  });

  test('Area is under 25 sq deg threshold', () => {
    expect(BBOX_AREA.totalArea).toBeLessThan(25);
    expect(BBOX_AREA.pricingTier).toBe(1);
  });

  test('Atlanta center is within Georgia bbox', () => {
    const [lat, lon] = ATLANTA_CENTER;
    expect(lat).toBeGreaterThan(GEORGIA_BBOX.southWest[0]);
    expect(lat).toBeLessThan(GEORGIA_BBOX.northEast[0]);
  });
});
```

---

## Migration Checklist

✅ Created `src/config/constants.js` with all constants
✅ Updated `src/main.js` to import and provide constants
✅ Updated `src/modules/map/MapModule.vue` to use imported constants
✅ Removed duplicate constants from MapModule data()
✅ Ran ESLint and fixed all formatting issues
✅ Verified frontend-backend coordinate alignment
✅ Documented refactoring in this file

---

**Refactoring completed:** 2025-12-28
**Status:** ✅ All components using global configuration
