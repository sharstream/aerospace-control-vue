# Application Structure - Aerospace Control System

Complete architectural overview of the Vue 3 application.

## Root Component: App.vue

**Path**: `src/App.vue`
**Role**: Main orchestrator and state manager

### Layout Structure

```
App Container (Full viewport)
├── MapModule (Base Layer - Always Visible)
│   ├── Leaflet Map
│   ├── Aircraft Markers
│   └── Weather Zones
├── MapControls (Conditional - Map View Only)
├── AirspaceLegend (Conditional - Map View Only)
├── FlightsDataTable (Conditional - Map View Only)
├── Module Overlays (Conditional - Based on activeView)
│   ├── DashboardModule
│   ├── FlightsModule
│   ├── WeatherModule
│   ├── AnalyticsModule
│   └── SettingsModule
├── AIChatModule (Floating Panel)
├── AI FAB Button (Fixed Bottom Right)
├── BottomNavigation (Fixed Bottom)
└── ToastNotification (Global Overlay)
```

### State Management

**Local State** (`data()`)
- `activeView`: Current active module ('map', 'dashboard', 'flights', etc.)
- `selectedFlight`: Currently selected flight object
- `aiPanelVisible`: AI chat panel visibility
- `flightsTableCollapsed`: Flights table collapse state
- `bottomNavCollapsed`: Bottom navigation collapse state
- `trackedAircraft`: Array of tracked aircraft ICAO24 codes

**Computed Properties**
- `flights`: Retrieved from Pinia store
- `aiFabButtonBottom`: Dynamic FAB button position based on UI state

**Static Data**
- `airlines`: Airline information (logo, name, color)
- `aircraftModels`: Aircraft model specifications
- `weatherHazards`: Weather hazard zones

### View Switching Logic

```javascript
activeView Values:
- 'map': Shows map controls, legend, and flights table
- 'dashboard': Shows dashboard overlay
- 'flights': Shows flights module overlay
- 'weather': Shows weather module overlay
- 'analytics': Shows analytics module overlay
- 'settings': Shows settings module overlay
```

### Event Flow

1. **Navigation**: BottomNavigation emits `change-view` → App updates `activeView`
2. **Flight Selection**: MapModule emits `flight-click` → App sets `selectedFlight` and switches to dashboard
3. **Flight Tracking**: FlightsDataTable emits `track-aircraft` → App adds to `trackedAircraft` array
4. **AI Panel**: FAB button click → App toggles `aiPanelVisible`
5. **Collapse States**: Components emit `collapse-state-change` → App updates collapse states

## View Hierarchy

### Base Layer (Always Visible)
- **MapModule**: Leaflet map with OpenStreetMap tiles
- Z-index: 1 (base)

### Map View Components (activeView === 'map')
- **MapControls**: Z-index: 100
- **AirspaceLegend**: Z-index: 100
- **FlightsDataTable**: Z-index: 200

### Module Overlays (activeView === module name)
- **All Modules**: Z-index: 800
- Full-screen overlays with backdrop blur
- Background: `rgba(26, 26, 26, 0.95)` with `backdrop-filter: blur(8px)`

### Floating Elements
- **AIChatModule**: Z-index: 900 (when visible)
- **AI FAB Button**: Z-index: 1000
- **BottomNavigation**: Z-index: 1000
- **ToastNotification**: Z-index: 1100

## Responsive Behavior

### FAB Button Positioning
```javascript
Base position: 160px from bottom
- Adjusts -70px when bottomNavCollapsed
- Adjusts +360px when flightsTableCollapsed === false
```

### Collapse States
- **Bottom Navigation**: Can collapse to hide, toggle button remains visible
- **Flights Table**: Can collapse to minimize, affects FAB button position

## Data Flow

### Flight Animation
```
Pinia Store (flights.js)
├── startFlightAnimation() - Starts 50ms interval
├── updateAllFlightPositions() - Updates progress values
└── stopFlightAnimation() - Clears interval
```

### Real-Time Data
```
SettingsModule
├── Toggle data source (mock/real-time)
├── Pinia store updates flights array
└── All components react to flights changes
```

## Styling Architecture

### Global Styles (`main.css`)
- CSS Reset
- Typography (System fonts)
- Color variables
- Navigation styles
- FAB button styles
- Scrollbar styling
- Animations (fadeIn, slideIn, pulse)

### Component Styles
- Scoped CSS per component
- Consistent design tokens
- Dark theme throughout
- Glassmorphism effects (backdrop-filter)

## Performance Considerations

### Conditional Rendering
- Modules only rendered when active (v-if)
- Map always rendered but overlays conditionally shown
- Reduces DOM nodes and improves performance

### Animation Loop
- Single 50ms interval for all flight updates
- Managed by Pinia store
- Cleanup on component unmount

### Event Bus
- Toast notifications use event bus pattern
- Decoupled notification system

## File Size & Bundle

### Main Bundle
- App.vue: Core orchestrator
- All modules loaded on demand
- Leaflet library (~150KB)
- Pinia state management (~10KB)

### Static Resources
- No external images (uses SVG icons)
- No external fonts (system fonts)
- Minimal CSS footprint

## Development Patterns

### Component Communication
1. **Props Down**: Parent passes data to children
2. **Events Up**: Children emit events to parent
3. **Store**: Shared state via Pinia
4. **Event Bus**: Global notifications

### Code Organization
```
src/
├── App.vue (Orchestrator)
├── modules/ (Feature modules)
├── components/ (Shared components)
├── stores/ (Pinia stores)
├── composables/ (Reusable logic)
├── config/ (Constants & labels)
├── services/ (API & utilities)
└── shared/ (Data & utilities)
```

## Key Features

### Multi-View Architecture
- Single-page application
- View-based routing (no Vue Router)
- Smooth transitions between views

### Real-Time Updates
- Flight position animation
- Live data source toggle
- WebSocket-ready architecture

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Adaptive UI elements
- Touch-friendly controls

## Figma Design Recommendations

### Frame Structure
```
Aerospace Control App (1920x1080)
├── Map Base Layer
├── Map Controls (Floating)
├── Airspace Legend (Floating)
├── Flights Table (Collapsible Panel)
├── Dashboard Overlay (Full Screen)
├── Flights Overlay (Full Screen)
├── Weather Overlay (Full Screen)
├── Analytics Overlay (Full Screen)
├── Settings Overlay (Full Screen)
├── AI Chat Panel (Floating Side Panel)
├── AI FAB Button (Fixed)
├── Bottom Navigation (Fixed)
└── Toast Notifications (Floating)
```

### Component States
- Create variants for each module view
- Include collapsed/expanded states
- Show active/inactive navigation states
- Include loading and error states

### Interaction Flows
1. Navigation between modules
2. Flight selection and tracking
3. AI panel open/close
4. Table collapse/expand
5. Toast notification appearance

### Design System
- Use design tokens from `01-DESIGN-TOKENS.md`
- Maintain consistent spacing
- Apply glassmorphism effects
- Use dark theme colors
