# Bounding Box Optimization - 75% Credit Reduction

## Root Cause Discovered

**OpenSky API charges by area square degrees**, NOT by number of results!

### Credit Calculation Table:

| Area Square Deg | Credits | Example |
|-----------------|---------|---------|
| **0 - 25** (<500x500km) | **1** | Regional area |
| 25 - 100 (<1000x1000km) | 2 | Large region |
| 100 - 400 (<2000x2000km) | 3 | Multiple states |
| **>400 or no bbox** | **4** | **Global (what we were doing!)** |

## The Problem

**Before (Global Query):**
```python
# No bounding box = ALL global aircraft
await fetch_opensky_api()  # 4 CREDITS per request!
```

**With 4000 daily OAuth2 limit:**
- 80 requests/hour (with 45s cache) × 4 credits = **320 credits/hour**
- 8 hours active = **2,560 credits/day** ❌
- **Exhausts limit in 1.5 days!**

---

## The Solution: Atlanta Metro Bounding Box

### Geographic Coverage

**Key Locations:**
- **East Point:** 33.6809°N, -84.4399°W
- **Downtown Atlanta:** 33.7490°N, -84.3880°W
- **College Park:** 33.6534°N, -84.4494°W
- **Hartsfield-Jackson Airport:** 33.6407°N, -84.4277°W
- **Stockbridge:** 33.5443°N, -84.2344°W

### Calculated Bounding Box

```python
DEFAULT_BBOX = {
    "lamin": 33.54,   # South - Stockbridge
    "lamax": 33.75,   # North - Downtown Atlanta
    "lomin": -84.45,  # West - College Park
    "lomax": -84.23   # East - Stockbridge
}
```

### Math Breakdown

**Latitude Range:**
- Max - Min = 33.75 - 33.54 = **0.21 degrees**

**Longitude Range:**
- Max - Min = (-84.23) - (-84.45) = **0.22 degrees**

**Area Calculation:**
- Area = Latitude × Longitude
- Area = 0.21 × 0.22 = **0.0462 square degrees**

**Credit Cost:**
- 0.0462 sq deg << 25 sq deg threshold
- **Cost: 1 CREDIT per request** ✅

---

## Impact Analysis

### Before Optimization:

```
Request: /api/v1/airspace
Bounding Box: None (global)
Area: >400 sq deg
Credits: 4 per request
Hourly: 80 requests × 4 = 320 credits
Daily (8h): 2,560 credits
Limit exhaustion: 1.5 days
```

### After Optimization:

```
Request: /api/v1/airspace
Bounding Box: Atlanta Metro
Area: 0.046 sq deg
Credits: 1 per request
Hourly: 80 requests × 1 = 80 credits
Daily (8h): 640 credits
Limit exhaustion: 6+ days
```

### Savings Summary:

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Credits per request | 4 | 1 | **75%** ✅ |
| Credits per hour | 320 | 80 | **75%** ✅ |
| Credits per day (8h) | 2,560 | 640 | **75%** ✅ |
| Days until limit | 1.5 | 6+ | **4x longer** ✅ |

---

## Coverage Area

### Visual Map

```
        -84.45°W          -84.23°W
         (West)            (East)
            │                │
33.75°N  ───┼────────────────┼───  (North - Downtown Atlanta)
  (Max)     │                │
            │   ┌──────┐     │
            │   │ ATL  │     │     ATL = Hartsfield-Jackson Airport
            │   │Airport│    │
            │   └──────┘     │
33.54°N  ───┼────────────────┼───  (South - Stockbridge)
  (Min)     │                │

Coverage: ~23 km (N-S) × ~24 km (E-W)
```

### Distance Calculations (approx):

**North-South:**
- 0.21° latitude ≈ 23 km (14 miles)

**East-West (at 33.6° latitude):**
- 0.22° longitude ≈ 24 km (15 miles)

**Total Coverage:**
- ~23 km × 24 km ≈ **550 km²** (212 sq miles)
- Perfect for metropolitan area monitoring

---

## Combined Optimizations

### All optimizations applied:

1. ✅ **45-second cache** (was consuming 300 req/h → 80 req/h)
2. ✅ **Removed redundant health checks**
3. ✅ **Consolidated endpoints**
4. ✅ **Atlanta metro bounding box** (4 credits → 1 credit)

### Final Results:

**Without any optimizations:**
- 300 requests/hour × 4 credits = **1,200 credits/hour**
- Daily (8h) = **9,600 credits** ❌ (exhausts in <12 hours!)

**With all optimizations:**
- 80 requests/hour × 1 credit = **80 credits/hour**
- Daily (8h) = **640 credits** ✅
- **92% total reduction!** 🎉

---

## Backend Changes

**File:** `app/main.py`

### 1. Added Default Bounding Box Constant:

```python
DEFAULT_BBOX = {
    "lamin": 33.54,   # South - Stockbridge
    "lamax": 33.75,   # North - Downtown Atlanta
    "lomin": -84.45,  # West - College Park
    "lomax": -84.23   # East - Stockbridge
}
```

### 2. Updated `/api/v1/airspace` Endpoint:

```python
@app.get("/api/v1/airspace")
async def get_airspace(limit: int = Query(default=50, ge=1, le=500)):
    # Use Atlanta metro bounding box by default
    data, rate_limit_info = await fetch_opensky_api(params=DEFAULT_BBOX)

    # Add bounding box to metadata for transparency
    metadata = {
        "bounding_box": DEFAULT_BBOX,
        "area_coverage": "Atlanta Metro (East Point, Downtown, College Park, Airport, Stockbridge)"
    }

    return create_geojson_response(states, timestamp, rate_limit_info, metadata)
```

---

## Response Format

### Example Response:

```json
{
  "type": "FeatureCollection",
  "features": [...],
  "metadata": {
    "total_aircraft": 12,
    "timestamp": 1735405234,
    "auth_mode": "oauth2",
    "bounding_box": {
      "lamin": 33.54,
      "lamax": 33.75,
      "lomin": -84.45,
      "lomax": -84.23
    },
    "area_coverage": "Atlanta Metro (East Point, Downtown, College Park, Airport, Stockbridge)"
  },
  "rate_limit": {
    "remaining": "3999",
    "retry_after_seconds": null
  }
}
```

**Note:** The metadata now includes bounding box info for transparency.

---

## Testing

### Before Fix:

```bash
curl "http://localhost:8000/api/v1/airspace?limit=50"
# Credits consumed: 4 per request
# Rate limit: 3996 (was 4000)
```

### After Fix:

```bash
curl "http://localhost:8000/api/v1/airspace?limit=50"
# Credits consumed: 1 per request
# Rate limit: 3999 (was 4000)
```

**Verification:**
- Watch backend logs for cache hits
- Monitor rate limit in response
- Verify metadata includes bounding_box

---

## Scaling to Other Regions

Want to monitor a different city? Just update the constants:

### Example: New York City

```python
# NYC Metro Area (~0.09 sq deg = 1 credit)
DEFAULT_BBOX = {
    "lamin": 40.50,   # South - Staten Island
    "lamax": 40.90,   # North - Bronx
    "lomin": -74.25,  # West - Newark
    "lomax": -73.70   # East - Queens
}
```

### Example: Los Angeles

```python
# LA Metro Area (~0.15 sq deg = 1 credit)
DEFAULT_BBOX = {
    "lamin": 33.70,   # South - Long Beach
    "lamax": 34.35,   # North - Burbank
    "lomin": -118.67, # West - Santa Monica
    "lomax": -118.15  # East - San Bernardino
}
```

**Formula to stay under 25 sq deg:**
```
Area = (lamax - lamin) × (lomax - lomin)
Area < 25 sq deg  →  1 credit per request
```

---

## Summary

🎯 **Root cause:** No bounding box = 4 credits per request (global query)

✅ **Solution:** Atlanta metro bounding box = 1 credit per request

📊 **Impact:** 75% credit reduction per request

🚀 **Combined with cache:** 92% total optimization

**Final consumption:**
- **640 credits/day** (was 9,600)
- **6+ days** until limit (was <12 hours)
- **Sustainable long-term usage** ✅

Perfect for local monitoring without breaking the bank! 🎉
