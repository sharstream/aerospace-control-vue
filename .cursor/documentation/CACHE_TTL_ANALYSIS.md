# Cache TTL Analysis: Finding the Perfect Balance

## Comparison Matrix

Assuming frontend polls every 12 seconds:

| Cache TTL | Requests/Hour | Credits/Day (8h) | % Savings | Aircraft Movement | Data Lag | User Experience Rating |
|-----------|---------------|------------------|-----------|-------------------|----------|------------------------|
| **0s (None)** | 300 | 2,400 | 0% | 0 km | 0s | ⭐⭐⭐⭐⭐ Perfect |
| **15s** | 200 | 1,600 | 33% | ~2-3 km | 0-15s | ⭐⭐⭐⭐⭐ Excellent+ |
| **30s** | 120 | 960 | 60% | ~5-7 km | 0-30s | ⭐⭐⭐⭐⭐ Excellent |
| **45s** | 80 | 640 | 73% | ~7-10 km | 0-45s | ⭐⭐⭐⭐ Very Good+ |
| **60s** | 60 | 480 | 80% | ~10-15 km | 0-60s | ⭐⭐⭐⭐ Very Good |
| **90s** | 40 | 320 | 87% | ~15-22 km | 0-90s | ⭐⭐⭐ Good |
| **120s** | 30 | 240 | 90% | ~20-30 km | 0-120s | ⭐⭐⭐ Good |
| **300s (5m)** | 12 | 96 | 96% | ~50-75 km | 0-5m | ⭐⭐ Acceptable |

## Detailed Analysis

### Option 1: 30 seconds (Excellent)
```python
"ttl_seconds": 30  # Excellent real-time feel
```

**Pros:**
- ✅ Aircraft move only ~5-7 km (3-4 miles)
- ✅ Imperceptible lag for users
- ✅ Still saves 60% of API credits
- ✅ 960 credits/day = fits easily in 4000 limit

**Cons:**
- ⚠️ More API calls than 60s
- ⚠️ Less headroom for multiple users

**Best for:**
- Single user / low traffic
- Need real-time precision
- Demo/showcase scenarios

---

### Option 2: 45 seconds (Sweet Spot - RECOMMENDED)
```python
"ttl_seconds": 45  # Balanced sweet spot
```

**Pros:**
- ✅ Aircraft move ~7-10 km (4-6 miles) - still very good
- ✅ Saves 73% of API credits (640/day)
- ✅ Still feels real-time to users
- ✅ Good balance of freshness + savings
- ✅ Debugging still reasonably easy

**Cons:**
- ⚠️ Slightly more lag than 30s (but barely noticeable)

**Best for:**
- Production use with light traffic
- Single user active monitoring
- Best balance of all factors

---

### Option 3: 60 seconds (Very Good)
```python
"ttl_seconds": 60  # Maximum savings while maintaining quality
```

**Pros:**
- ✅ Saves 80% of API credits (480/day)
- ✅ Maximum savings without compromising too much
- ✅ Still acceptable for live tracking
- ✅ Best for development (clears every minute)

**Cons:**
- ⚠️ Aircraft move 10-15 km - users may notice
- ⚠️ Approaching the "feels stale" threshold

**Best for:**
- Production with multiple users
- Cost optimization priority
- Background monitoring

---

## Real-World Scenario Comparison

### Scenario: Boeing 737 cruising at 900 km/h

**With 30s cache:**
- Cache age when user clicks: Average 15s
- Aircraft actual position: 3.75 km ahead of displayed position
- Visual impact: **Barely noticeable** on typical map zoom (city scale)

**With 45s cache:**
- Cache age when user clicks: Average 22.5s
- Aircraft actual position: 5.6 km ahead of displayed position
- Visual impact: **Slightly noticeable** but still acceptable

**With 60s cache:**
- Cache age when user clicks: Average 30s
- Aircraft actual position: 7.5 km ahead of displayed position
- Visual impact: **Noticeable** but not terrible

### Zoom Level Impact:

| Map Zoom | View Width | 30s lag visible? | 45s lag visible? | 60s lag visible? |
|----------|------------|------------------|------------------|------------------|
| City (50km) | 50 km | ❌ No (7% shift) | ❌ No (11% shift) | ⚠️ Maybe (15% shift) |
| Region (200km) | 200 km | ❌ No (2% shift) | ❌ No (3% shift) | ❌ No (4% shift) |
| Country (1000km) | 1000 km | ❌ No | ❌ No | ❌ No |

**Conclusion:** At typical viewing scales (regional/national), even 60s lag is acceptable.

---

## API Credit Math

### Daily Usage (8 hours active):

**30s cache:**
- Requests/hour: 120
- Requests/day: 960
- Days to exhaust 4000 limit: ~4 days
- **Good for:** Single active user

**45s cache:**
- Requests/hour: 80
- Requests/day: 640
- Days to exhaust 4000 limit: ~6 days
- **Good for:** 1-2 active users

**60s cache:**
- Requests/hour: 60
- Requests/day: 480
- Days to exhaust 4000 limit: ~8 days
- **Good for:** 2-3 concurrent users

---

## Frontend Polling Frequency Consideration

If you adjust **frontend** polling interval too:

### Current: Frontend polls every 12s

**Option A: Keep frontend at 12s, use 45s backend cache**
- Multiple frontend requests hit same cache
- Good for responsive UI updates (animation smoothness)
- Best of both worlds

**Option B: Slow frontend to 30s, use 30s backend cache**
- Fewer frontend requests
- Less smooth animations
- More credit savings

**Option C: Slow frontend to 45s, use 45s backend cache**
- Optimal alignment
- Smooth at 45s intervals
- Maximum savings

---

## My Final Recommendations

### For Single User / Development:
```python
"ttl_seconds": 30  # Excellent real-time feel, 60% savings
```

### For Production / Light Traffic (BEST OVERALL):
```python
"ttl_seconds": 45  # Sweet spot - 73% savings, excellent UX
```

### For Production / Multiple Users:
```python
"ttl_seconds": 60  # Maximum savings (80%), good UX
```

### For Cost Optimization:
```python
"ttl_seconds": 90  # 87% savings, acceptable UX
```

---

## Visual Decision Tree

```
Start: How many concurrent users?
  │
  ├─ 1 user only
  │   │
  │   ├─ Need perfect real-time? → 30s (Excellent)
  │   └─ Want credit savings? → 45s (Sweet Spot) ⭐ RECOMMENDED
  │
  └─ 2-3 users
      │
      ├─ Real-time important? → 45s (Sweet Spot) ⭐
      └─ Cost optimization? → 60s (Very Good)
```

---

## The Winner: 45 seconds

**Why 45s is the perfect balance:**

1. **Data Freshness:** Aircraft move 7-10 km (still feels real-time)
2. **API Savings:** 73% reduction (640 credits/day)
3. **User Experience:** Users won't notice the lag at typical zoom levels
4. **Headroom:** 3360 credits/day remaining for growth
5. **Not too fast:** Cache doesn't thrash
6. **Not too slow:** Doesn't feel stale

**Mathematical sweet spot:** Halfway between Excellent (30s) and Very Good (60s)

Would you like me to update the cache to **45 seconds**?
