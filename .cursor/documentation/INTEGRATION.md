# SkySentinel Backend Integration Guide

This document explains how the Vue frontend integrates with the Python FastAPI backend to display real-time aircraft data from OpenSky Network.

## Architecture Overview

```
┌─────────────────────┐
│  OpenSky Network    │
│      (ADS-B Data)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  FastAPI Backend    │
│  (Python Middleware)│
│  Port: 8000         │
└──────────┬──────────┘
           │ GeoJSON
           ▼
┌─────────────────────┐
│  Vue Frontend       │
│  (Leaflet.js Map)   │
│  Port: 5173         │
└─────────────────────┘
```

## Backend API Endpoints

The backend provides two main endpoints:

### 1. Global Airspace Data
```
GET /api/v1/airspace?limit=50
```
Returns up to 50 aircraft from around the world.

**Response Format (GeoJSON):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      },
      "properties": {
        "icao24": "a12345",
        "callsign": "UAL123",
        "altitude": 10000,
        "velocity": 250,
        "heading": 45,
        "origin_country": "United States",
        "on_ground": false
      }
    }
  ],
  "metadata": {
    "total_aircraft": 50,
    "timestamp": 1703001234
  }
}
```

### 2. Regional Airspace Data
```
GET /api/v1/airspace/region?min_lat=37.0&max_lat=38.0&min_lon=-123.0&max_lon=-122.0
```
Returns aircraft within a specific bounding box.

## Frontend Integration Components

### 1. API Service (`src/services/api.js`)

Handles all communication with the backend:
- `fetchAirspaceData(limit)` - Fetches global aircraft data
- `fetchAirspaceRegion(bounds)` - Fetches regional aircraft data
- `checkApiHealth()` - Checks backend connectivity
- `transformAircraftData(geojson)` - Converts GeoJSON to frontend format

### 2. Flights Store (`src/stores/flights.js`)

Manages aircraft data state with Pinia:
- **State:**
  - `useRealData` - Toggle between real and mock data
  - `apiStatus` - Backend connection status
  - `flights` - Current aircraft list
  - `lastUpdate` - Timestamp of last data fetch

- **Actions:**
  - `toggleDataSource()` - Switch between real-time and demo data
  - `fetchRealTimeData()` - Fetch fresh data from backend
  - `checkApiConnection()` - Verify backend is online

### 3. Settings UI (`src/modules/settings/SettingsModule.vue`)

Provides user interface for:
- Viewing backend connection status
- Toggling between real-time and demo data
- Monitoring last update timestamp

## Setup Instructions

### 1. Start the Backend

Navigate to the backend directory and start the FastAPI server:

```bash
cd /Users/dperezalvarez/Documents/pocs/skysentinel-backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verify it's running by visiting: http://localhost:8000

### 2. Configure Frontend Environment

The frontend is already configured to connect to `http://localhost:8000` by default.

To change the backend URL, edit `.env`:

```bash
VITE_API_BASE_URL=http://your-backend-url:8000
```

### 3. Start the Frontend

```bash
cd /Users/dperezalvarez/Documents/pocs/aerospace-control-vue
npm install
npm run dev
```

The app will be available at: http://localhost:5173

### 4. Enable Real-Time Data

1. Open the application in your browser
2. Navigate to the **Settings** page (bottom navigation)
3. Scroll to the **Data Source** section
4. Toggle the switch from "Demo Data" to "Real-Time Data"
5. The status should change to "Connected" (green)
6. Navigate to the **Map** view to see live aircraft

## Data Flow

1. **User toggles real-time data** → Settings UI calls `flightsStore.toggleDataSource()`
2. **Store checks backend health** → `checkApiConnection()` verifies backend is online
3. **Initial fetch** → `fetchRealTimeData()` gets first batch of aircraft
4. **Data transformation** → API service converts GeoJSON to Vue-compatible format
5. **Auto-refresh** → Timer fetches new data every 10 seconds
6. **Map updates** → MapModule watches `flights` and updates markers

## Data Transformation

The backend returns raw OpenSky data in GeoJSON format. The frontend transforms it to match the existing UI structure:

**Backend (GeoJSON):**
```json
{
  "icao24": "a12345",
  "callsign": "UAL123",
  "altitude": 10000
}
```

**Frontend (Transformed):**
```javascript
{
  id: "a12345-0",
  name: "UAL123",
  airline: "UA",
  altitude: "10000m",
  velocity: "250 m/s",
  heading: "45°",
  path: [[lat1, lon1], [lat2, lon2]],
  progress: 0.15
}
```

## Refresh Rate

- **Real-time data:** Refreshes every 10 seconds
- **Animation:** Map updates aircraft positions every 50ms for smooth movement

## Error Handling

The integration includes comprehensive error handling:

1. **Connection Failure:** Falls back to demo data, shows error message
2. **API Timeout:** Retains last known positions
3. **Invalid Data:** Filters out aircraft with missing coordinates
4. **CORS Issues:** Backend has CORS enabled for all origins

## Testing the Integration

### Manual Testing Checklist

1. ✅ Backend starts without errors
2. ✅ Health check endpoint responds: http://localhost:8000
3. ✅ Frontend loads successfully
4. ✅ Settings page shows "Disconnected" status initially
5. ✅ Toggle switch enables real-time data
6. ✅ Status changes to "Connected" (green)
7. ✅ Map displays aircraft markers
8. ✅ Aircraft positions update every 10 seconds
9. ✅ Clicking aircraft shows popup with details
10. ✅ Toggling back to demo data restores mock flights

### Debug Tips

**If backend won't start:**
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process if needed
kill -9 <PID>
```

**If frontend can't connect:**
1. Check browser console for CORS errors
2. Verify backend URL in `.env` file
3. Test backend directly: `curl http://localhost:8000/api/v1/airspace`

**If no aircraft appear:**
1. Check backend logs for OpenSky API rate limiting
2. Verify data transformation in browser DevTools
3. Check that flights array isn't empty in Vue DevTools

## Performance Considerations

- **Rate Limiting:** OpenSky Network limits anonymous users to 100 requests/day
- **Data Limit:** Frontend fetches max 50 aircraft to reduce load
- **Caching:** Backend could implement caching to reduce API calls
- **Regional Queries:** Use bounding box endpoint for better performance

## Future Enhancements

1. **Authenticated Requests:** Add OpenSky credentials for higher rate limits
2. **Regional Filtering:** Implement map-based bounding box queries
3. **WebSocket Support:** Real-time streaming instead of polling
4. **Aircraft History:** Track flight paths over time
5. **AI Analysis:** Integrate Gemini for anomaly detection
6. **Offline Mode:** Service worker for offline functionality

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to SkySentinel API" | Ensure backend is running on port 8000 |
| CORS errors | Backend CORS is enabled; check browser console |
| No aircraft data | OpenSky may be rate-limiting; wait or add credentials |
| Stale data | Check auto-refresh timer in store |
| Aircraft not animating | Verify map component is watching flights |

## API Reference

For detailed backend API documentation, visit: http://localhost:8000/docs (when backend is running)
