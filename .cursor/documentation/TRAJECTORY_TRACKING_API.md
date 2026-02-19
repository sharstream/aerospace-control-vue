# Aircraft Trajectory Tracking API

**Date:** 2025-12-28
**Status:** ⚠️ Partially Implemented (Permission Issues)

---

## Overview

This document describes the aircraft trajectory and flight tracking endpoints added to the SkySentinel API, based on OpenSky Network's historical data endpoints.

---

## New Endpoints

### 1. GET /api/v1/tracks/{icao24}

**Purpose:** Retrieve complete trajectory/track data for a specific aircraft

**Endpoint:** `GET /api/v1/tracks/{icao24}?time={timestamp}`

**Parameters:**
- `icao24` (path parameter, required): ICAO24 address of aircraft (e.g., "aae316")
- `time` (query parameter, optional): Unix timestamp in seconds. Defaults to current time if omitted.

**Response Format:**
```json
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [[lon, lat, alt], [lon, lat, alt], ...]
  },
  "properties": {
    "icao24": "aae316",
    "callsign": "AAL2693",
    "start_time": 1766974594,
    "end_time": 1766978194,
    "waypoint_count": 150,
    "ground_segments": 2
  },
  "waypoints": [
    {
      "time": 1766974594,
      "latitude": 33.6407,
      "longitude": -84.4277,
      "altitude": 1000,
      "heading": 270,
      "on_ground": false
    }
  ],
  "ground_state_changes": [
    {
      "index": 0,
      "time": 1766974594,
      "position": [33.6407, -84.4277]
    }
  ],
  "metadata": {
    "first_position": { ... },
    "last_position": { ... },
    "duration_seconds": 3600
  },
  "rate_limit": {
    "remaining": "3928",
    "retry_after_seconds": null
  }
}
```

**Features:**
- Complete flight path as GeoJSON LineString
- All waypoints with timestamp, position, altitude, heading
- Ground state change tracking (takeoff/landing points)
- First and last position metadata
- Flight duration calculation

---

### 2. GET /api/v1/flights/all

**Purpose:** Retrieve all flights for a specific time interval

**Endpoint:** `GET /api/v1/flights/all?begin={begin}&end={end}`

**Parameters:**
- `begin` (query parameter, required): Start time as Unix timestamp in seconds
- `end` (query parameter, required): End time as Unix timestamp in seconds
- **Maximum interval:** 2 hours (7200 seconds)

**Response Format:**
```json
{
  "flights": [
    {
      "icao24": "aae316",
      "callsign": "AAL2693",
      "departure_airport": "KATL",
      "arrival_airport": "KDFW",
      "departure_time": 1766974594,
      "arrival_time": 1766978194,
      "departure_horizontal_distance": 0,
      "departure_vertical_distance": 0,
      "arrival_horizontal_distance": 0,
      "arrival_vertical_distance": 0
    }
  ],
  "metadata": {
    "begin": 1766974594,
    "end": 1766978194,
    "interval_seconds": 3600,
    "total_flights": 25
  },
  "rate_limit": {
    "remaining": "3927",
    "retry_after_seconds": null
  }
}
```

**Features:**
- List of all flights in time window
- Departure and arrival airport codes (ICAO format)
- Flight start/end times
- Distance metrics from airports

**Validation:**
- Rejects time intervals > 2 hours (7200 seconds)
- Returns 400 Bad Request with error details

---

## ⚠️ Permission Requirements

### Current Status: 403 Forbidden

Both endpoints are currently **not accessible** with standard OpenSky OAuth2 authentication. They return:

```json
{
  "error": "CONNECTION_ERROR",
  "detail": "Failed to communicate with OpenSky API (HTTP 403)",
  "message": "Failed to communicate with OpenSky API (HTTP 403)"
}
```

### Why 403 Forbidden?

According to OpenSky Network documentation, historical data endpoints (tracks and flights) require **higher access levels**:

1. **Anonymous Access:** ❌ Not permitted
2. **Basic OAuth2 (Client Credentials):** ❌ Not permitted (our current level)
3. **OpenSky Contributor Access:** ✅ Required
4. **OpenSky Researcher Access:** ✅ Required

### Access Levels Explained

| Level | How to Get | Features | Cost |
|-------|-----------|----------|------|
| Anonymous | Default | Current states only | Free, limited |
| OAuth2 Client | Register app | Current states, 4000 credits/day | Free |
| Contributor | Provide ADS-B data | Historical data, tracks, flights | Free |
| Researcher | Academic/research application | Full API access, unlimited | Free |

### How to Upgrade Access

**Option 1: Become an OpenSky Contributor**
- Install an ADS-B receiver (RTL-SDR, FlightAware, etc.)
- Feed live aircraft data to OpenSky Network
- Requires hardware (~$30-200) and installation
- Documentation: https://opensky-network.org/community/projects/30-dump1090-feeder

**Option 2: Apply for Researcher Access**
- Submit academic or research proposal
- Explain use case and research goals
- Requires institutional affiliation or legitimate research purpose
- Apply: https://opensky-network.org/data/impala

**Option 3: Use Alternative Approaches (see below)**

---

## Alternative Approaches for Trajectory Tracking

Since historical tracks are not accessible with our current permissions, here are alternative approaches:

### Approach 1: Real-Time Position Tracking (Current States)

**Use existing endpoint:** `GET /api/v1/states/aircraft?icao24={icao24}`

**How it works:**
1. Poll this endpoint every 45 seconds (cache TTL)
2. Store positions in frontend/database
3. Build trajectory over time from collected data points

**Pros:**
- ✅ Works with current OAuth2 credentials
- ✅ No additional permissions needed
- ✅ Real-time tracking

**Cons:**
- ❌ No historical data (only current position)
- ❌ Requires continuous polling
- ❌ Gaps if not monitoring 24/7

**Implementation:**
```javascript
// Frontend: Build trajectory from real-time data
let trajectory = [];

async function trackAircraft(icao24) {
  setInterval(async () => {
    const response = await fetch(`/api/v1/states/aircraft?icao24=${icao24}`);
    const data = await response.json();

    if (data.features.length > 0) {
      const position = data.features[0].geometry.coordinates;
      const props = data.features[0].properties;

      trajectory.push({
        time: Date.now(),
        position: position,
        altitude: props.altitude,
        heading: props.heading
      });
    }
  }, 45000); // Every 45 seconds (cache TTL)
}
```

---

### Approach 2: FlightAware API (Commercial Alternative)

**Service:** FlightAware Firehose / AeroAPI

**Features:**
- ✅ Historical flight tracks
- ✅ Complete waypoint data
- ✅ No hardware required
- ❌ Paid service ($$$)

**Pricing:**
- Free tier: 500 API calls/month
- Personal: $49/month
- Business: $199/month

**Website:** https://www.flightaware.com/commercial/aeroapi/

---

### Approach 3: ADS-B Exchange API (Community Alternative)

**Service:** ADS-B Exchange RapidAPI

**Features:**
- ✅ Real-time global aircraft data
- ✅ Historical data access
- ✅ No contributor requirement
- ❌ Paid tiers for full access

**Pricing:**
- Free tier: Limited calls
- Basic: $10/month
- Pro: $50/month

**Website:** https://rapidapi.com/adsbx/api/adsbexchange-com1

---

### Approach 4: Build Your Own ADS-B Receiver

**Hardware Required:**
- RTL-SDR dongle ($30)
- Antenna ($20-50)
- Raspberry Pi (optional, $35-75)

**Benefits:**
- ✅ Unlimited local tracking
- ✅ Contribution to OpenSky = researcher access
- ✅ Own the data

**Drawbacks:**
- ❌ Initial investment
- ❌ Technical setup required
- ❌ Only tracks aircraft in local range (100-300 miles)

**Guide:** https://flightaware.com/adsb/piaware/build

---

## Recommended Solution for SkySentinel

### Short-Term: Real-Time Tracking Only

Continue using current state endpoints and build trajectories in real-time:

```python
# Backend: No changes needed, use existing /api/v1/states/aircraft
```

```javascript
// Frontend: Implement trajectory builder
class TrajectoryTracker {
  constructor() {
    this.trajectories = new Map(); // icao24 -> array of positions
  }

  addPosition(icao24, position, metadata) {
    if (!this.trajectories.has(icao24)) {
      this.trajectories.set(icao24, []);
    }

    this.trajectories.get(icao24).push({
      time: Date.now(),
      position: position,
      altitude: metadata.altitude,
      heading: metadata.heading,
      velocity: metadata.velocity
    });
  }

  getTrajectory(icao24) {
    return this.trajectories.get(icao24) || [];
  }

  exportAsGeoJSON(icao24) {
    const points = this.getTrajectory(icao24);
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: points.map(p => p.position)
      },
      properties: {
        icao24: icao24,
        waypoint_count: points.length,
        duration: points[points.length-1].time - points[0].time
      }
    };
  }
}
```

---

### Long-Term: Upgrade to Contributor/Researcher

1. **Apply for OpenSky researcher access**
   - Submit research proposal
   - Explain educational/research use case
   - Wait for approval (typically 1-4 weeks)

2. **Or set up ADS-B receiver**
   - Purchase RTL-SDR and antenna
   - Install dump1090-fa or similar software
   - Feed data to OpenSky Network
   - Automatically upgrade to contributor access

---

## Testing Status

### Endpoint Status Summary

| Endpoint | Implemented | Tested | Status |
|----------|-------------|--------|--------|
| `GET /api/v1/tracks/{icao24}` | ✅ Yes | ⚠️ 403 Forbidden | Requires permissions |
| `GET /api/v1/flights/all` | ✅ Yes | ⚠️ 403 Forbidden | Requires permissions |

### Test Results

**Track Endpoint Test:**
```bash
curl "http://localhost:8000/api/v1/tracks/aae316"

Response:
{
  "error": "CONNECTION_ERROR",
  "detail": "Failed to communicate with OpenSky API (HTTP 403)",
  "message": "Failed to communicate with OpenSky API (HTTP 403)"
}
```

**Flights Endpoint Test:**
```bash
curl "http://localhost:8000/api/v1/flights/all?begin=1766974594&end=1766978194"

Response:
{
  "error": "CONNECTION_ERROR",
  "detail": "Failed to communicate with OpenSky API (HTTP 403)",
  "message": "Failed to communicate with OpenSky API (HTTP 403)"
}
```

---

## Frontend Integration (Future)

Once access is granted, add these functions to `src/services/api.js`:

```javascript
/**
 * Fetches aircraft trajectory/track by ICAO24
 * @param {string} icao24 - ICAO24 address
 * @param {number} time - Unix timestamp (optional)
 * @returns {Promise<Object>} Track data with waypoints
 */
export async function fetchAircraftTrack(icao24, time = null) {
  const url = time
    ? `${API_BASE_URL}/api/v1/tracks/${icao24}?time=${time}`
    : `${API_BASE_URL}/api/v1/tracks/${icao24}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw await handleApiError(response, 'Failed to fetch aircraft track');
  }

  return await response.json();
}

/**
 * Fetches all flights for a time interval
 * @param {number} begin - Start Unix timestamp
 * @param {number} end - End Unix timestamp (max 2 hours from begin)
 * @returns {Promise<Object>} List of flights
 */
export async function fetchFlights(begin, end) {
  const url = `${API_BASE_URL}/api/v1/flights/all?begin=${begin}&end=${end}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw await handleApiError(response, 'Failed to fetch flights');
  }

  return await response.json();
}
```

---

## Credit Costs

Once access is granted, these endpoints will consume credits:

| Endpoint | Cost per Request | Cache |
|----------|------------------|-------|
| `/api/v1/tracks/{icao24}` | 1 credit | ❌ No (historical data) |
| `/api/v1/flights/all` | 1 credit | ❌ No (historical data) |

**Note:** Historical endpoints are NOT cached because they return time-specific data that shouldn't be reused across different time parameters.

---

## Next Steps

1. **Immediate:** Use real-time tracking with existing endpoints
2. **Week 1:** Implement frontend trajectory builder
3. **Week 2-4:** Apply for OpenSky researcher access
4. **Month 1-2:** Consider ADS-B receiver setup (optional)
5. **Future:** Integrate track/flights endpoints once access granted

---

## Resources

- **OpenSky API Documentation:** https://openskynetwork.github.io/opensky-api/
- **OpenSky Access Levels:** https://opensky-network.org/about/api
- **Become a Contributor:** https://opensky-network.org/contribute
- **Researcher Access Application:** https://opensky-network.org/data/impala
- **ADS-B Receiver Guide:** https://flightaware.com/adsb/piaware/build

---

**Status:** Endpoints implemented but awaiting OpenSky permissions upgrade
**Last Updated:** 2025-12-28
