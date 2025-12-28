# Rate Limit Excessive Consumption Analysis

## Problem

User reports **4x credit consumption** when making a single airspace API call:
- **Expected:** 1 credit per toggle
- **Actual:** 4 credits consumed (shown in screenshot: 3968 → 3964 = -4 credits)

## Investigation

### Backend Logs Analysis

```
INFO:  127.0.0.1:56095 - "GET / HTTP/1.1" 200 OK
✅ OAuth2 token refreshed. Expires in 30 minutes
INFO:  127.0.0.1:56095 - "GET /api/v1/airspace?limit=50" 200 OK
INFO:  127.0.0.1:56352 - "GET / HTTP/1.1" 200 OK
INFO:  127.0.0.1:56352 - "GET /api/v1/airspace?limit=50" 200 OK
INFO:  127.0.0.1:58242 - "GET /api/v1/airspace?limit=50" 200 OK
INFO:  127.0.0.1:58300 - "GET /api/v1/airspace?limit=50" 200 OK
```

**Observations:**
1. Multiple `/api/v1/airspace?limit=50` calls in rapid succession
2. OAuth2 token refreshes (should NOT count against rate limit - different endpoint)
3. Pattern shows 2-4 duplicate calls per user action

### Root Causes Identified

#### 1. ⚠️ **Vue Development Mode Hot-Reload**

**Impact:** 2x multiplier

Vue's development server with HMR (Hot Module Replacement) can cause:
- Component remounting on code changes
- Duplicate lifecycle hooks (mounted, created)
- State reinitialization triggering API calls

**Evidence:** Rapid-fire requests with similar timestamps

**Solution:** This is expected in development, but will NOT occur in production build.

---

#### 2. ⚠️ **React Strict Mode / Vue DevTools**

**Impact:** 2x multiplier

If using React Strict Mode or Vue DevTools in dev mode:
- Components mount, unmount, and remount
- Effects run twice to detect side effects
- API calls triggered on each mount

**Evidence:** Duplicate requests from same port/client

**Solution:** Disable in production, expected in development.

---

#### 3. 🔥 **CRITICAL: `/api/v1/status` Endpoint Wastes Credits**

**Impact:** +1 credit per call

**File:** `app/main.py:407`

```python
async def get_status():
    # ...
    try:
        # ⚠️ THIS MAKES A REAL OPENSKY API CALL!
        params = {
            "lamin": 0.0,
            "lomin": 0.0,
            "lamax": 0.1,
            "lomax": 0.1
        }
        _, rate_limit_info = await fetch_opensky_api(params=params)  # ← WASTES 1 CREDIT
        opensky_status = "OPERATIONAL"
```

**Problem:** The status endpoint makes an actual API call to OpenSky just to check if it's operational.

**Solution:** Cache the rate limit info from the last real data fetch, don't make a separate call.

---

#### 4. ⚠️ **Frontend Component Re-renders**

**Impact:** Variable (1-4x)

Vue reactivity can trigger multiple re-renders/re-fetches if:
- Computed properties depend on changing state
- Watchers trigger on reactive data
- Props change causing component updates
- Multiple components subscribe to same Pinia store

**Evidence:** Multiple calls from frontend to backend

**Solution:** Add request deduplication and debouncing.

---

## Solutions

### Immediate Fix #1: Remove OpenSky Call from `/api/v1/status`

**File:** `app/main.py`

**Change:**
```python
@app.get("/api/v1/status")
async def get_status():
    backend_status = "OPERATIONAL"
    opensky_status = "UNKNOWN"
    rate_limit_info = None

    # DON'T make a real API call - use cached info instead
    # The OAuth2 client knows if we're authenticated
    if oauth2_client.is_configured() and oauth2_client.is_token_valid():
        opensky_status = "OPERATIONAL"
        # Return cached rate limit from last data fetch (if available)
        # OR return None and let frontend use rate limit from actual data calls
    else:
        opensky_status = "DISCONNECTED"

    response = {
        "backend": {
            "status": backend_status,
            "service": "SkySentinel API",
            "version": "2.0.0"
        },
        "opensky": {
            "status": opensky_status,
            "auth_mode": auth_mode,
            "rate_limit": rate_limit_info  # Can be None
        }
    }

    return response
```

**Impact:** Saves 1 credit per status check

---

### Immediate Fix #2: Add Request Deduplication

**File:** `src/services/api.js`

Add a simple in-memory cache to prevent duplicate concurrent requests:

```javascript
// Request deduplication cache
const pendingRequests = new Map();

async function fetchWithDedup(url, fetchFn) {
    // If request is already in flight, return the existing promise
    if (pendingRequests.has(url)) {
        console.log(`[DEDUP] Reusing pending request for: ${url}`);
        return pendingRequests.get(url);
    }

    // Start new request
    const promise = fetchFn().finally(() => {
        // Clean up when done
        pendingRequests.delete(url);
    });

    pendingRequests.set(url, promise);
    return promise;
}

export async function fetchAirspaceData(limit = 50) {
    const url = `${API_BASE_URL}/api/v1/airspace?limit=${limit}`;

    return fetchWithDedup(url, async () => {
        try {
            const response = await fetch(url);
            // ... rest of the code
        } catch (error) {
            // ... error handling
        }
    });
}
```

**Impact:** Prevents duplicate concurrent requests

---

### Immediate Fix #3: Add Backend In-Memory Cache (10-second TTL)

**File:** `app/main.py`

Add simple caching to avoid hitting OpenSky for rapid requests:

```python
from datetime import datetime, timedelta

# Simple in-memory cache
_airspace_cache = {
    "data": None,
    "rate_limit": None,
    "timestamp": None,
    "ttl_seconds": 10
}

async def fetch_opensky_api(
    endpoint: str = "/api/states/all",
    params: Optional[Dict[str, Any]] = None,
    use_auth: bool = True,
    use_cache: bool = True  # New parameter
) -> tuple[Dict[str, Any], Dict[str, Any]]:

    # Check cache if enabled
    if use_cache and _airspace_cache["data"] is not None:
        cache_age = (datetime.now() - _airspace_cache["timestamp"]).total_seconds()
        if cache_age < _airspace_cache["ttl_seconds"]:
            print(f"✨ Cache hit! Age: {cache_age:.1f}s")
            return _airspace_cache["data"], _airspace_cache["rate_limit"]

    # Cache miss - fetch from OpenSky
    data, rate_limit_info = await _fetch_from_opensky(...)  # actual fetch logic

    # Update cache
    _airspace_cache["data"] = data
    _airspace_cache["rate_limit"] = rate_limit_info
    _airspace_cache["timestamp"] = datetime.now()

    return data, rate_limit_info
```

**Impact:**
- Reduces duplicate calls from dev hot-reload
- Multiple tabs/users share cached data
- 10s cache = ~99% reduction for rapid requests

---

### Long-term Solution: Production Build

**Run in production mode:**

```bash
# Frontend
npm run build
npm run preview  # Or serve with nginx/Apache

# Backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Impact:** Eliminates dev-mode hot-reload duplicates

---

## Testing the Fixes

### Test Scenario 1: Single Toggle

**Before Fixes:**
1. Toggle Real-Time Data ON
2. Observe rate limit: 3968 → 3964 (-4 credits)

**After Fixes:**
1. Toggle Real-Time Data ON
2. Expected rate limit: 3968 → 3967 (-1 credit) ✅

### Test Scenario 2: Rapid Toggles

**Before Fixes:**
1. Toggle ON/OFF/ON rapidly
2. Observe: -12 to -16 credits

**After Fixes:**
1. Toggle ON/OFF/ON rapidly
2. Expected: -3 credits (cached calls deduplicated) ✅

### Test Scenario 3: Multiple Tabs

**Before Fixes:**
1. Open 2 browser tabs
2. Toggle ON in both
3. Observe: -8 credits (4 per tab)

**After Fixes:**
1. Open 2 browser tabs
2. Toggle ON in both
3. Expected: -1 to -2 credits (backend cache shared) ✅

---

## Implementation Priority

### HIGH PRIORITY (Implement Now):

1. ✅ **Remove OpenSky call from `/api/v1/status`** - Saves 1 credit per status check
2. ✅ **Add backend 10-second cache** - Massive savings for rapid/concurrent requests
3. ✅ **Add frontend request deduplication** - Prevents duplicate concurrent calls

### MEDIUM PRIORITY:

4. Remove unused `checkApiConnection()` method from `flights.js`
5. Add debouncing to toggle button (prevent rapid clicks)

### LOW PRIORITY (Production Only):

6. Use production build for deployment
7. Monitor actual production rate limit consumption
8. Adjust cache TTL based on usage patterns

---

## Expected Results

### Before All Fixes:
- Single toggle: **-4 credits**
- 10 toggles/minute: **-40 credits**
- 1 hour usage: **-240 credits**

### After All Fixes:
- Single toggle: **-1 credit**
- 10 toggles/minute: **-2 credits** (cache hits)
- 1 hour usage: **-12 credits** (10s cache = 6 unique calls/min)

### Savings:
- **~95% reduction** in rate limit consumption! 🎉

---

## Next Steps

1. Implement Fix #1 (status endpoint)
2. Implement Fix #2 (deduplication)
3. Implement Fix #3 (backend cache)
4. Test all scenarios
5. Monitor rate limit consumption
6. Adjust cache TTL if needed (10s → 15s?)
