# Dual Panel AI Chat Redesign Plan

**Branch**: `feature/dual-panel-ai-chat-query`
**Date**: January 31, 2026
**Status**: In Progress

---

## Goals

### 1. Aircraft-Specific Queries
- **Problem**: Currently uses generic `flights[0]` for all queries
- **Solution**: Use tracked aircraft data from selected/tracked flight
- **Benefit**: Real-time queries for specific aircraft being monitored

### 2. Resizable Panel
- **Problem**: Fixed size panel blocks tracked aircraft on map
- **Solution**: Add resize handles (8 directions) for dynamic resizing
- **Benefit**: User controls panel size to fit their workflow

### 3. Movable Panel
- **Problem**: Fixed position in top-left blocks map view
- **Solution**: Draggable panel that can be positioned anywhere
- **Benefit**: Position panel near bottom (list view) or right side

### 4. Real Data Integration
- **Problem**: Mock/test data being used
- **Solution**: Use OpenSky Network API data from tracked aircraft
- **Benefit**: Production-ready with real flight data

---

## Implementation Plan

### Phase 1: Props & State Management ✅
```vue
// Add new props
trackedAircraft: Array  // Array of tracked aircraft
selectedFlight: Object  // Currently selected aircraft
```

### Phase 2: Resizable Functionality
- Add 8 resize handles (corners + edges)
- Track panel dimensions in state (width, height)
- Persist size to localStorage
- Min/max size constraints

### Phase 3: Draggable Functionality
- Make header draggable
- Track panel position (x, y)
- Persist position to localStorage
- Boundary detection (stay within viewport)

### Phase 4: Aircraft Context Integration
- Detect tracked aircraft
- Pass to `determineToolExecution()`
- Use aircraft-specific data for MCP tools:
  - `flight.altitude` (real altitude)
  - `flight.speed` (real groundspeed)
  - `flight.heading` (real heading)
  - `flight.id` (ICAO24 code)
  - `flight.path` (real trajectory)

### Phase 5: Tool Execution Updates
```javascript
// BEFORE (generic)
const flight = props.flights[0];

// AFTER (aircraft-specific)
const trackedFlight = props.selectedFlight ||
                      props.trackedAircraft[0] ||
                      props.flights[0];
```

---

## Acceptance Criteria

1. ✅ User clicks "TRACK" button on aircraft in flight table
2. ✅ Aircraft becomes `selectedFlight` in state
3. ✅ User opens AI Assistant (Commander Atlas)
4. ✅ Panel is resizable by dragging edges/corners
5. ✅ Panel is movable by dragging header
6. ✅ User asks: "what is the pressure?"
7. ✅ MCP tool uses tracked aircraft's real altitude
8. ✅ User asks: "predict trajectory"
9. ✅ MCP tool uses tracked aircraft's real position/heading
10. ✅ All responses use real OpenSky data, not mock data

---

## Technical Specifications

### Resizable Implementation
```vue
<div class="panel-container"
     :style="{
       width: panelWidth + 'px',
       height: panelHeight + 'px',
       left: panelX + 'px',
       top: panelY + 'px'
     }">
  <!-- Resize handles -->
  <div class="resize-handle resize-n" @mousedown="startResize('n')"></div>
  <div class="resize-handle resize-s" @mousedown="startResize('s')"></div>
  <div class="resize-handle resize-e" @mousedown="startResize('e')"></div>
  <div class="resize-handle resize-w" @mousedown="startResize('w')"></div>
  <div class="resize-handle resize-ne" @mousedown="startResize('ne')"></div>
  <div class="resize-handle resize-nw" @mousedown="startResize('nw')"></div>
  <div class="resize-handle resize-se" @mousedown="startResize('se')"></div>
  <div class="resize-handle resize-sw" @mousedown="startResize('sw')"></div>
</div>
```

### Draggable Implementation
```vue
<div class="panel-header"
     @mousedown="startDrag"
     style="cursor: move">
  <h2>Commander Atlas</h2>
</div>
```

### State Management
```javascript
const panelState = ref({
  width: 900,    // Default width
  height: 600,   // Default height
  x: 100,        // Default x position
  y: 100,        // Default y position
  minWidth: 600,
  minHeight: 400,
  maxWidth: window.innerWidth - 100,
  maxHeight: window.innerHeight - 100
});

// Persist to localStorage
watch(panelState, (newState) => {
  localStorage.setItem('ai-panel-state', JSON.stringify(newState));
}, { deep: true });
```

---

## Styling Updates

### Make Panel Absolutely Positioned
```css
.ai-panel-dual {
  position: fixed;  /* Change from fixed center to absolute */
  /* Remove: left: 50%, top: 50%, transform: translate(-50%, -50%) */
  /* Add dynamic positioning */
  left: var(--panel-x);
  top: var(--panel-y);
  width: var(--panel-width);
  height: var(--panel-height);
  z-index: 1000;
}
```

### Resize Handle Styling
```css
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-n, .resize-s {
  width: 100%;
  height: 4px;
  cursor: ns-resize;
}

.resize-e, .resize-w {
  width: 4px;
  height: 100%;
  cursor: ew-resize;
}

.resize-n { top: 0; left: 0; }
.resize-s { bottom: 0; left: 0; }
.resize-e { top: 0; right: 0; }
.resize-w { top: 0; left: 0; }

/* Corners */
.resize-ne, .resize-nw, .resize-se, .resize-sw {
  width: 12px;
  height: 12px;
}

.resize-ne { top: 0; right: 0; cursor: nesw-resize; }
.resize-nw { top: 0; left: 0; cursor: nwse-resize; }
.resize-se { bottom: 0; right: 0; cursor: nwse-resize; }
.resize-sw { bottom: 0; left: 0; cursor: nesw-resize; }
```

---

## MCP Tool Integration

### Updated determineToolExecution
```javascript
const determineToolExecution = (query) => {
  // Get tracked aircraft (priority order)
  const trackedFlight = props.selectedFlight ||
                        (props.trackedAircraft && props.trackedAircraft[0]) ||
                        props.flights[0];

  if (!trackedFlight) {
    console.warn('No tracked aircraft available');
    return null;
  }

  if (query.includes('fuel') || query.includes('consumption')) {
    return {
      toolName: 'analyze_fuel_consumption',
      params: {
        flight_id: trackedFlight.id || trackedFlight.icao24,
        current_fuel_level: 5000,  // Would come from real data
        fuel_capacity: 8000,
        distance_traveled: 500,
        distance_remaining: 300,
        current_altitude: Number(trackedFlight.altitude) || 35000,
        airspeed: Number(trackedFlight.speed) || 450
      }
    };
  }

  if (query.includes('pressure') || query.includes('cabin')) {
    return {
      toolName: 'detect_pressure_anomaly',
      params: {
        cabin_pressure: 11.3,
        current_altitude: Number(trackedFlight.altitude) || 35000,
        rate_of_change: 0.1
      }
    };
  }

  if (query.includes('trajectory') || query.includes('path')) {
    const position = trackedFlight.path && trackedFlight.path.length > 0
      ? {
          lat: Number(trackedFlight.path[0][0]) || trackedFlight.lat,
          lon: Number(trackedFlight.path[0][1]) || trackedFlight.lon,
          altitude: Number(trackedFlight.altitude) || 35000
        }
      : {
          lat: Number(trackedFlight.lat) || 33.7490,
          lon: Number(trackedFlight.lon) || -84.3880,
          altitude: Number(trackedFlight.altitude) || 35000
        };

    return {
      toolName: 'predict_trajectory',
      params: {
        current_position: position,
        velocity: {
          groundspeed: Number(trackedFlight.speed) || 450,
          vertical_rate: Number(trackedFlight.verticalRate) || 0
        },
        heading: Number(trackedFlight.heading) || 90
      }
    };
  }

  if (query.includes('status') || query.includes('systems')) {
    return {
      toolName: 'get_aircraft_status',
      params: {
        flight_id: trackedFlight.id || trackedFlight.icao24 || 'unknown',
        systems_data: {
          fuel: { percentage: 65 },
          pressure: { normal: true },
          electrical: { voltage: 28 },
          hydraulics: { pressure: 3000 }
        }
      }
    };
  }

  return null;
};
```

---

## User Experience Flow

### Scenario 1: Track Aircraft from Table
1. User sees flight "RPA4632" in Active Flights table
2. Clicks "TRACK" button → `trackedAircraft` array updated
3. Opens AI Assistant → Panel opens in default position
4. Asks "what is the current altitude?" → Uses RPA4632's real altitude
5. Asks "predict trajectory" → Uses RPA4632's real position/heading/speed

### Scenario 2: Reposition Panel
1. Panel opens (default: center-left)
2. User grabs header, drags to bottom-right
3. Position persists via localStorage
4. Next session: Opens in same position

### Scenario 3: Resize Panel
1. Panel is too large, blocking map
2. User grabs bottom-right corner resize handle
3. Drags to make panel smaller
4. Size persists via localStorage
5. Panel now shows tracked aircraft without obstruction

---

## Testing Checklist

- [ ] Panel is resizable from all 8 handles
- [ ] Panel is draggable from header
- [ ] Position persists across page reloads
- [ ] Size persists across page reloads
- [ ] Min/max constraints work
- [ ] Tracked aircraft data flows to MCP tools
- [ ] All 4 tools use tracked aircraft data
- [ ] Query: "pressure" uses tracked aircraft altitude
- [ ] Query: "trajectory" uses tracked aircraft position/heading
- [ ] Query: "fuel" uses tracked aircraft altitude/speed
- [ ] Query: "status" uses tracked aircraft ID
- [ ] No mock data used when aircraft is tracked
- [ ] Graceful fallback if no aircraft tracked

---

## Files to Modify

1. ✅ `src/App.vue` - Pass trackedAircraft & selectedFlight props
2. `src/modules/ai-chat/AIChatModuleDualPanel.vue` - Add resizable/draggable
3. `src/modules/ai-chat/composables/useDraggable.js` - NEW composable
4. `src/modules/ai-chat/composables/useResizable.js` - NEW composable
5. `src/modules/ai-chat/AIChatModuleDualPanel.vue` - Update tool execution

---

## Branch Strategy

- **Main branch**: `module-agent`
- **Feature branch 1**: `feature/dual-panel-ai-chat-figma` (design mockups)
- **Feature branch 2**: `feature/dual-panel-ai-chat-query` ✅ (implementation)

---

*This redesign transforms the dual-panel chat from a fixed, generic tool into a dynamic, aircraft-specific command center for real-time aerospace monitoring.*
