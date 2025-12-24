<template>
  <div id="app" class="app-container">
    <!-- Map Module (always visible as base layer) -->
    <MapModule
      :flights="flights"
      :weatherHazards="weatherHazards"
      @flight-click="handleFlightClick"
    />

    <!-- Map Controls and Legend (only visible when Live Map tab is active) -->
    <template v-if="activeView === 'map'">
      <MapControls @control-action="handleMapControl" />
      <AirspaceLegend
        :airlines="airlines"
        :flights-table-collapsed="flightsTableCollapsed"
        :bottom-nav-collapsed="bottomNavCollapsed"
      />
      <FlightsDataTable
        ref="flightsDataTable"
        :flights="flights"
        :airlines="airlines"
        :bottom-nav-collapsed="bottomNavCollapsed"
        @view-all="changeView('flights')"
        @flight-click="handleFlightClick"
        @flight-details="handleFlightClick"
        @collapse-state-change="handleFlightsTableCollapseChange"
      />
    </template>

    <!-- Dashboard View Overlay -->
    <DashboardModule
      v-if="activeView === 'dashboard'"
      :flights="flights"
      :airlines="airlines"
      :aircraftModels="aircraftModels"
      :selectedFlight="selectedFlight"
    />

    <!-- Flights View Overlay -->
    <FlightsModule
      v-if="activeView === 'flights'"
      :flights="flights"
      :airlines="airlines"
    />

    <!-- Weather Module -->
    <WeatherModule
      v-if="activeView === 'weather'"
      :weatherHazards="weatherHazards"
      :flights="flights"
    />

    <!-- Analytics Module -->
    <AnalyticsModule
      v-if="activeView === 'analytics'"
      :flights="flights"
      :airlines="airlines"
    />

    <!-- Settings Module -->
    <SettingsModule
      v-if="activeView === 'settings'"
    />

    <!-- AI Chat Panel -->
    <AIChatModule
      :visible="aiPanelVisible"
      :flights="flights"
      :weatherHazards="weatherHazards"
      :airlines="airlines"
      :flights-table-collapsed="flightsTableCollapsed"
      :bottom-nav-collapsed="bottomNavCollapsed"
      @close="aiPanelVisible = false"
    />

    <!-- AI FAB Button -->
    <button
      class="ai-fab-button"
      :class="{ active: aiPanelVisible }"
      :style="{ bottom: aiFabButtonBottom }"
      @click="toggleAIPanel"
      title="AI Assistant"
    >
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/>
      </svg>
    </button>

    <!-- Bottom Navigation -->
    <BottomNavigation
      ref="bottomNavigation"
      :active-view="activeView"
      :flight-count="flights.length"
      @change-view="changeView"
      @collapse-state-change="handleBottomNavCollapseChange"
    />
  </div>
</template>

<script>
import MapModule from './modules/map/MapModule.vue'
import MapControls from './modules/map/components/MapControls.vue'
import AirspaceLegend from './modules/map/components/AirspaceLegend.vue'
import DashboardModule from './modules/dashboard/DashboardModule.vue'
import FlightsModule from './modules/flights/FlightsModule.vue'
import WeatherModule from './modules/weather/WeatherModule.vue'
import AnalyticsModule from './modules/analytics/AnalyticsModule.vue'
import SettingsModule from './modules/settings/SettingsModule.vue'
import AIChatModule from './modules/ai-chat/AIChatModule.vue'
import BottomNavigation from './components/BottomNavigation.vue'
import FlightsDataTable from './components/FlightsDataTable.vue'
import { flightData, airlines, aircraftModels, weatherHazards } from '@shared/data'
import { useUsageTracking } from './composables/useUsageTracking'

export default {
  name: 'App',
  components: {
    MapModule,
    MapControls,
    AirspaceLegend,
    DashboardModule,
    FlightsModule,
    WeatherModule,
    AnalyticsModule,
    SettingsModule,
    AIChatModule,
    BottomNavigation,
    FlightsDataTable
  },
  data() {
    return {
      flights: [...flightData],
      airlines: airlines,
      aircraftModels: aircraftModels,
      weatherHazards: weatherHazards,
      activeView: 'map',
      selectedFlight: null,
      aiPanelVisible: false,
      animationInterval: null,
      flightsTableCollapsed: true,
      bottomNavCollapsed: false
    }
  },
  created() {
    // Initialize usage tracking
    this.tracker = useUsageTracking()
  },
  mounted() {
    // Track initial view
    this.tracker.trackViewChange('map')

    // Start flight animation loop
    this.animationInterval = setInterval(() => {
      this.flights = this.flights.map(flight => {
        let newProgress = flight.progress + flight.speed

        // Reset if completed
        if (newProgress >= 1) {
          newProgress = 0
        }

        return {
          ...flight,
          progress: newProgress
        }
      })
    }, 50)
  },
  beforeUnmount() {
    // Clear animation interval
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
    }
  },
  computed: {
    aiFabButtonBottom() {
      // Base position when bottom nav is shown
      let base = 90

      // Adjust for bottom nav collapse
      if (this.bottomNavCollapsed) {
        base = 20
      }

      // Move up when flights table is open
      if (!this.flightsTableCollapsed) {
        base += 360
      }

      return `${base}px`
    }
  },
  methods: {
    changeView(view) {
      this.activeView = view
      this.tracker.trackViewChange(view)
    },
    handleFlightClick(flight) {
      this.selectedFlight = flight
      this.activeView = 'dashboard'
      this.tracker.trackFlightClick(flight.id)
      this.tracker.trackViewChange('dashboard')
    },
    toggleAIPanel() {
      const wasVisible = this.aiPanelVisible
      this.aiPanelVisible = !this.aiPanelVisible
      if (!wasVisible && this.aiPanelVisible) {
        this.tracker.trackAIPanelOpen()
      }
    },
    handleMapControl(action) {
      // Handle map control actions
      console.log('Map control action:', action)
      // You can implement specific behaviors here (zoom, pan, etc.)
    },
    handleFlightsTableCollapseChange(collapsed) {
      this.flightsTableCollapsed = collapsed
    },
    handleBottomNavCollapseChange(collapsed) {
      this.bottomNavCollapsed = collapsed
    }
  }
}
</script>

<style>
@import './assets/styles/main.css';
</style>
