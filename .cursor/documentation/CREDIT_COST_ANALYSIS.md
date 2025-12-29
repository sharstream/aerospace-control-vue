# SkySentinel API Credit Cost Analysis

**Date:** 2025-12-28
**Configuration:** 45-second cache TTL, 24.9 sq deg bounding box, OAuth2 authentication

---

## Current System Configuration

### Backend Settings
- **Bounding box**: 24.9 square degrees (Georgia state)
- **Credit cost per request**: 1 credit (under 25 sq deg threshold)
- **Cache TTL**: 45 seconds
- **OAuth2 token lifetime**: 30 minutes
- **Token refresh trigger**: 25 minutes (5 minutes before expiry)

### OpenSky API Limits (OAuth2 Authenticated)
- **Daily credit limit**: 4,000 credits
- **Reset schedule**: Daily (unknown exact time)
- **Rate limit window**: 24 hours

---

## Credit Consumption Calculations

### Per Hour (Continuous Usage)

**Assumptions:**
- Application continuously requests data
- Each request after cache expiry triggers new API call
- Cache serves all requests within 45-second window

**Calculation:**
```
1 hour = 3,600 seconds
Cache TTL = 45 seconds

Number of cache expirations per hour = 3,600 ÷ 45 = 80
Credits per hour = 80 requests × 1 credit = 80 credits
```

**Result:** **80 credits/hour** (continuous usage)

---

### Per Day (24-Hour Continuous Usage)

**Calculation:**
```
Credits per day = 80 credits/hour × 24 hours = 1,920 credits
```

**Result:** **1,920 credits/day** (continuous 24/7 usage)

**Days until limit:**
```
4,000 credits ÷ 1,920 credits/day = 2.08 days
```

---

## Usage Scenarios Analysis

### Scenario 1: Continuous 24/7 Monitoring
**Profile:** Server monitoring, automated systems, unattended operation

| Metric | Value |
|--------|-------|
| Active hours/day | 24 hours |
| Requests/hour | 80 |
| Credits/day | 1,920 |
| Days until limit | **2.08 days** |
| Weeks until limit | 0.30 weeks |

⚠️ **Warning:** Will exceed daily limit in ~2 days

---

### Scenario 2: Business Hours Usage (8 hours/day)
**Profile:** Office hours monitoring, daytime operations

| Metric | Value |
|--------|-------|
| Active hours/day | 8 hours |
| Requests/hour | 80 |
| Credits/day | 640 |
| Days until limit | **6.25 days** |
| Weeks until limit | 0.89 weeks |

✅ **Sustainable:** Almost a full week of usage

---

### Scenario 3: Part-Time Usage (4 hours/day)
**Profile:** Intermittent monitoring, specific time windows

| Metric | Value |
|--------|-------|
| Active hours/day | 4 hours |
| Requests/hour | 80 |
| Credits/day | 320 |
| Days until limit | **12.5 days** |
| Weeks until limit | 1.79 weeks |

✅ **Optimal:** Nearly 2 weeks of usage

---

### Scenario 4: Minimal Usage (2 hours/day)
**Profile:** Spot checks, periodic monitoring

| Metric | Value |
|--------|-------|
| Active hours/day | 2 hours |
| Requests/hour | 80 |
| Credits/day | 160 |
| Days until limit | **25 days** |
| Weeks until limit | 3.57 weeks |

✅ **Very Sustainable:** Nearly a month of usage

---

## Detailed Request Timeline

### Per Minute
```
60 seconds ÷ 45 seconds = 1.33 cache expirations/minute
Credits/minute = 1.33 credits
```

### Per 5 Minutes
```
5 minutes × 1.33 credits/minute = 6.67 credits
```

### Per 15 Minutes
```
15 minutes × 1.33 credits/minute = 20 credits
```

### Per 30 Minutes
```
30 minutes × 1.33 credits/minute = 40 credits
```

### Per Hour
```
60 minutes × 1.33 credits/minute = 80 credits
```

---

## OAuth2 Token Refresh Impact

### Token Lifecycle
- **Token lifetime**: 30 minutes
- **Refresh trigger**: 25 minutes (5-minute safety buffer)
- **Tokens per hour**: ~2 refreshes
- **Tokens per day**: ~48 refreshes (24/7 usage)

### Credit Cost of Token Refresh
**Cost:** **0 credits** ❌

Token refresh is an OAuth2 authentication operation that does NOT consume OpenSky API credits. It only contacts the OAuth2 token endpoint, not the data endpoints.

**Breakdown:**
1. Initial token request: 0 credits (authentication only)
2. Token refresh at 25 min: 0 credits (authentication only)
3. Data API calls: 1 credit each (only these consume credits)

✅ **Token management does NOT affect credit consumption**

---

## Cache Efficiency Analysis

### Without Cache (Hypothetical)
If we had NO cache and requested every 10 seconds:
```
3,600 seconds/hour ÷ 10 seconds = 360 requests/hour
360 requests/hour × 1 credit = 360 credits/hour
360 credits/hour × 24 hours = 8,640 credits/day
```
**Result:** Would exceed daily limit (4,000) in 11 hours ⚠️

### With 45-Second Cache (Current)
```
3,600 seconds/hour ÷ 45 seconds = 80 requests/hour
80 requests/hour × 1 credit = 80 credits/hour
80 credits/hour × 24 hours = 1,920 credits/day
```
**Result:** 2.08 days of continuous usage ✅

### Cache Savings
```
Without cache: 8,640 credits/day
With cache: 1,920 credits/day
Savings: 6,720 credits/day (77.8% reduction)
```

**Cache efficiency:** **77.8% credit savings** 🎉

---

## Alternative Cache TTL Scenarios

### 30-Second Cache
```
Requests/hour = 3,600 ÷ 30 = 120
Credits/day = 120 × 24 = 2,880
Days until limit = 4,000 ÷ 2,880 = 1.39 days
```
**Analysis:** More real-time, but shorter runway

### 60-Second Cache (1 minute)
```
Requests/hour = 3,600 ÷ 60 = 60
Credits/day = 60 × 24 = 1,440
Days until limit = 4,000 ÷ 1,440 = 2.78 days
```
**Analysis:** Good balance, 2.78 days continuous

### 90-Second Cache (1.5 minutes)
```
Requests/hour = 3,600 ÷ 90 = 40
Credits/day = 40 × 24 = 960
Days until limit = 4,000 ÷ 960 = 4.17 days
```
**Analysis:** Very efficient, 4+ days continuous

### 120-Second Cache (2 minutes)
```
Requests/hour = 3,600 ÷ 120 = 30
Credits/day = 30 × 24 = 720
Days until limit = 4,000 ÷ 720 = 5.56 days
```
**Analysis:** Nearly a week of continuous usage

---

## Cost Comparison Table

| Cache TTL | Requests/Hour | Credits/Day | Days Until Limit | Notes |
|-----------|---------------|-------------|------------------|-------|
| 30 sec | 120 | 2,880 | 1.39 | Most real-time |
| **45 sec** | **80** | **1,920** | **2.08** | **Current config** |
| 60 sec | 60 | 1,440 | 2.78 | Balanced |
| 90 sec | 40 | 960 | 4.17 | Efficient |
| 120 sec | 30 | 720 | 5.56 | Very efficient |
| 180 sec | 20 | 480 | 8.33 | Week+ runtime |
| 300 sec | 12 | 288 | 13.89 | 2 weeks runtime |

---

## Optimization Recommendations

### 1. Current Config (45 sec TTL) ✅
**Best for:** Real-time monitoring with moderate efficiency

**Pros:**
- Near real-time updates (~45 sec delay)
- 77.8% cache efficiency
- 2+ days continuous usage

**Cons:**
- Only 2 days for 24/7 operation
- May need monitoring restart every 2 days

---

### 2. Recommended: 90-Second TTL
**Best for:** Balanced real-time + efficiency

**Changes needed:**
```python
# In app/main.py
_api_cache = {
    "ttl_seconds": 90,  # Changed from 45
}
```

**Benefits:**
- 4+ days continuous usage (2x improvement)
- Still acceptable for aircraft tracking (~1.5 min update)
- Aircraft move ~14-20 km in 90s (still imperceptible at map scale)

**Trade-off:**
- Slightly less real-time feel (90s vs 45s delay)

---

### 3. Alternative: User-Configurable Refresh Rate

Allow users to choose update frequency:

```javascript
// Frontend settings
const REFRESH_MODES = {
  realtime: 30,    // 30 sec (aggressive, 2880 credits/day)
  balanced: 60,    // 60 sec (balanced, 1440 credits/day)
  efficient: 120,  // 120 sec (efficient, 720 credits/day)
  minimal: 300     // 300 sec (minimal, 288 credits/day)
};
```

**Implementation:**
- Add dropdown in settings panel
- User selects preferred refresh rate
- Frontend requests data at chosen interval
- Backend cache serves requests within TTL

---

## Daily Reset Strategy

### Understanding Daily Limits

OpenSky resets credits at a specific time each day (unknown exact time). Once reset occurs:
- Credit counter resets to 4,000
- Previous day's consumption cleared
- New 24-hour window begins

### Monitoring Strategy

**Option 1: Conservative Usage**
- Limit daily usage to 3,500 credits (87.5% of limit)
- Reserve 500 credits as buffer
- With 45s cache: max 43.75 hours of continuous usage per day
- With 90s cache: max 87.5 hours spread across week

**Option 2: Aggressive Usage with Monitoring**
- Use full 4,000 credit limit
- Monitor `X-Rate-Limit-Remaining` header
- Stop requests when remaining < 100 credits
- Resume after daily reset

**Option 3: Time-Based Scheduling**
- Assume reset occurs at specific time (e.g., midnight UTC)
- Budget credits across 24 hours
- Example: 4,000 credits ÷ 24 hours = 166 credits/hour max
- With 45s cache: ~2 hours of continuous usage per hour allowed

---

## Real-World Usage Patterns

### Pattern 1: Morning Commute Monitoring
```
Active hours: 6 AM - 9 AM (3 hours)
Credits used: 80 × 3 = 240 credits
Daily usage: 240 credits
Days until limit: 4,000 ÷ 240 = 16.67 days
```
**Sustainability:** Over 2 weeks ✅

### Pattern 2: Business Hours Dashboard
```
Active hours: 8 AM - 5 PM (9 hours)
Credits used: 80 × 9 = 720 credits
Daily usage: 720 credits
Days until limit: 4,000 ÷ 720 = 5.56 days
```
**Sustainability:** Nearly 1 week ✅

### Pattern 3: Airport Operations (12-hour shifts)
```
Active hours: 6 AM - 6 PM (12 hours)
Credits used: 80 × 12 = 960 credits
Daily usage: 960 credits
Days until limit: 4,000 ÷ 960 = 4.17 days
```
**Sustainability:** 4+ days ✅

### Pattern 4: 24/7 Air Traffic Control
```
Active hours: 24 hours
Credits used: 80 × 24 = 1,920 credits
Daily usage: 1,920 credits
Days until limit: 4,000 ÷ 1,920 = 2.08 days
```
**Sustainability:** 2 days ⚠️ (requires frequent resets)

---

## Summary & Recommendations

### Current Configuration Performance
✅ **Cache TTL:** 45 seconds
✅ **Cost per request:** 1 credit (Georgia bbox)
✅ **Requests per hour:** 80 (continuous)
✅ **Credits per day:** 1,920 (24/7 usage)
✅ **Days until limit:** 2.08 days (continuous)

### Best Practices

1. **For Production Use:**
   - Increase cache TTL to 90 seconds (4+ days runtime)
   - Implement rate limit monitoring
   - Add automatic pause when credits low

2. **For Development:**
   - Keep 45-second TTL for testing
   - Monitor credit consumption
   - Use smaller bbox for rapid iteration

3. **For Monitoring Dashboard:**
   - Consider 120-second TTL (5+ days runtime)
   - Implement user-configurable refresh rates
   - Show credit remaining in UI

4. **For High-Frequency Updates:**
   - Use 30-second TTL (but only 1.39 days runtime)
   - Consider upgrading to premium OpenSky tier
   - Implement intelligent caching (e.g., cache longer during low activity)

---

**Analysis Date:** 2025-12-28
**Configuration:** Optimized for real-time monitoring with sustainable credit usage
