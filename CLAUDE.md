# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aerospace Control System** - A Vue 3 application for aerospace airline visualization and control, featuring real-time flight tracking, weather monitoring, analytics, and AI assistance. This is a complete refactor from static HTML to modern Vue 3 architecture with Vite.

## Common Commands

```bash
# Development
npm run dev              # Start Vite development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint on .js and .vue files
npm run lint:fix         # Auto-fix ESLint issues
```

## Architecture

### Root Orchestrator Pattern

`App.vue` serves as the main orchestrator:
- Manages global state (flights, active view, selected flight)
- Coordinates module loading and data flow
- Handles navigation between modules
- Provides centralized event handling

### State Management with Pinia

The application uses Pinia for centralized state management. The main store is `src/stores/flights.js`:

**Critical Pattern**: When accessing Pinia store properties in Vue components during async operations, always use `storeToRefs` to avoid proxy disconnection errors:

```js
import { storeToRefs } from 'pinia';

setup() {
  const store = useFlightsStore();
  const { lastUpdate } = storeToRefs(store);  // Extract refs
  const formatted = computed(() => lastUpdate.value?.toLocaleTimeString());
  return { formatted };
}
```

**Why**: Race conditions during async API calls can cause `Uncaught Error: disconnected port object` when accessing Pinia proxies directly. Use `storeToRefs` for safe reactive ref access.

### Module Structure

Each feature tab is organized as a self-contained module in `src/modules/`:
- `map/` - Leaflet-based map with flight visualization
- `dashboard/` - Flight operations dashboard with KPIs
- `flights/` - Detailed flight list and management
- `weather/` - Weather monitoring and hazard zones
- `analytics/` - Flight analytics and performance metrics
- `settings/` - Application settings and configuration
- `ai-chat/` - AI assistant (Commander Atlas)

Module pattern:
```
module-name/
├── ModuleName.vue          # Main module component
├── components/             # Module-specific components
└── composables/            # Module-specific logic (optional)
```

### Path Aliases (vite.config.js)

- `@` → `src/`
- `@modules` → `src/modules/`
- `@shared` → `src/shared/`
- `@components` → `src/components/`
- `@assets` → `src/assets/`

### Shared Resources (`src/shared/`)

- **data/** - Static data exports (airlines, aircraft models, airports, flights, weather)
- **utils/** - Utility functions (bearing/distance calculations, system context)
- **composables/** - Reusable Vue composition logic (currently unused, reserved for future)

### Real-Time Flight Tracking

The application supports two data modes:
1. **Mock Data** - Static flight data for development/demo
2. **Real-Time Data** - Live aircraft tracking via backend API

**Backend Integration** (`src/services/api.js`):
- Connects to FastAPI backend at `http://localhost:8000` (configurable via `VITE_API_BASE_URL`)
- OAuth2 authentication handled entirely by backend (frontend doesn't manage tokens)
- Rate limiting aware with automatic retry countdown
- 10-second polling interval when real-time mode is active
- 45-second cache TTL on backend to minimize API credit usage

**Flight Store Actions**:
- `toggleDataSource()` - Switch between mock and real-time data
- `fetchRealTimeData()` - Poll backend for latest aircraft positions
- `startFlightAnimation()` / `stopFlightAnimation()` - Control animation loop
- `updateAllFlightPositions()` - Advance flight progress along routes

**Trajectory Tracking** (Optional Enhancement):
- Real-time waypoint collection via `useTrajectoryTracking` composable
- See `.cursor/documentation/REAL_TIME_TRACKING_GUIDE.md` for implementation details

### Flight Animation System

Flight positions are interpolated along great-circle routes:
- Each flight has a `progress` value (0 to 1) representing position along route
- Animation loop increments progress by flight `speed` every 50ms
- `src/shared/utils/calculations.js` contains bearing and distance calculations
- Map module renders aircraft icons rotated to correct bearing

## File Naming Conventions

- **Components**: PascalCase (e.g., `MapModule.vue`, `FlightCard.vue`)
- **Other files**: kebab-case (e.g., `flight-data.js`, `calculations.js`)
- **Test files**: Adjacent `__tests__/` directory with `.test.js` extension

## Code Standards

### Principles
- **Simplicity over cleverness** - Prefer readability and explicit intent
- **Single Responsibility** - Each class/component/function has one primary purpose
- **Maximum cyclomatic complexity** - Target ≤10 per function (ESLint-style counting)

### Documentation
- Use JSDoc syntax for all new functions, classes, and components
- Explain **why** something is done, not what (unless non-obvious)

### Testing
- Use Vitest for all tests
- Tests go in `__tests__/` directory adjacent to tested file
- Test file naming: `ComponentName.test.js` matches `ComponentName.vue`
- Ensure tests are self-contained and independent

### Naming
- camelCase for variables and functions
- PascalCase for classes and components

## Accessibility Requirements

All components must meet accessibility standards per `.cursor/rules/accessibility.mdc`:

### ARIA Attributes
- Use appropriate roles, labels, and states
- Include `aria-expanded` for collapsible elements
- Use `aria-hidden` for decorative elements

### Keyboard Navigation
- Support Tab for sequential navigation
- Implement arrow keys for lists/menus
- Handle Enter/Space for activation
- Support Escape for closing dialogs

### Focus Management
- Trap focus within modals
- Return focus to trigger element on close
- Maintain logical focus order

### Component Patterns
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.) before adding ARIA
- Maintain proper heading hierarchy (`<h1>` through `<h6>`)
- Ensure sufficient color contrast and visible focus indicators

## PR Creation Workflow

When creating PRs (per `.cursor/rules/pr.mdc`):

### Required Format
**Title**: `@W-{number}: Short description` (NO conventional commit prefixes like `feat:`, `fix:`)
**Multiple work items**: `@W-123, @W-456: Description`

### Required Sections in PR Body
1. **Description** - What changed and why it matters
2. **Notable Changes** - Key technical changes (avoid minutiae)
3. **Testing Instructions** - How to test the changes
4. **Accessibility Report Card** - Results of accessibility checklist:
   - ARIA attributes verification
   - Keyboard navigation support
   - Focus management implementation
   - Component patterns compliance
   - Semantic HTML usage
   - Screen reader support
5. **GUS Tickets** - Leave completely empty (no placeholder text)

### PR Creation Steps
1. Run code review against project standards
2. Perform accessibility check using guidelines from `accessibility.mdc`
3. Show proposed title and description to user for confirmation
4. Create PR with `gh pr create`

## Security Considerations

- Validate and sanitize all external inputs (user input, API responses)
- Use parameterized queries/prepared statements to prevent injection attacks
- Avoid revealing sensitive information in error messages
- No hardcoded credentials or API keys in code

## Known Issues

**Pinia Proxy Disconnection** (Fixed - Dec 2024):
- **Issue**: `Uncaught Error: disconnected port object` during async store updates
- **Cause**: Race condition accessing Pinia proxy during async API calls
- **Fix**: Use `storeToRefs` pattern (see State Management section above)
- **Affected**: `src/modules/settings/SettingsModule.vue`

## Migration Context

This project was refactored from static HTML to Vue 3:
- **Preserved**: All business logic, Leaflet implementation, flight animation algorithms, bearing calculations, visual design
- **Changed**: Static HTML → Vue SFCs, inline scripts → modular components, global variables → reactive state, direct DOM manipulation → Vue reactivity
