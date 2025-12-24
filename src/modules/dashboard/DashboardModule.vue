<template>
  <div class="dashboard-view active">
    <!-- Top KPI Cards -->
    <div class="kpi-dashboard">
      <!-- Total Flights -->
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
            </svg>
          </div>
          <div class="kpi-trend up">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            ><path d="M7 14l5-5 5 5z" /></svg>
            +12%
          </div>
        </div>
        <div class="kpi-label">Total Active Flights</div>
        <div class="kpi-value">{{ systemContext.totalFlights }}</div>
        <div class="kpi-subtitle">Across {{ systemContext.activeAirlines }} carriers worldwide</div>
        <div class="kpi-progress-bar">
          <div
            class="kpi-progress-fill"
            :style="{ width: (systemContext.totalFlights/80)*100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- On-Time Performance -->
      <div class="kpi-card success">
        <div class="kpi-header">
          <div
            class="kpi-icon"
            style="background: rgba(74, 222, 128, 0.15); color: #4ade80;"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div class="kpi-trend up">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            ><path d="M7 14l5-5 5 5z" /></svg>
            +5.2%
          </div>
        </div>
        <div class="kpi-label">On-Time Performance (OTP)</div>
        <div class="kpi-value">{{ systemContext.onTimePercentage }}%</div>
        <div class="kpi-subtitle">{{ systemContext.onTimeFlights }} flights on schedule</div>
        <div class="kpi-progress-bar">
          <div
            class="kpi-progress-fill"
            :style="{ width: systemContext.onTimePercentage + '%', background: 'linear-gradient(90deg, #4ade80, #22c55e)' }"
          ></div>
        </div>
      </div>

      <!-- Delayed Flights -->
      <div
        class="kpi-card"
        :class="{ warning: systemContext.delayedFlights > 5 }"
      >
        <div class="kpi-header">
          <div
            class="kpi-icon"
            style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <div class="kpi-trend down">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            ><path d="M7 10l5 5 5-5z" /></svg>
            -2.1%
          </div>
        </div>
        <div class="kpi-label">Delayed Operations</div>
        <div class="kpi-value">{{ systemContext.delayedFlights }}</div>
        <div class="kpi-subtitle">Avg delay: 32 minutes</div>
        <div class="kpi-progress-bar">
          <div
            class="kpi-progress-fill"
            :style="{ width: (systemContext.delayedFlights/systemContext.totalFlights)*100 + '%', background: 'linear-gradient(90deg, #f59e0b, #d97706)' }"
          ></div>
        </div>
      </div>

      <!-- Total Passengers -->
      <div class="kpi-card">
        <div class="kpi-header">
          <div class="kpi-icon">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
          <div class="kpi-trend up">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            ><path d="M7 14l5-5 5 5z" /></svg>
            +8.4%
          </div>
        </div>
        <div class="kpi-label">Total Passengers</div>
        <div class="kpi-value">{{ systemContext.totalPassengers.toLocaleString() }}</div>
        <div class="kpi-subtitle">Average load factor: 84.2%</div>
        <div class="kpi-progress-bar">
          <div
            class="kpi-progress-fill"
            style="width: 84%"
          ></div>
        </div>
      </div>
    </div>

    <div class="dashboard-content-grid">
      <!-- Left Column: Metrics & Charts -->
      <div class="metrics-column">
        <!-- Aerospace Industry Metrics -->
        <div class="aerospace-metrics-grid">
          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(74, 157, 215, 0.15); color: #4a9dd7;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M23,11.01L18,11c-0.55,0-1,0.45-1,1v9c0,0.55,0.45,1,1,1h5c0.55,0,1-0.45,1-1v-9C24,11.46,23.55,11.01,23,11.01z M23,20h-5v-7h5V20z" /><path d="M20,2H2v20h15v-2H4V4h14v5h2V2z" /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Avg Altitude</div>
              <div class="metric-value-large">{{ systemContext.avgAltitude.toLocaleString() }} ft</div>
            </div>
          </div>

          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(74, 222, 128, 0.15); color: #4ade80;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Fuel Efficiency</div>
              <div class="metric-value-large">93.7%</div>
            </div>
          </div>

          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z" /><circle
                cx="12"
                cy="12"
                r="5"
              /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Airspace Density</div>
              <div class="metric-value-large">68.4%</div>
            </div>
          </div>

          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Weather Alerts</div>
              <div class="metric-value-large">3 Active</div>
            </div>
          </div>

          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(236, 72, 153, 0.15); color: #ec4899;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z" /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Avg Flight Time</div>
              <div class="metric-value-large">4.2 hrs</div>
            </div>
          </div>

          <div class="metric-tile">
            <div
              class="metric-icon-circle"
              style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              ><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            </div>
            <div class="metric-info">
              <div class="metric-title">Incidents (24h)</div>
              <div class="metric-value-large">0</div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="chart-container">
          <div class="chart-header">
            <div class="chart-title">System Status</div>
            <div style="display: flex; gap: 12px;">
              <span class="status-indicator operational">
                <span class="status-dot"></span>
                ATC Systems
              </span>
              <span class="status-indicator operational">
                <span class="status-dot"></span>
                Navigation
              </span>
              <span class="status-indicator operational">
                <span class="status-dot"></span>
                Weather Data
              </span>
            </div>
          </div>
        </div>

        <!-- Performance Chart -->
        <div class="chart-container">
          <div class="chart-header">
            <div class="chart-title">On-Time Performance Trend (24h)</div>
            <div class="chart-legend">
              <div class="chart-legend-item">
                <div
                  class="chart-legend-dot"
                  style="background: #4ade80;"
                ></div>
                On-Time
              </div>
              <div class="chart-legend-item">
                <div
                  class="chart-legend-dot"
                  style="background: #f59e0b;"
                ></div>
                Delayed
              </div>
              <div class="chart-legend-item">
                <div
                  class="chart-legend-dot"
                  style="background: #ef4444;"
                ></div>
                Critical
              </div>
            </div>
          </div>
          <div class="chart-canvas">
            <div style="padding: 60px; text-align: center; color: #666;">
              <svg
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 24 24"
                style="opacity: 0.5;"
              >
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
              </svg>
              <div style="margin-top: 12px; font-size: 13px;">Real-time performance monitoring</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Flight List -->
      <div class="flight-list-column">
        <h2 class="section-title">Active Flights - Aircraft Systems Monitoring</h2>
        <div
          v-for="flight in flights"
          :key="flight.name"
          class="flight-card"
          :class="flight.statusClass"
          @click="selectFlight(flight)"
        >
          <div class="flight-card-header">
            <div class="flight-number">
              <span class="airline-logo">{{ airlines[flight.airline]?.logo }}</span>
              <div>
                <span style="display: block;">{{ flight.name }}</span>
                <span style="font-size: 12px; opacity: 0.7; font-weight: normal;">{{ airlines[flight.airline]?.name }}</span>
              </div>
            </div>
            <span
              class="flight-status"
              :class="flight.statusClass"
            >
              {{ flight.status }}
            </span>
          </div>

          <div class="flight-route">
            <div class="route-point">
              <div class="route-code">{{ flight.from }}</div>
              <div class="route-city">{{ airports[flight.from]?.city }}</div>
            </div>
            <div class="route-arrow">→</div>
            <div class="route-point">
              <div class="route-code">{{ flight.to }}</div>
              <div class="route-city">{{ airports[flight.to]?.city }}</div>
            </div>
          </div>

          <div class="flight-details">
            <div class="detail-item">
              <span class="detail-label">Aircraft</span>
              <span class="detail-value">{{ flight.aircraft }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Altitude</span>
              <span class="detail-value">{{ flight.altitude }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Gate</span>
              <span class="detail-value">{{ flight.gate }}</span>
            </div>
          </div>

          <div class="flight-progress-bar">
            <div
              class="flight-progress-fill"
              :style="{ width: (flight.progress * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Flight Detail (if needed later) -->
    <div
      v-if="selectedFlight"
      class="flight-detail-panel"
    >
      <!-- Detailed view can be added here -->
    </div>
  </div>
</template>

<script>
import { airports } from '@shared/data/airports';
import { getSystemContext } from '@shared/utils/calculations';

export default {
  name: 'DashboardModule',
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
      currentSelectedFlight: null,
      airports
    };
  },
  computed: {
    systemContext() {
      return getSystemContext(this.flights, this.airlines);
    }
  },
  methods: {
    selectFlight(flight) {
      this.currentSelectedFlight = flight;
    }
  }
};
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

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  color: #fff;
  margin: 0 0 8px 0;
}

.dashboard-subtitle {
  color: #999;
  margin: 0;
}

/* KPI Cards */
.kpi-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.kpi-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(74, 157, 215, 0.2);
  position: relative;
  overflow: hidden;
}

.kpi-card.success {
  border-color: rgba(74, 222, 128, 0.3);
}

.kpi-card.warning {
  border-color: rgba(245, 158, 11, 0.3);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(74, 157, 215, 0.15);
  color: #4a9dd7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon svg {
  width: 24px;
  height: 24px;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.kpi-trend.up {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
}

.kpi-trend.down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.kpi-trend svg {
  width: 14px;
  height: 14px;
}

.kpi-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.kpi-subtitle {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.kpi-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.kpi-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a9dd7, #60a5fa);
  border-radius: 2px;
}

/* Dashboard Content Grid */
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

/* Metrics Column */
.metrics-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.aerospace-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.metric-tile {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon-circle svg {
  width: 20px;
  height: 20px;
}

.metric-info {
  min-width: 0;
}

.metric-title {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.metric-value-large {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #fff;
}

.status-indicator.operational {
  color: #4ade80;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.chart-legend {
  display: flex;
  gap: 12px;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #999;
}

.chart-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

/* Flight List Column */
.flight-list-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.flight-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(74, 157, 215, 0.2);
}

.flight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(74, 157, 215, 0.3);
  border-color: #4a9dd7;
}

.flight-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.flight-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.airline-logo {
  font-size: 20px;
}

.flight-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.flight-status.on-time {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.flight-status.delayed {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.flight-status.boarding {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

.flight-route {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.route-point {
  flex: 1;
}

.route-code {
  font-size: 16px;
  font-weight: 600;
  color: #4a9dd7;
}

.route-city {
  font-size: 12px;
  color: #999;
}

.route-arrow {
  font-size: 20px;
  color: #4a9dd7;
}

.flight-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}

.detail-value {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.flight-progress-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.flight-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a9dd7 0%, #60a5fa 100%);
  transition: width 0.3s ease;
}
</style>
