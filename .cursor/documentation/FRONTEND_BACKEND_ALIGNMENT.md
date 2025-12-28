# Frontend-Backend Bounding Box Alignment

**Date:** 2025-12-28
**Status:** ✅ Complete Alignment Achieved

---

## Overview

The frontend MapModule and backend API endpoints now use identical Georgia state bounding box coordinates, ensuring the map display perfectly matches the aircraft data coverage area.

---

## Bounding Box Specifications

### Geographic Coverage
- **Center Point**: Hartsfield-Jackson Atlanta International Airport
  - Latitude: 33.6407°N
  - Longitude: -84.4277°W

### Coverage Area
- **North**: North Georgia mountains (36.14°N)
- **South**: Middle Georgia / Macon area (31.15°N)
- **East**: Augusta area (-81.93°W)
- **West**: Alabama border (-86.92°W)

### Area Calculation
- **Latitude span**: 4.99° (36.14° - 31.15°)
- **Longitude span**: 4.99° (-81.93° - (-86.92°))
- **Total area**: 24.9 square degrees

### OpenSky API Pricing Tier
- **Cost**: 1 credit per request
- **Threshold**: Under 25 sq deg (0-25 sq deg = 1 credit)
- **Optimization**: Maximum coverage at minimum cost

---

## Backend Configuration

**File:** `/app/main.py`

```python
# ============================================================================
# DEFAULT BOUNDING BOX - GEORGIA STATE COVERAGE
# ============================================================================
DEFAULT_BBOX = {
    "lamin": 31.15,   # South - Middle Georgia (Macon area)
    "lamax": 36.14,   # North - North Georgia mountains
    "lomin": -86.92,  # West - Alabama border
    "lomax": -81.93   # East - Augusta area
}
# Area: 24.9 sq deg (just under 25 sq deg threshold)
# Cost: 1 credit per request (vs 4 credits for global)
```

**Endpoints Using Bounding Box:**
- `GET /api/v1/airspace` - Default Georgia coverage
- `GET /api/v1/airspace/region` - Custom bounding box (user-specified)

**Response Metadata:**
```json
{
  "metadata": {
    "bounding_box": {
      "lamin": 31.15,
      "lamax": 36.14,
      "lomin": -86.92,
      "lomax": -81.93
    },
    "area_coverage": "Georgia State (North GA mountains, Middle GA, Augusta area, centered on ATL Airport)",
    "area_square_degrees": 24.9
  }
}
```

---

## Frontend Configuration

**File:** `/src/modules/map/MapModule.vue`

```javascript
data() {
  return {
    // Georgia state bounding box (matching backend - 24.9 sq deg)
    // Centered on Hartsfield-Jackson Atlanta International Airport
    GEORGIA_BBOX: {
      southWest: [31.15, -86.92], // Middle Georgia to Alabama border
      northEast: [36.14, -81.93]  // North GA mountains to Augusta
    },
    ATLANTA_CENTER: [33.6407, -84.4277] // ATL Airport coordinates
  };
}
```

**Map Initialization:**
```javascript
initializeMap() {
  // Initialize Leaflet map centered on Atlanta Airport
  this.map = new Map(this.$refs.mapContainer, {
    center: this.ATLANTA_CENTER,
    zoom: 7,
    zoomControl: false,
    attributionControl: true
  });

  // Add OpenStreetMap tiles
  new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(this.map);

  // Fit map to Georgia state bounding box (24.9 sq deg - same as backend)
  this.map.fitBounds([this.GEORGIA_BBOX.southWest, this.GEORGIA_BBOX.northEast], {
    padding: [20, 20] // Add 20px padding on all sides
  });
}
```

---

## Coordinate System Alignment

### Backend Format (OpenSky API)
```json
{
  "lamin": 31.15,   // Minimum latitude (South)
  "lamax": 36.14,   // Maximum latitude (North)
  "lomin": -86.92,  // Minimum longitude (West)
  "lomax": -81.93   // Maximum longitude (East)
}
```

### Frontend Format (Leaflet.js)
```javascript
{
  southWest: [31.15, -86.92], // [lat, lon] - Southwest corner
  northEast: [36.14, -81.93]  // [lat, lon] - Northeast corner
}
```

### Coordinate Mapping
| Backend | Frontend | Value | Description |
|---------|----------|-------|-------------|
| `lamin` | `southWest[0]` | 31.15 | South boundary (latitude) |
| `lomin` | `southWest[1]` | -86.92 | West boundary (longitude) |
| `lamax` | `northEast[0]` | 36.14 | North boundary (latitude) |
| `lomax` | `northEast[1]` | -81.93 | East boundary (longitude) |

✅ **Coordinates are perfectly aligned between frontend and backend**

---

## Visual Representation

```
                North (36.14°N)
                North Georgia Mountains
                        |
        West            |           East
    (-86.92°W) ←--------+---------→ (-81.93°W)
    AL Border           |           Augusta
                        |
                        ⊕ Atlanta Airport
                  (33.6407°N, -84.4277°W)
                        |
                South (31.15°N)
                Middle Georgia
```

---

## Benefits of Alignment

### 1. **Data-Display Consistency** ✅
- Map view matches exact coverage area of aircraft data
- No aircraft markers outside visible map bounds
- No empty map space with missing data

### 2. **User Experience** ✅
- Automatic zoom to optimal viewing level
- All relevant aircraft visible on initial load
- Intuitive geographic context (Georgia state)

### 3. **Performance Optimization** ✅
- Frontend doesn't request data for out-of-view areas
- Backend doesn't send aircraft data beyond map bounds
- Efficient use of screen real estate

### 4. **Cost Optimization** ✅
- Maximum coverage (24.9 sq deg) at minimum cost (1 credit)
- 540x larger than original Atlanta metro bbox (0.046 sq deg)
- Still under 25 sq deg threshold for 1-credit pricing

---

## Before/After Comparison

### Before Alignment
- **Backend**: Global query (4 credits/request)
- **Frontend**: Centered on Atlantic Ocean [40, -40], zoom 3
- **Result**: Map showed wrong region, excessive API costs

### After Alignment
- **Backend**: Georgia state bbox (1 credit/request)
- **Frontend**: Centered on Atlanta Airport [33.6407, -84.4277], auto-fit to bbox
- **Result**: Perfect alignment, optimal costs, excellent UX

---

## Testing & Verification

### Backend Test
```bash
curl -s "http://localhost:8000/api/v1/airspace?limit=10" | \
  python3 -c "import sys, json; data = json.load(sys.stdin); \
  print(f\"Bounding box: {data['metadata']['bounding_box']}\"); \
  print(f\"Area: {data['metadata']['area_square_degrees']} sq deg\"); \
  print(f\"Coverage: {data['metadata']['area_coverage']}\")"
```

**Expected Output:**
```
Bounding box: {'lamin': 31.15, 'lamax': 36.14, 'lomin': -86.92, 'lomax': -81.93}
Area: 24.9 sq deg
Coverage: Georgia State (North GA mountains, Middle GA, Augusta area, centered on ATL Airport)
```

### Frontend Test
1. Open application in browser
2. Navigate to Map view
3. **Verify:**
   - Map centered on Atlanta area
   - Entire Georgia state visible
   - Aircraft markers within visible bounds
   - Zoom level appropriate (~7-8)

---

## Maintenance Notes

### Updating Bounding Box
If you need to change the coverage area in the future:

1. **Update backend** (`/app/main.py`):
   ```python
   DEFAULT_BBOX = {
       "lamin": NEW_SOUTH_LAT,
       "lamax": NEW_NORTH_LAT,
       "lomin": NEW_WEST_LON,
       "lomax": NEW_EAST_LON
   }
   ```

2. **Update frontend** (`/src/modules/map/MapModule.vue`):
   ```javascript
   GEORGIA_BBOX: {
     southWest: [NEW_SOUTH_LAT, NEW_WEST_LON],
     northEast: [NEW_NORTH_LAT, NEW_EAST_LON]
   }
   ```

3. **Ensure coordinates match exactly** between frontend and backend

4. **Calculate area** to verify pricing tier:
   - Area = (lat_span) × (lon_span)
   - Keep under 25 sq deg for 1 credit pricing

---

## Additional Resources

- **Backend API Docs**: See `/api/v1/airspace` endpoint documentation
- **OpenSky Pricing**: See `BOUNDING_BOX_OPTIMIZATION.md`
- **Cache Strategy**: See `OPTIMIZATION_VERIFICATION.md`
- **Leaflet.js Docs**: https://leafletjs.com/reference.html#map-fitbounds

---

**Alignment verified:** 2025-12-28
**Status:** ✅ Frontend and backend perfectly synchronized
