<template>
  <div
    id="app"
    class="app-container"
  >
    <!-- Map Module (always visible as base layer) -->
    <MapModule
      ref="mapModule"
      :flights="flights"
      :weatherHazards="weatherHazards"
      :selectedFlight="selectedFlight"
      @flight-click="handleFlightClick"
    />

    <!-- Map Controls and Legend (only visible when Live Map tab is active) -->
    <template v-if="activeView === 'map'">
      <MapControls
        key="map-controls"
        @control-action="handleMapControl"
      />
      <AirspaceLegend
        key="airspace-legend"
        :airlines="airlines"
        :flightsTableCollapsed="flightsTableCollapsed"
        :bottomNavCollapsed="bottomNavCollapsed"
      />
      <FlightsDataTable
        ref="flightsDataTable"
        key="flights-table"
        :flights="flights"
        :airlines="airlines"
        :bottomNavCollapsed="bottomNavCollapsed"
        :trackedAircraft="trackedAircraft"
        @view-all="changeView('flights')"
        @flight-click="handleFlightTableClick"
        @track-aircraft="handleTrackAircraft"
        @untrack-aircraft="handleUntrackAircraft"
        @collapse-state-change="handleFlightsTableCollapseChange"
      />
    </template>

    <!-- Dashboard View Overlay -->
    <DashboardModule
      v-if="activeView === 'dashboard'"
      key="dashboard"
      :flights="flights"
      :airlines="airlines"
      :aircraftModels="aircraftModels"
      :selectedFlight="selectedFlight"
    />

    <!-- Flights View Overlay -->
    <FlightsModule
      v-if="activeView === 'flights'"
      key="flights"
      :flights="flights"
      :airlines="airlines"
    />

    <!-- Weather Module -->
    <WeatherModule
      v-if="activeView === 'weather'"
      key="weather"
      :weatherHazards="weatherHazards"
      :flights="flights"
    />

    <!-- Analytics Module -->
    <AnalyticsModule
      v-if="activeView === 'analytics'"
      key="analytics"
      :flights="flights"
      :airlines="airlines"
    />

    <!-- Settings Module -->
    <SettingsModule
      v-if="activeView === 'settings'"
      key="settings"
    />

    <!-- AI Chat Panel -->
    <AIChatModule
      :visible="aiPanelVisible"
      :flights="flights"
      :weatherHazards="weatherHazards"
      :airlines="airlines"
      :flightsTableCollapsed="flightsTableCollapsed"
      :bottomNavCollapsed="bottomNavCollapsed"
      @close="aiPanelVisible = false"
    />

    <!-- AI FAB Button -->
    <button
      class="ai-fab-button"
      :class="{ active: aiPanelVisible }"
      :style="{ bottom: aiFabButtonBottom }"
      title="AI Assistant"
      @click="toggleAIPanel"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
      </svg>
    </button>

    <!-- Bottom Navigation -->
    <BottomNavigation
      ref="bottomNavigation"
      :activeView="activeView"
      :flightCount="flights.length"
      @change-view="changeView"
      @collapse-state-change="handleBottomNavCollapseChange"
    />
  </div>
</template>

<script>
import {
  airlines, aircraftModels, weatherHazards
} from '@shared/data';
import MapModule from './modules/map/MapModule.vue';
import MapControls from './modules/map/components/MapControls.vue';
import AirspaceLegend from './modules/map/components/AirspaceLegend.vue';
import DashboardModule from './modules/dashboard/DashboardModule.vue';
import FlightsModule from './modules/flights/FlightsModule.vue';
import WeatherModule from './modules/weather/WeatherModule.vue';
import AnalyticsModule from './modules/analytics/AnalyticsModule.vue';
import SettingsModule from './modules/settings/SettingsModule.vue';
import AIChatModule from './modules/ai-chat/AIChatModule.vue';
import BottomNavigation from './components/BottomNavigation.vue';
import FlightsDataTable from './components/FlightsDataTable.vue';
import { useUsageTracking } from './composables/useUsageTracking';
import { useFlightsStore } from './stores/flights';

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
  setup() {
    const flightsStore = useFlightsStore();
    return { flightsStore };
  },
  data() {
    return {
      airlines,
      aircraftModels,
      weatherHazards,
      activeView: 'map',
      selectedFlight: null,
      aiPanelVisible: false,
      flightsTableCollapsed: true,
      bottomNavCollapsed: false,
      trackedAircraft: [] // Reactive array for tracked aircraft
    };
  },
  computed: {
    flights() {
      return this.flightsStore.flights;
    },
    aiFabButtonBottom() {
      // Base position when bottom nav is shown (moved up 70px for better accessibility)
      let base = 160;

      // Adjust for bottom nav collapse
      if (this.bottomNavCollapsed) {
        base = 90;
      }

      // Move up when flights table is open
      if (!this.flightsTableCollapsed) {
        base += 360;
      }

      return `${base}px`;
    }
  },
  created() {
    // Initialize usage tracking
    this.tracker = useUsageTracking();
  },
  mounted() {
    // Track initial view
    this.tracker.trackViewChange('map');

    // Start flight animation using store
    this.flightsStore.startFlightAnimation();
  },
  beforeUnmount() {
    // Stop flight animation
    this.flightsStore.stopFlightAnimation();

    // Cleanup store
    this.flightsStore.cleanup();
  },
  methods: {
    changeView(view) {
      this.activeView = view;
      this.tracker.trackViewChange(view);
    },
    /**
     * Handle flight click from map markers - opens dashboard
     * @param {Object} flight - Flight object
     */
    handleFlightClick(flight) {
      this.selectedFlight = flight;
      this.activeView = 'dashboard';
      this.tracker.trackFlightClick(flight.id);
      this.tracker.trackViewChange('dashboard');
    },
    /**
     * Handle flight click from FlightsDataTable - tracks on map and shows details
     * @param {Object} flight - Flight object
     */
    handleFlightTableClick(flight) {
      this.selectedFlight = flight;

      // Track analytics
      if (this.tracker && this.tracker.trackFlightClick) {
        this.tracker.trackFlightClick(flight.id);
      }

      // Start tracking aircraft on map
      if (this.$refs.mapModule && flight.icao24) {
        this.$refs.mapModule.startTrackingAircraft(flight);

        // Pan map to aircraft location if available
        if (flight.path && flight.path.length > 0) {
          const currentLat = flight.path[0][0] + (flight.path[1][0] - flight.path[0][0]) * (flight.progress || 0);
          const currentLng = flight.path[0][1] + (flight.path[1][1] - flight.path[0][1]) * (flight.progress || 0);
          this.$refs.mapModule.panToAircraft(currentLat, currentLng);
        }
      }
    },
    toggleAIPanel() {
      const wasVisible = this.aiPanelVisible;
      this.aiPanelVisible = !this.aiPanelVisible;
      if (!wasVisible && this.aiPanelVisible) {
        this.tracker.trackAIPanelOpen();
      }
    },
    handleMapControl(_action) {
      // Handle map control actions
      // You can implement specific behaviors here (zoom, pan, etc.)
    },
    handleFlightsTableCollapseChange(collapsed) {
      this.flightsTableCollapsed = collapsed;
    },
    handleBottomNavCollapseChange(collapsed) {
      this.bottomNavCollapsed = collapsed;
    },
    /**
     * Handle track aircraft request from dropdown menu
     * @param {Object} flight - Flight object
     */
    handleTrackAircraft(flight) {
      // Add to reactive tracked list immediately
      if (flight.icao24 && !this.trackedAircraft.includes(flight.icao24)) {
        this.trackedAircraft.push(flight.icao24);
      }

      // Start tracking on map
      this.handleFlightTableClick(flight);
    },
    /**
     * Handle untrack aircraft request from dropdown menu
     * @param {Object} flight - Flight object
     */
    handleUntrackAircraft(flight) {
      // Remove from reactive tracked list immediately
      if (flight.icao24) {
        const index = this.trackedAircraft.indexOf(flight.icao24);
        if (index > -1) {
          this.trackedAircraft.splice(index, 1);
        }
      }

      // Stop tracking on map
      if (this.$refs.mapModule && flight.icao24) {
        this.$refs.mapModule.stopTrackingAircraft(flight.icao24);
      }
    }
  }
};
</script>

<style>
@import './assets/styles/main.css';
</style>
