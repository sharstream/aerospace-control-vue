# Quick Credit Cost Reference

**Current Configuration:** 45-second cache, 24.9 sq deg bbox, 1 credit/request

---

## 📊 Current System Performance

| Metric | Value |
|--------|-------|
| **Cost per request** | 1 credit |
| **Cache TTL** | 45 seconds |
| **Requests per minute** | 1.33 |
| **Requests per hour** | 80 |
| **Credits per hour** | 80 |
| **Credits per day (24/7)** | 1,920 |
| **Daily limit (OAuth2)** | 4,000 |
| **Days until limit (24/7)** | **2.08 days** |

---

## ⏰ Usage Scenarios

| Scenario | Hours/Day | Credits/Day | Days Until Limit |
|----------|-----------|-------------|------------------|
| **24/7 Continuous** | 24 | 1,920 | **2.08 days** ⚠️ |
| **Business Hours** | 8 | 640 | **6.25 days** ✅ |
| **Part-Time** | 4 | 320 | **12.5 days** ✅ |
| **Minimal** | 2 | 160 | **25 days** ✅ |

---

## 🔄 Token Refresh (OAuth2)

| Metric | Value |
|--------|-------|
| Token lifetime | 30 minutes |
| Refresh trigger | 25 minutes |
| Refreshes per hour | ~2 |
| Refreshes per day | ~48 |
| **Credit cost** | **0 credits** ✅ |

**Important:** Token refresh does NOT consume API credits!

---

## 💰 Cache Efficiency

### Without Cache (10-second polling)
- **Credits/hour:** 360
- **Credits/day:** 8,640
- **Days until limit:** 0.46 days (11 hours) ❌

### With 45-Second Cache (Current)
- **Credits/hour:** 80
- **Credits/day:** 1,920
- **Days until limit:** 2.08 days ✅
- **Savings:** 77.8% reduction 🎉

---

## 🎯 Alternative Cache TTL Options

| Cache TTL | Requests/Hour | Credits/Day (24/7) | Days Until Limit |
|-----------|---------------|--------------------|--------------------|
| 30 sec | 120 | 2,880 | 1.39 days |
| **45 sec** ✅ | **80** | **1,920** | **2.08 days** |
| 60 sec | 60 | 1,440 | 2.78 days |
| 90 sec | 40 | 960 | 4.17 days |
| 120 sec | 30 | 720 | 5.56 days |
| 180 sec | 20 | 480 | 8.33 days |
| 300 sec | 12 | 288 | 13.89 days |

---

## 💡 Recommendation: 90-Second Cache

### Why 90 Seconds?

| Metric | 45-sec (current) | 90-sec (recommended) | Improvement |
|--------|------------------|----------------------|-------------|
| Real-time feel | Excellent | Very Good | -50% |
| Credits/hour | 80 | 40 | **50% savings** |
| Credits/day | 1,920 | 960 | **50% savings** |
| Days until limit | 2.08 | 4.17 | **2x longer** |
| Aircraft movement | 7-10 km | 14-20 km | Imperceptible |

**Trade-off:** Slightly less real-time (90s vs 45s), but **2x longer usage** before hitting limit.

---

## 📈 Real-World Usage Examples

### Morning Commute (6 AM - 9 AM, 3 hours)
```
Credits: 80 × 3 = 240 credits/day
Days until limit: 4,000 ÷ 240 = 16.67 days ✅
```

### Business Dashboard (8 AM - 5 PM, 9 hours)
```
Credits: 80 × 9 = 720 credits/day
Days until limit: 4,000 ÷ 720 = 5.56 days ✅
```

### Airport Operations (12-hour shifts)
```
Credits: 80 × 12 = 960 credits/day
Days until limit: 4,000 ÷ 960 = 4.17 days ✅
```

### 24/7 Air Traffic Monitoring
```
Credits: 80 × 24 = 1,920 credits/day
Days until limit: 4,000 ÷ 1,920 = 2.08 days ⚠️
```

---

## 🎮 Quick Calculator

**Formula:**
```
Daily Credits = (Active Hours × 3600) ÷ Cache TTL

Days Until Limit = 4000 ÷ Daily Credits
```

**Example (4 hours/day with 45s cache):**
```
Daily Credits = (4 × 3600) ÷ 45 = 320 credits
Days Until Limit = 4000 ÷ 320 = 12.5 days
```

---

## ✅ Best Configuration by Use Case

| Use Case | Recommended Cache | Why |
|----------|-------------------|-----|
| **Development/Testing** | 45 seconds | Fast iteration, immediate feedback |
| **Production Dashboard** | 90 seconds | Balance of real-time + efficiency |
| **Monitoring System** | 120 seconds | Longer runtime, acceptable delay |
| **Background Service** | 180-300 seconds | Maximum efficiency |

---

## 🚨 Important Notes

1. **Bounding box cost:** 1 credit (24.9 sq deg under 25 threshold)
2. **Token refresh cost:** 0 credits (authentication only)
3. **Cache hit cost:** 0 credits (served from memory)
4. **Only fresh API calls consume credits**
5. **Daily limit resets every 24 hours**

---

**Last Updated:** 2025-12-28
