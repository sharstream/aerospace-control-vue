# SkySentinel API Integration Guide

## OAuth2 Architecture Overview

### Backend Responsibilities (100% Automated)

The backend handles **all** OAuth2 authentication automatically:

1. **Token Storage**: Client ID and Secret stored in backend `.env` file
2. **Token Request**: Automatically requests OAuth2 tokens from OpenSky
3. **Token Refresh**: Refreshes tokens 5 minutes before expiration (25 min mark)
4. **Automatic Retry**: Retries API calls on 401 errors with fresh token (max 2 attempts)
5. **Rate Limit Tracking**: Extracts and returns rate limit info from all responses

**Backend Flow:**
```
┌─────────────────────────────────────────────────────┐
│ Frontend calls: /api/v1/airspace                    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Backend: fetch_opensky_api()                        │
│  ├─ Check if token is valid                         │
│  ├─ Refresh if expired (automatic)                  │
│  ├─ Add Authorization header                        │
│  └─ Make API call to OpenSky                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼ (If 401 error)
┌─────────────────────────────────────────────────────┐
│ Backend: oauth2_client.execute_with_retry()         │
│  ├─ Force token refresh                             │
│  ├─ Retry API call with new token                   │
│  └─ Return response or throw error                  │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│ Return GeoJSON + rate_limit info to frontend        │
└─────────────────────────────────────────────────────┘
```

### Frontend Responsibilities (Simple)

The frontend **does NOT** handle OAuth2 tokens. It only:

1. **Calls backend endpoints** (regular HTTP fetch)
2. **Extracts rate limit info** from responses
3. **Handles errors** (429, 503, connection errors)
4. **Displays info to user** (rate limits, errors, status)

**Frontend Flow:**
```javascript
// NO OAuth2 token management needed!
const response = await fetch('http://localhost:8000/api/v1/airspace?limit=50');
const data = await response.json();

// Rate limit info is automatically included
console.log(data.rate_limit.remaining); // "3999"
```

---

## API Error Handling

### Error Types from Backend

| Error Type | Status Code | Description | Action |
|------------|-------------|-------------|--------|
| `RATE_LIMIT` | 429 | API rate limit exceeded | Display countdown, wait for retry_after_seconds |
| `AUTHENTICATION_ERROR` | 401 | OAuth2 auth failed (backend issue) | Show error, backend should handle retry |
| `CONNECTION_ERROR` | N/A | Cannot connect to backend | Show "Backend offline" message |
| `EXTERNAL_SERVER_ERROR` | 503 | OpenSky API unavailable | Show "External service down" message |
| `SERVER_ERROR` | 500 | Internal backend error | Show generic error message |

### Error Response Format

All backend errors follow this format:

```json
{
  "error": "RATE_LIMIT",
  "detail": "Rate limit exceeded. Please wait before making more requests.",
  "message": "Rate limit exceeded. Please wait before making more requests.",
  "rate_limit": {
    "remaining": "0",
    "retry_after_seconds": 60
  }
}
```

---

## Updated API Functions

### 1. `fetchAirspaceData(limit)`

Fetches current airspace data with optional limit.

**Usage:**
```javascript
import { fetchAirspaceData } from '@/services/api';

try {
  const data = await fetchAirspaceData(50);

  console.log(data.metadata.total_aircraft); // 50
  console.log(data.rateLimit.remaining);     // "3999"
  console.log(data.features);                // GeoJSON features array
} catch (error) {
  console.error(error.errorType);            // "RATE_LIMIT"
  console.error(error.statusCode);           // 429
  console.error(error.rateLimit);            // { remaining: "0", retryAfterSeconds: 60 }
}
```

---

### 2. `fetchAirspaceRegion(bounds)`

Fetches aircraft within a bounding box.

**Usage:**
```javascript
import { fetchAirspaceRegion } from '@/services/api';

const bounds = {
  minLat: 40.0,
  maxLat: 41.0,
  minLon: -74.0,
  maxLon: -73.0
};

try {
  const data = await fetchAirspaceRegion(bounds);

  console.log(data.metadata.total_aircraft);      // 68
  console.log(data.metadata.bounding_box);        // { min_lat: 40.0, ... }
  console.log(data.rateLimit.remaining);          // "3998"
} catch (error) {
  console.error(error.message);
}
```

---

### 3. `fetchApiStatus()`

Fetches detailed backend and OpenSky API status with rate limits.

**Usage:**
```javascript
import { fetchApiStatus } from '@/services/api';

try {
  const status = await fetchApiStatus();

  console.log(status.backend.status);        // "OPERATIONAL"
  console.log(status.opensky.status);        // "OPERATIONAL"
  console.log(status.opensky.auth_mode);     // "oauth2"
  console.log(status.rateLimit.remaining);   // "3997"
} catch (error) {
  console.error(error.errorType);            // "CONNECTION_ERROR"
}
```

---

### 4. `fetchAircraftStates(icao24)`

Tracks specific aircraft by ICAO24 address(es).

**Usage:**
```javascript
import { fetchAircraftStates } from '@/services/api';

// Single aircraft
try {
  const data = await fetchAircraftStates('4b1815');

  console.log(data.metadata.found_aircraft);      // 1
  console.log(data.features[0].properties.callsign); // "SWR24C"
} catch (error) {
  console.error(error.message);
}

// Multiple aircraft
try {
  const data = await fetchAircraftStates(['4b1815', 'ac1c12']);

  console.log(data.metadata.requested_aircraft);  // ["4b1815", "ac1c12"]
  console.log(data.metadata.found_aircraft);      // 2
  console.log(data.rateLimit.remaining);          // "3996"
} catch (error) {
  console.error(error.message);
}
```

---

### 5. `checkApiHealth()`

Basic health check for backend connectivity.

**Usage:**
```javascript
import { checkApiHealth } from '@/services/api';

try {
  const health = await checkApiHealth();

  console.log(health.service);      // "SkySentinel API"
  console.log(health.status);       // "operational"
  console.log(health.version);      // "2.0.0"
  console.log(health.auth_mode);    // "oauth2"
} catch (error) {
  console.error(error.errorType);   // "CONNECTION_ERROR"
}
```

---

## Rate Limit Tracking

All successful responses include `rate_limit` information:

```json
{
  "type": "FeatureCollection",
  "features": [...],
  "metadata": {...},
  "rate_limit": {
    "remaining": "3999",
    "retry_after_seconds": null
  }
}
```

### Frontend Rate Limit Handling

```javascript
// In your Vue component or Pinia store
async function fetchData() {
  try {
    const data = await fetchAirspaceData(50);

    // Update rate limit in store
    this.rateLimitInfo = data.rateLimit;

    // Check if approaching limit
    if (parseInt(data.rateLimit.remaining) < 100) {
      console.warn('Approaching rate limit!');
    }

  } catch (error) {
    if (error.errorType === 'RATE_LIMIT') {
      // Start countdown timer
      this.countdownSeconds = error.rateLimit.retryAfterSeconds;
      this.startRateLimitCountdown();
    }
  }
}
```

---

## Common Questions

### Q: What if the OAuth2 token expires?

**A:** The backend automatically handles this! The `OpenSkyOAuth2Client` refreshes tokens 5 minutes before expiration. If a 401 error occurs, it automatically retries with a fresh token (up to 2 attempts).

**Frontend action required:** None. Just handle the error if all retries fail.

---

### Q: What if we get a 401 error on the frontend?

**A:** This means the backend couldn't authenticate even after retrying. This is rare and usually indicates:
- Invalid OAuth2 credentials in backend `.env`
- OpenSky authentication service is down
- Network issues between backend and OpenSky

**Frontend action:** Display error message: "Authentication error. Please contact support."

---

### Q: Do we need to pass tokens from frontend to backend?

**A:** No! The OAuth2 flow uses **Client Credentials Grant** (server-to-server). The frontend never sees or handles tokens.

---

### Q: How do we force a token refresh?

**A:** You don't need to! The backend handles this automatically. Tokens are refreshed:
1. Before expiration (5 min buffer)
2. On 401 errors (automatic retry)

---

### Q: What about rate limits?

**A:** Rate limits are tracked automatically:
- Backend extracts `X-Rate-Limit-Remaining` from OpenSky responses
- All endpoints return `rate_limit` object
- Frontend displays this info to users
- On 429 errors, backend returns `retry_after_seconds` for countdown

**OAuth2 advantage:** 10x rate limit upgrade (4000 vs 400 requests)

---

## Error Handling Best Practices

### 1. Always extract rate limit info

```javascript
try {
  const data = await fetchAirspaceData();

  // Store rate limit for display
  store.updateRateLimit(data.rateLimit);

} catch (error) {
  // Also check rate limit in error
  if (error.rateLimit) {
    store.updateRateLimit(error.rateLimit);
  }
}
```

### 2. Handle different error types

```javascript
catch (error) {
  switch (error.errorType) {
    case 'RATE_LIMIT':
      // Show countdown, disable polling
      store.startRateLimitCountdown(error.rateLimit.retryAfterSeconds);
      break;

    case 'CONNECTION_ERROR':
      // Show "Backend offline" message
      store.setApiStatus('disconnected');
      break;

    case 'EXTERNAL_SERVER_ERROR':
      // Show "OpenSky service down" message
      store.setApiStatus('error');
      break;

    default:
      // Generic error handling
      console.error('API error:', error.message);
  }
}
```

### 3. Graceful degradation

```javascript
// Retry with exponential backoff for connection errors
async function fetchWithRetry(retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchAirspaceData();
    } catch (error) {
      if (error.errorType === 'CONNECTION_ERROR' && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

---

## Summary

✅ **OAuth2 is fully handled by the backend** - no frontend token management needed
✅ **All endpoints return rate_limit info** - easy tracking and display
✅ **Automatic token refresh** - backend refreshes before expiration
✅ **Automatic retry on 401** - backend retries with fresh token
✅ **Unified error handling** - consistent error format across all endpoints
✅ **10x rate limit upgrade** - OAuth2 provides 4000 vs 400 anonymous requests

The frontend simply calls endpoints and handles responses - all authentication complexity is hidden!
