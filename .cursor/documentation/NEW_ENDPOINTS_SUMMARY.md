# New Trajectory Tracking Endpoints - Summary

**Date:** 2025-12-28
**Status:** ✅ Implemented, ⚠️ Requires OpenSky Permissions

---

## What Was Added

### 1. Aircraft Track/Trajectory Endpoint
**Path:** `GET /api/v1/tracks/{icao24}?time={timestamp}`

**Purpose:** Retrieve complete flight path for a specific aircraft including:
- All waypoints with coordinates
- Altitude and heading at each point
- Takeoff and landing points
- Complete trajectory as GeoJSON LineString

**Example:**
```bash
curl "http://localhost:8000/api/v1/tracks/aae316"
```

---

### 2. Flights by Time Interval Endpoint
**Path:** `GET /api/v1/flights/all?begin={begin}&end={end}`

**Purpose:** Get list of all flights in a time window (max 2 hours) including:
- Departure and arrival airports
- Flight times
- Aircraft identifiers
- Can be used to find timestamps for track queries

**Example:**
```bash
# Get flights from the last hour
curl "http://localhost:8000/api/v1/flights/all?begin=1766974594&end=1766978194"
```

---

## Current Status: Permission Denied

### ❌ Problem

Both endpoints return **403 Forbidden** because they require **special OpenSky permissions**:

```json
{
  "error": "CONNECTION_ERROR",
  "detail": "Failed to communicate with OpenSky API (HTTP 403)"
}
```

### 🔐 What's Needed

Your current **OAuth2 Client Credentials** provide:
- ✅ Real-time aircraft states
- ✅ 4,000 credits/day
- ❌ Historical tracks (403 Forbidden)
- ❌ Flights data (403 Forbidden)

To access tracks and flights, you need **OpenSky Contributor** or **Researcher** access:

| Access Level | Tracks | Flights | How to Get |
|--------------|--------|---------|------------|
| Anonymous | ❌ | ❌ | Default |
| OAuth2 Client | ❌ | ❌ | ← You are here |
| **Contributor** | ✅ | ✅ | Feed ADS-B data |
| **Researcher** | ✅ | ✅ | Academic application |

---

## Solutions

### Option 1: Real-Time Trajectory Building (Recommended Now)

**Use existing endpoints** to build trajectories in real-time:

1. Poll `GET /api/v1/states/aircraft?icao24={icao24}` every 45 seconds
2. Store positions in frontend
3. Draw trajectory from collected points

**Pros:**
- ✅ Works immediately with current credentials
- ✅ No additional permissions needed
- ✅ Real-time tracking

**Cons:**
- ❌ No historical data before tracking started
- ❌ Requires continuous polling

---

### Option 2: Upgrade to Contributor Access (Hardware Required)

**Steps:**
1. Buy RTL-SDR dongle + antenna (~$50 total)
2. Install ADS-B receiver software
3. Feed data to OpenSky Network
4. Automatically get contributor access

**Timeline:** 1-2 weeks setup
**Cost:** $50 one-time hardware

---

### Option 3: Apply for Researcher Access (Academic/Research)

**Steps:**
1. Visit https://opensky-network.org/data/impala
2. Submit research proposal
3. Explain use case
4. Wait for approval

**Timeline:** 1-4 weeks
**Cost:** Free

---

## What Works Right Now

### ✅ Available Endpoints (No Extra Permissions Needed)

| Endpoint | Status | Cost |
|----------|--------|------|
| `GET /api/v1/airspace` | ✅ Working | 1 credit |
| `GET /api/v1/airspace/region` | ✅ Working | 1 credit |
| `GET /api/v1/states/aircraft` | ✅ Working | 1 credit |
| `GET /api/v1/status` | ✅ Working | 0 credits |

### ⚠️ Requires Additional Permissions

| Endpoint | Status | Required Access |
|----------|--------|-----------------|
| `GET /api/v1/tracks/{icao24}` | ⚠️ 403 Forbidden | Contributor/Researcher |
| `GET /api/v1/flights/all` | ⚠️ 403 Forbidden | Contributor/Researcher |

---

## Recommended Next Steps

### Immediate (Today)
1. ✅ Continue using real-time endpoints
2. ✅ Implement frontend trajectory builder
3. ✅ Store positions over time

### Short-Term (This Week)
1. Apply for OpenSky researcher access
2. Research ADS-B receiver options
3. Evaluate alternative APIs (FlightAware, ADS-B Exchange)

### Long-Term (This Month)
1. Wait for researcher access approval
2. Consider purchasing ADS-B hardware
3. Test track/flights endpoints once access granted

---

## Code Status

### Backend
- ✅ Endpoints implemented in `app/main.py`
- ✅ Error handling added
- ✅ Documentation complete
- ✅ Syntax validated
- ⚠️ Waiting for permissions to test

### Frontend
- ⏳ Not yet implemented (waiting for backend access)
- 📝 API service functions documented in `TRAJECTORY_TRACKING_API.md`
- 📝 Alternative approach (real-time tracking) documented

---

## Files Modified/Created

### Backend
- **Modified:** `/app/main.py`
  - Added `GET /api/v1/tracks/{icao24}` endpoint
  - Added `GET /api/v1/flights/all` endpoint
  - Added permission warnings in docstrings

### Documentation
- **Created:** `TRAJECTORY_TRACKING_API.md` (comprehensive guide)
- **Created:** `NEW_ENDPOINTS_SUMMARY.md` (this file)

---

## Quick Test Commands

### Test Current Working Endpoints
```bash
# Get current aircraft
curl "http://localhost:8000/api/v1/airspace?limit=5"

# Get specific aircraft state
curl "http://localhost:8000/api/v1/states/aircraft?icao24=aae316"
```

### Test New Endpoints (Currently Returns 403)
```bash
# Try to get aircraft track
curl "http://localhost:8000/api/v1/tracks/aae316"
# Expected: 403 Forbidden

# Try to get flights
curl "http://localhost:8000/api/v1/flights/all?begin=1766974594&end=1766978194"
# Expected: 403 Forbidden
```

---

## Summary

**What was delivered:**
- ✅ Two new endpoints for trajectory and flights tracking
- ✅ Complete implementation with error handling
- ✅ GeoJSON format for trajectory data
- ✅ Comprehensive documentation
- ✅ Alternative approaches documented

**What's blocking:**
- ⚠️ OpenSky permission level insufficient
- ⚠️ Requires Contributor or Researcher access
- ⚠️ Current OAuth2 credentials return 403

**Recommended action:**
- Apply for OpenSky researcher access (free, 1-4 weeks)
- OR use real-time tracking approach (works now)
- OR purchase ADS-B hardware to become contributor

---

**Implementation Complete:** Yes ✅
**Functional:** Partially (permission pending) ⚠️
**Documentation:** Complete ✅
**Ready for Use:** Once OpenSky permissions upgraded 🔐
