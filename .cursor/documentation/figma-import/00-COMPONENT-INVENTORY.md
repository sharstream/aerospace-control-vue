# Component Inventory - Aerospace Control System

Complete inventory of all Vue 3 components in the aerospace control application.

## Component Hierarchy

```
App.vue (Root Orchestrator)
├── MapModule.vue (Base Layer - Always Visible)
│   ├── MapControls.vue
│   └── AirspaceLegend.vue
├── FlightsDataTable.vue (Map View Only)
├── DashboardModule.vue (Dashboard View)
│   ├── DashboardKPIs.vue
│   ├── DashboardMetrics.vue
│   ├── DashboardCharts.vue
│   └── FlightList.vue
├── FlightsModule.vue (Flights View)
├── WeatherModule.vue (Weather View)
├── AnalyticsModule.vue (Analytics View)
│   ├── FlightMonitoringCard.vue
│   ├── SystemsMonitoring.vue
│   └── CabinVisualization.vue
├── SettingsModule.vue (Settings View)
│   ├── AIAssistantSettings.vue
│   ├── DataSourceConfiguration.vue
│   ├── DataSourceToggle.vue
│   ├── BackendStatusCard.vue
│   └── RateLimitStatusCard.vue
├── AIChatModule.vue (Floating Panel)
├── BottomNavigation.vue (Fixed Navigation)
├── FlightsTrackingPill.vue (Shared)
└── Common Components
    ├── ToastNotification.vue
    ├── WeatherHazardCard.vue
    ├── ReportSection.vue
    └── DelayAnalysisTable.vue
```

## Module Components (7)

### 1. MapModule.vue
- **Path**: `src/modules/map/MapModule.vue`
- **Purpose**: Leaflet-based interactive map with flight visualization
- **Type**: Base layer component (always rendered)
- **Props**: flights, weatherHazards, selectedFlight
- **Features**: Aircraft markers, flight paths, weather zones, real-time tracking

### 2. DashboardModule.vue
- **Path**: `src/modules/dashboard/DashboardModule.vue`
- **Purpose**: Flight operations dashboard with KPIs and metrics
- **Type**: Full-screen overlay
- **Props**: flights, airlines, aircraftModels, selectedFlight
- **Features**: KPI cards, metrics grid, performance charts, flight list

### 3. FlightsModule.vue
- **Path**: `src/modules/flights/FlightsModule.vue`
- **Purpose**: Detailed flight list and management
- **Type**: Full-screen overlay
- **Props**: flights, airlines
- **Features**: Comprehensive flight data table, filtering, sorting

### 4. WeatherModule.vue
- **Path**: `src/modules/weather/WeatherModule.vue`
- **Purpose**: Weather monitoring and hazard zones
- **Type**: Full-screen overlay
- **Props**: weatherHazards, flights
- **Features**: Weather cards, hazard zones, impact analysis

### 5. AnalyticsModule.vue
- **Path**: `src/modules/analytics/AnalyticsModule.vue`
- **Purpose**: Flight analytics and performance metrics
- **Type**: Full-screen overlay
- **Props**: flights, airlines
- **Features**: Performance metrics, system monitoring, cabin visualization

### 6. SettingsModule.vue
- **Path**: `src/modules/settings/SettingsModule.vue`
- **Purpose**: Application settings and configuration
- **Type**: Full-screen overlay
- **Props**: None (uses Pinia store)
- **Features**: Data source toggle, backend status, rate limits, AI settings

### 7. AIChatModule.vue
- **Path**: `src/modules/ai-chat/AIChatModule.vue`
- **Purpose**: AI assistant chat interface (Commander Atlas)
- **Type**: Floating side panel
- **Props**: visible, flights, weatherHazards, airlines, flightsTableCollapsed, bottomNavCollapsed
- **Features**: Chat interface, context-aware responses, collapsible panel

## Map Components (2)

### 1. MapControls.vue
- **Path**: `src/modules/map/components/MapControls.vue`
- **Purpose**: Map control buttons (zoom, layers, etc.)
- **Type**: Overlay control panel
- **Emits**: control-action events

### 2. AirspaceLegend.vue
- **Path**: `src/modules/map/components/AirspaceLegend.vue`
- **Purpose**: Map legend showing airlines and flight status
- **Type**: Overlay legend panel
- **Props**: airlines, flightsTableCollapsed, bottomNavCollapsed
- **Features**: Airline logos, color coding, status indicators

## Dashboard Components (4)

### 1. DashboardKPIs.vue
- **Path**: `src/modules/dashboard/components/DashboardKPIs.vue`
- **Purpose**: Key performance indicator cards
- **Type**: Dashboard section
- **Features**: Total flights, OTP, delays, passengers

### 2. DashboardMetrics.vue
- **Path**: `src/modules/dashboard/components/DashboardMetrics.vue`
- **Purpose**: Aerospace industry metrics grid
- **Type**: Dashboard section
- **Features**: Altitude, fuel efficiency, airspace density, weather alerts

### 3. DashboardCharts.vue
- **Path**: `src/modules/dashboard/components/DashboardCharts.vue`
- **Purpose**: Performance trend charts
- **Type**: Dashboard section
- **Features**: OTP trends, system status indicators

### 4. FlightList.vue
- **Path**: `src/modules/dashboard/components/FlightList.vue`
- **Purpose**: Scrollable list of active flights
- **Type**: Dashboard section
- **Features**: Flight cards, route info, progress bars, status badges

## Analytics Components (3)

### 1. FlightMonitoringCard.vue
- **Path**: `src/modules/analytics/components/FlightMonitoringCard.vue`
- **Purpose**: Individual flight monitoring card
- **Type**: Analytics card
- **Features**: Real-time flight data, system status

### 2. SystemsMonitoring.vue
- **Path**: `src/modules/analytics/components/SystemsMonitoring.vue`
- **Purpose**: Aircraft systems health monitoring
- **Type**: Analytics panel
- **Features**: System status indicators, health metrics

### 3. CabinVisualization.vue
- **Path**: `src/modules/analytics/components/CabinVisualization.vue`
- **Purpose**: Cabin layout and passenger visualization
- **Type**: Analytics visualization
- **Features**: Seat map, occupancy, cabin zones

## Settings Components (5)

### 1. AIAssistantSettings.vue
- **Path**: `src/modules/settings/components/AIAssistantSettings.vue`
- **Purpose**: AI assistant configuration
- **Type**: Settings section
- **Features**: AI preferences, model selection

### 2. DataSourceConfiguration.vue
- **Path**: `src/components/settings/DataSourceConfiguration.vue`
- **Purpose**: Data source setup and configuration
- **Type**: Settings section
- **Features**: API endpoints, authentication, data refresh

### 3. DataSourceToggle.vue
- **Path**: `src/components/settings/DataSourceToggle.vue`
- **Purpose**: Toggle between mock and real-time data
- **Type**: Settings control
- **Features**: Switch control, status indicator

### 4. BackendStatusCard.vue
- **Path**: `src/components/settings/BackendStatusCard.vue`
- **Purpose**: Backend API connection status
- **Type**: Status card
- **Features**: Connection status, health check, error messages

### 5. RateLimitStatusCard.vue
- **Path**: `src/components/settings/RateLimitStatusCard.vue`
- **Purpose**: API rate limit monitoring
- **Type**: Status card
- **Features**: Credit usage, remaining credits, reset time

## Navigation & Layout Components (2)

### 1. BottomNavigation.vue
- **Path**: `src/components/BottomNavigation.vue`
- **Purpose**: Main navigation bar
- **Type**: Fixed bottom navigation
- **Props**: activeView, flightCount
- **Features**: Tab navigation, badges, collapse toggle, active indicators

### 2. FlightsDataTable.vue
- **Path**: `src/components/FlightsDataTable.vue`
- **Purpose**: Collapsible flight data table (map view)
- **Type**: Overlay table panel
- **Props**: flights, airlines, bottomNavCollapsed, trackedAircraft
- **Features**: Flight list, track/untrack, collapse, search

## Shared/Common Components (5)

### 1. ToastNotification.vue
- **Path**: `src/components/common/ToastNotification.vue`
- **Purpose**: Toast notification system
- **Type**: Global notification overlay
- **Features**: Success/error/warning toasts, auto-dismiss, animations

### 2. WeatherHazardCard.vue
- **Path**: `src/components/common/WeatherHazardCard.vue`
- **Purpose**: Weather hazard display card
- **Type**: Reusable card component
- **Props**: hazard data
- **Features**: Hazard type, severity, affected area

### 3. ReportSection.vue
- **Path**: `src/components/common/ReportSection.vue`
- **Purpose**: Reusable report section wrapper
- **Type**: Layout component
- **Props**: title, collapsible
- **Features**: Section header, collapsible content

### 4. DelayAnalysisTable.vue
- **Path**: `src/components/common/DelayAnalysisTable.vue`
- **Purpose**: Flight delay analysis table
- **Type**: Data table component
- **Props**: delays data
- **Features**: Delay reasons, duration, affected flights

### 5. FlightsTrackingPill.vue
- **Path**: `src/components/FlightsTrackingPill.vue`
- **Purpose**: Tracking status indicator pill
- **Type**: Status badge component
- **Props**: tracking status
- **Features**: Live indicator, tracking count

## Component Statistics

- **Total Components**: 29
- **Module Components**: 7
- **Sub-components**: 17
- **Shared Components**: 5
- **Navigation Components**: 2

## Component Patterns

### Layout Patterns
- **Full-screen overlays**: Dashboard, Flights, Weather, Analytics, Settings modules
- **Fixed positioning**: BottomNavigation, AI FAB button
- **Floating panels**: AIChatModule, FlightsDataTable
- **Base layer**: MapModule (always visible)

### State Management
- **Pinia Store**: flights.js (flight data, animation, data source)
- **Props/Events**: Parent-child communication
- **Local State**: Component-specific state (collapsed, selected, etc.)

### Styling Approach
- **Scoped styles**: Component-specific CSS
- **Global styles**: main.css for shared tokens
- **Dark theme**: Consistent dark color scheme throughout
- **Glassmorphism**: Backdrop blur effects on overlays

## File Organization

```
src/
├── App.vue                          # Root orchestrator
├── modules/                         # Feature modules
│   ├── map/                        # Map module
│   │   ├── MapModule.vue
│   │   └── components/
│   │       ├── MapControls.vue
│   │       └── AirspaceLegend.vue
│   ├── dashboard/                  # Dashboard module
│   │   ├── DashboardModule.vue
│   │   └── components/
│   │       ├── DashboardKPIs.vue
│   │       ├── DashboardMetrics.vue
│   │       ├── DashboardCharts.vue
│   │       └── FlightList.vue
│   ├── flights/                    # Flights module
│   │   └── FlightsModule.vue
│   ├── weather/                    # Weather module
│   │   └── WeatherModule.vue
│   ├── analytics/                  # Analytics module
│   │   ├── AnalyticsModule.vue
│   │   └── components/
│   │       ├── FlightMonitoringCard.vue
│   │       ├── SystemsMonitoring.vue
│   │       └── CabinVisualization.vue
│   ├── settings/                   # Settings module
│   │   ├── SettingsModule.vue
│   │   └── components/
│   │       └── AIAssistantSettings.vue
│   └── ai-chat/                    # AI Chat module
│       └── AIChatModule.vue
└── components/                      # Shared components
    ├── BottomNavigation.vue
    ├── FlightsDataTable.vue
    ├── FlightsTrackingPill.vue
    ├── settings/
    │   ├── DataSourceConfiguration.vue
    │   ├── DataSourceToggle.vue
    │   ├── BackendStatusCard.vue
    │   └── RateLimitStatusCard.vue
    └── common/
        ├── ToastNotification.vue
        ├── WeatherHazardCard.vue
        ├── ReportSection.vue
        └── DelayAnalysisTable.vue
```

## Next Steps

Refer to the following documents for detailed specifications:
- `01-DESIGN-TOKENS.md` - Design system tokens
- `02-APP-STRUCTURE.md` - Application architecture
- `03-MODULE-DASHBOARD.md` - Dashboard module details
- `04-MODULE-MAP.md` - Map module details
- `05-MODULE-FLIGHTS.md` - Flights module details
- `06-MODULE-WEATHER.md` - Weather module details
- `07-MODULE-ANALYTICS.md` - Analytics module details
- `08-MODULE-SETTINGS.md` - Settings module details
- `09-MODULE-AI-CHAT.md` - AI Chat module details
- `10-SHARED-COMPONENTS.md` - Shared components details
