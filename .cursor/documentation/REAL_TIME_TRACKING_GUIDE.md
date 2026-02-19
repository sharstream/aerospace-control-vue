# Real-Time Aircraft Trajectory Tracking - Implementation Guide

**Date:** 2025-12-28
**Status:** ✅ Fully Implemented and Ready to Use

---

## Overview

This guide shows how to use the real-time aircraft trajectory tracking system built into SkySentinel. The system polls aircraft positions every 45 seconds and builds complete flight paths over time.

---

## Features

✅ **Real-time tracking** - Polls every 45 seconds (matches cache TTL)
✅ **Automatic trajectory building** - Stores waypoints as aircraft moves
✅ **Multiple aircraft** - Track unlimited aircraft simultaneously
✅ **GeoJSON export** - Compatible with map libraries
✅ **Statistics** - Distance traveled, altitude, velocity analytics
✅ **JSON download** - Save trajectory data for analysis
✅ **Vue composable** - Easy integration in components
✅ **Automatic cleanup** - Stops tracking on component unmount

---

## Quick Start

### 1. Using in Vue Components (Recommended)

```vue
<template>
  <div class="tracking-panel">
    <h2>Track Aircraft</h2>

    <!-- Input to start tracking -->
    <input
      v-model="icao24Input"
      placeholder="Enter ICAO24 (e.g., aae316)"
      @keyup.enter="handleStartTracking"
    />
    <button @click="handleStartTracking">Start Tracking</button>

    <!-- List of tracked aircraft -->
    <div v-for="icao24 in trackedAircraft" :key="icao24" class="tracked-aircraft">
      <h3>{{ icao24 }}</h3>

      <div v-if="getStatistics(icao24)" class="stats">
        <p>Waypoints: {{ getStatistics(icao24).waypoint_count }}</p>
        <p>Altitude: {{ Math.round(getStatistics(icao24).altitude.current) }}m</p>
        <p>Velocity: {{ Math.round(getStatistics(icao24).velocity.current) }} m/s</p>
        <p>Distance: {{ getStatistics(icao24).distance_traveled.toFixed(2) }} km</p>
      </div>

      <button @click="stopTracking(icao24)">Stop Tracking</button>
      <button @click="downloadTrajectory(icao24)">Download JSON</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useTrajectoryTracking } from '@/composables/useTrajectoryTracking';

export default {
  name: 'TrackingPanel',
  setup() {
    const icao24Input = ref('');

    const {
      startTracking,
      stopTracking,
      trackedAircraft,
      getStatistics,
      downloadTrajectory
    } = useTrajectoryTracking();

    const handleStartTracking = async () => {
      if (icao24Input.value.trim()) {
        await startTracking(icao24Input.value.trim().toLowerCase());
        icao24Input.value = '';
      }
    };

    return {
      icao24Input,
      handleStartTracking,
      startTracking,
      stopTracking,
      trackedAircraft,
      getStatistics,
      downloadTrajectory
    };
  }
};
</script>
```

---

### 2. Using with Map Integration

```vue
<template>
  <div>
    <MapModule
      :flights="flights"
      :trajectories="trajectoryGeoJSON"
      @flight-click="handleFlightClick"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useFlightsStore } from '@/stores/flights';
import { useTrajectoryTracking } from '@/composables/useTrajectoryTracking';
import MapModule from '@/modules/map/MapModule.vue';

export default {
  name: 'AircraftMap',
  components: { MapModule },
  setup() {
    const flightsStore = useFlightsStore();
    const { startTracking, getAllGeoJSON } = useTrajectoryTracking();

    // Convert trajectories to GeoJSON for map rendering
    const trajectoryGeoJSON = computed(() => getAllGeoJSON());

    const handleFlightClick = async (flight) => {
      // Start tracking when user clicks on aircraft
      if (flight.icao24) {
        await startTracking(flight.icao24);
      }
    };

    return {
      flights: flightsStore.flights,
      trajectoryGeoJSON,
      handleFlightClick
    };
  }
};
</script>
```

---

### 3. Using Global Tracker (Advanced)

```javascript
import { globalTracker } from '@/services/trajectoryTracker';

// Start tracking
await globalTracker.startTracking('aae316');

// Get trajectory
const trajectory = globalTracker.getTrajectory('aae316');
console.log(`Collected ${trajectory.length} waypoints`);

// Get statistics
const stats = globalTracker.getStatistics('aae316');
console.log(`Distance traveled: ${stats.distance_traveled.toFixed(2)} km`);

// Export as GeoJSON
const geojson = globalTracker.exportAsGeoJSON('aae316');

// Stop tracking
globalTracker.stopTracking('aae316');
```

---

## API Reference

### TrajectoryTracker Class

#### Constructor Options

```javascript
const tracker = new TrajectoryTracker({
  pollInterval: 45000,  // Polling interval in ms (default: 45000)
  maxPoints: 1000,      // Maximum waypoints per trajectory (default: 1000)
  onUpdate: (icao24, waypoint, trajectory) => {
    // Callback when trajectory updates
    console.log(`New waypoint for ${icao24}`);
  }
});
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `startTracking()` | `icao24` | `Promise<void>` | Start tracking aircraft |
| `stopTracking()` | `icao24` | `void` | Stop tracking aircraft |
| `stopAllTracking()` | - | `void` | Stop all tracking |
| `getTrajectory()` | `icao24` | `Array` | Get waypoints array |
| `isTracking()` | `icao24` | `boolean` | Check if tracking |
| `exportAsGeoJSON()` | `icao24` | `Object` | Get GeoJSON Feature |
| `exportAllAsGeoJSON()` | - | `Object` | Get GeoJSON FeatureCollection |
| `getStatistics()` | `icao24` | `Object` | Get trajectory statistics |
| `clearTrajectory()` | `icao24` | `void` | Clear waypoints |
| `clearAllTrajectories()` | - | `void` | Clear all waypoints |
| `downloadAsJSON()` | `icao24` | `void` | Download trajectory file |

---

### Composable API

```javascript
const {
  // Methods
  startTracking,
  stopTracking,
  stopAllTracking,
  isTracking,
  getTrajectory,
  getGeoJSON,
  getAllGeoJSON,
  getStatistics,
  clearTrajectory,
  clearAllTrajectories,
  downloadTrajectory,

  // Reactive state
  trackedAircraft,    // ref([]) - Array of ICAO24s being tracked
  trajectories,       // ref(Map) - Map of trajectories
  statistics,         // ref(Map) - Map of statistics

  // Tracker instance
  tracker
} = useTrajectoryTracking();
```

---

## Data Structures

### Waypoint Object

```javascript
{
  time: 1735433600000,           // Timestamp in ms
  position: [33.6407, -84.4277], // [latitude, longitude]
  altitude: 10668,               // Meters
  heading: 270,                  // Degrees
  velocity: 250,                 // m/s
  vertical_rate: 0,              // m/s
  on_ground: false,              // Boolean
  callsign: "AAL2693"            // Aircraft callsign
}
```

### Statistics Object

```javascript
{
  icao24: "aae316",
  callsign: "AAL2693",
  waypoint_count: 45,
  tracking_duration: 2025000,    // Milliseconds
  start_time: Date,
  end_time: Date,
  altitude: {
    max: 11000,
    min: 9500,
    avg: 10250,
    current: 10668
  },
  velocity: {
    max: 260,
    min: 240,
    avg: 250,
    current: 250
  },
  distance_traveled: 125.5,      // Kilometers
  current_position: [33.6407, -84.4277],
  on_ground: false
}
```

### GeoJSON Output

```javascript
{
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-84.4277, 33.6407, 10668],  // [lon, lat, alt]
      [-84.4200, 33.6450, 10700],
      // ... more coordinates
    ]
  },
  properties: {
    icao24: "aae316",
    callsign: "AAL2693",
    waypoint_count: 45,
    duration: 2025000,
    start_time: 1735433600000,
    end_time: 1735435625000,
    max_altitude: 11000,
    min_altitude: 9500,
    avg_velocity: 250
  },
  waypoints: [/* array of waypoint objects */]
}
```

---

## Examples

### Example 1: Track Aircraft from Flight List

```vue
<script>
import { useFlightsStore } from '@/stores/flights';
import { useTrajectoryTracking } from '@/composables/useTrajectoryTracking';

export default {
  setup() {
    const flightsStore = useFlightsStore();
    const { startTracking } = useTrajectoryTracking();

    // Track first 5 aircraft
    const trackMultipleAircraft = async () => {
      const aircraftToTrack = flightsStore.flights.slice(0, 5);

      for (const flight of aircraftToTrack) {
        if (flight.icao24) {
          await startTracking(flight.icao24);
          console.log(`Started tracking ${flight.icao24}`);
        }
      }
    };

    return { trackMultipleAircraft };
  }
};
</script>
```

---

### Example 2: Export All Trajectories

```javascript
import { globalTracker } from '@/services/trajectoryTracker';

function exportAllTrajectories() {
  const geojson = globalTracker.exportAllAsGeoJSON();

  // Convert to JSON string
  const json = JSON.stringify(geojson, null, 2);

  // Create download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `all_trajectories_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

### Example 3: Real-Time Statistics Display

```vue
<template>
  <div v-if="stats" class="stats-panel">
    <h3>{{ stats.callsign }} ({{ stats.icao24 }})</h3>

    <div class="stat-row">
      <span class="label">Tracking Duration:</span>
      <span class="value">{{ formatDuration(stats.tracking_duration) }}</span>
    </div>

    <div class="stat-row">
      <span class="label">Waypoints Collected:</span>
      <span class="value">{{ stats.waypoint_count }}</span>
    </div>

    <div class="stat-row">
      <span class="label">Current Altitude:</span>
      <span class="value">{{ stats.altitude.current.toLocaleString() }}m</span>
    </div>

    <div class="stat-row">
      <span class="label">Current Velocity:</span>
      <span class="value">{{ stats.velocity.current }} m/s</span>
    </div>

    <div class="stat-row">
      <span class="label">Distance Traveled:</span>
      <span class="value">{{ stats.distance_traveled.toFixed(2) }} km</span>
    </div>

    <div class="stat-row">
      <span class="label">Status:</span>
      <span class="value">{{ stats.on_ground ? 'On Ground' : 'In Flight' }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useTrajectoryTracking } from '@/composables/useTrajectoryTracking';

export default {
  props: {
    icao24: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { getStatistics } = useTrajectoryTracking();
    const stats = ref(null);
    let intervalId = null;

    const updateStats = () => {
      stats.value = getStatistics(props.icao24);
    };

    const formatDuration = (ms) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    };

    onMounted(() => {
      updateStats();
      // Update stats every 5 seconds
      intervalId = setInterval(updateStats, 5000);
    });

    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return { stats, formatDuration };
  }
};
</script>
```

---

## Performance Considerations

### Memory Usage

- Each waypoint stores ~200 bytes
- Default max 1000 waypoints per aircraft = ~200KB
- Tracking 10 aircraft = ~2MB
- Old waypoints automatically pruned when limit reached

### Network Usage

- Polls every 45 seconds (cache TTL)
- 1 API call per tracked aircraft per interval
- Tracking 5 aircraft = 5 calls every 45s = 400 calls/hour
- With cache: most calls return cached data (0 credits)

### Credit Consumption

| Scenario | Tracking Time | Aircraft | API Calls | Credits Used |
|----------|--------------|----------|-----------|--------------|
| Single aircraft, 1 hour | 1 hour | 1 | 80 | ~1-2 |
| 5 aircraft, 1 hour | 1 hour | 5 | 400 | ~5-10 |
| 10 aircraft, 8 hours | 8 hours | 10 | 6400 | ~80-160 |

**Note:** Actual credit consumption depends on cache hits. If multiple users/components request the same aircraft within 45s, cache serves the request without consuming credits.

---

## Best Practices

### 1. Track Only What You Need

```javascript
// ❌ Bad: Track everything
allFlights.forEach(f => startTracking(f.icao24));

// ✅ Good: Track user-selected aircraft
if (userSelectedAircraft) {
  startTracking(userSelectedAircraft.icao24);
}
```

### 2. Clean Up When Done

```javascript
// ✅ Always stop tracking when component unmounts
onBeforeUnmount(() => {
  stopTracking(icao24);
});

// ✅ Or let composable handle it automatically
const { startTracking } = useTrajectoryTracking();
// Automatically stops on unmount
```

### 3. Use Callbacks for Real-Time Updates

```javascript
const tracker = new TrajectoryTracker({
  onUpdate: (icao24, waypoint) => {
    // Update map in real-time
    updateMapMarker(icao24, waypoint.position);

    // Update UI
    showNotification(`${icao24} position updated`);
  }
});
```

### 4. Limit Maximum Points

```javascript
// For long-duration tracking, limit points to prevent memory issues
const tracker = new TrajectoryTracker({
  maxPoints: 500  // Last 500 points (~6 hours of tracking)
});
```

---

## Troubleshooting

### Issue: Tracking Not Starting

**Problem:** `startTracking()` doesn't seem to work

**Solutions:**
1. Check console for errors
2. Verify ICAO24 is valid lowercase string
3. Ensure backend is running
4. Check aircraft is within Georgia bounding box

```javascript
// Debug tracking
await startTracking('aae316');
console.log('Is tracking:', isTracking('aae316')); // Should be true
```

---

### Issue: No Waypoints Collected

**Problem:** Trajectory remains empty after tracking

**Solutions:**
1. Wait at least 45 seconds for first poll
2. Check aircraft hasn't left coverage area
3. Verify API endpoint is returning data

```javascript
// Manually check API
import { fetchAircraftStates } from '@/services/api';
const data = await fetchAircraftStates('aae316');
console.log('API response:', data);
```

---

### Issue: High Memory Usage

**Problem:** Browser using too much memory

**Solutions:**
1. Reduce `maxPoints` limit
2. Stop tracking aircraft that left area
3. Clear old trajectories regularly

```javascript
// Clear old trajectories every hour
setInterval(() => {
  const allAircraft = tracker.getTrackedAircraft();
  allAircraft.forEach((icao24) => {
    const trajectory = tracker.getTrajectory(icao24);
    if (trajectory.length > 800) {
      tracker.clearTrajectory(icao24);
    }
  });
}, 3600000);
```

---

## Files Created

- **`src/services/trajectoryTracker.js`** - Main tracking class
- **`src/composables/useTrajectoryTracking.js`** - Vue composable
- **`REAL_TIME_TRACKING_GUIDE.md`** - This documentation

---

## Next Steps

1. ✅ Import composable in your component
2. ✅ Call `startTracking()` with ICAO24
3. ✅ Display trajectory on map
4. ✅ Show statistics in UI
5. ✅ Add export/download features

---

## Related Documentation

- **Backend API:** `app/main.py` - `/api/v1/states/aircraft` endpoint
- **Frontend API:** `src/services/api.js` - `fetchAircraftStates()`
- **Credit Analysis:** `CREDIT_COST_ANALYSIS.md`
- **Configuration:** `src/config/constants.js` - Bounding box settings

---

**Status:** ✅ Fully Implemented and Tested
**Last Updated:** 2025-12-28
**Ready for Production:** Yes
