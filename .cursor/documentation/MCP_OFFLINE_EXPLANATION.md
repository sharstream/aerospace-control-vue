# Why You're Seeing "MCP: Offline" - The Difference Explained

## What You're Seeing
- **Your question**: "pressure of DL1234"
- **Commander Atlas response**: Generic suggestion instead of actual pressure data
- **Status**: "MCP: Offline (using simulated responses)"

## The Root Cause

### Before My Fix
- **Backend**: Tools were broken due to missing `ctx` parameter
- **Frontend**: May have been connected, but tools would fail with 400 Bad Request
- **Result**: No tool execution, but different error

### After My Fix  
- **Backend**: ✅ Tools work perfectly (verified with curl)
- **Frontend**: ❌ MCP client can't connect due to **invalid session ID**
- **Result**: Falls back to simulated responses

## Why the Session is Invalid

Looking at the backend logs:
```
INFO: 192.168.65.1:44368 - "GET /mcp/tools/list HTTP/1.1" 401 Unauthorized
```

Your frontend is trying to use session ID `c518b183-56ff-4818-86b1-f2a15bb6b3bd`, but this session **doesn't exist** on the backend because:

1. **In-memory storage**: The backend stores sessions in memory (not persistent)
2. **Container restart**: When the Docker container restarted, all sessions were lost
3. **Stale localStorage**: Your browser still has the old session ID saved

## The Solution

### Option 1: Create a New Session (Recommended)
1. Go to **Settings** → **AI Assistant**
2. Click **"Save Configuration"** to create a new session
3. The new session ID will be stored in localStorage
4. Return to the Live Map and open Commander Atlas
5. You should now see "MCP: Online (4 tools available)"

### Option 2: Clear Browser Storage
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Find and delete the `ai_session_id` key
4. Refresh the page
5. Go to Settings and create a new session

## Verification

Once you have a valid session, asking "pressure of DL1234" should:

1. **Detect** the query is about pressure
2. **Execute** `detect_pressure_anomaly` tool
3. **Display** actual results like:
   ```
   Pressure Status: NORMAL
   Cabin Pressure: 11.5 PSI
   Expected: 11.3 PSI
   Rate of Change: 0.1 PSI/min
   Severity: INFO
   ```

## Backend Status: ✅ WORKING

I verified all tools work correctly:
- ✅ `detect_pressure_anomaly` - Returns pressure analysis
- ✅ `analyze_fuel_consumption` - Returns fuel status
- ✅ `predict_trajectory` - Returns trajectory predictions

The backend is fully functional. You just need a valid session ID in the frontend!
