<template>
  <div class="dashboard-view active">
    <!-- Top KPI Cards -->
    <DashboardKPIs :system-context="systemContext" />

    <div class="dashboard-content-grid">
      <!-- Left Column: Metrics & Charts -->
      <div class="metrics-column">
        <!-- Aerospace Industry Metrics -->
        <DashboardMetrics :system-context="systemContext" />
        <!-- System Status & Charts -->
        <DashboardCharts />
      </div>

      <!-- Right Column: Flight List -->
      <FlightList
        :flights="flights"
        :airlines="airlines"
        :airports="airports"
        @select-flight="selectFlight"
      />
    </div>

    <!-- Selected Flight Detail (if needed later) -->
    <div v-if="selectedFlight" class="flight-detail-panel">
      <!-- Detailed view can be added here -->
    </div>
  </div>
</template>

<script>
import DashboardKPIs from './components/DashboardKPIs.vue'
import DashboardMetrics from './components/DashboardMetrics.vue'
import DashboardCharts from './components/DashboardCharts.vue'
import FlightList from './components/FlightList.vue'
import { getSystemContext } from '@shared/utils/calculations'

export default {
  name: 'DashboardModule',
  components: {
    DashboardKPIs,
    DashboardMetrics,
    DashboardCharts,
    FlightList
  },
  props: {
    flights: {
      type: Array,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    },
    aircraftModels: {
      type: Object,
      required: true
    },
    selectedFlight: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentSelectedFlight: null
    }
  },
  computed: {
    systemContext() {
      return getSystemContext(this.flights, this.airlines)
    }
  },
  methods: {
    selectFlight(flight) {
      this.currentSelectedFlight = flight
      // Assuming parent might listen to this, but local state was used in original
      // Keeping original behavior logic
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  padding-bottom: 90px;
  overflow-y: auto;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(8px);
  z-index: 800;
  opacity: 1;
  pointer-events: all;
}

.dashboard-content-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-content-grid {
    grid-template-columns: 1fr;
  }
}

.metrics-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
