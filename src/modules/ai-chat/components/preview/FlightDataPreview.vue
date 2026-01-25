<template>
  <div class="flight-data-preview">
    <!-- Flight Header Card -->
    <div class="preview-card flight-header">
      <div class="flight-identity">
        <div class="callsign">
          <svg
            class="plane-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <span class="callsign-text">{{ data.callsign || 'Unknown' }}</span>
        </div>

        <span
          v-if="data.status"
          class="status-badge"
          :class="getStatusClass(data.status)"
        >
          {{ data.status }}
        </span>
      </div>

      <div
        v-if="data.route"
        class="route-display"
      >
        <span class="airport-code">{{ data.route.from || data.from }}</span>
        <svg
          class="arrow-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
        <span class="airport-code">{{ data.route.to || data.to }}</span>
      </div>
    </div>

    <!-- Flight Metrics Grid -->
    <div class="metrics-grid">
      <div
        v-if="data.altitude"
        class="metric-card"
      >
        <div class="metric-icon altitude">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-label">Altitude</span>
          <span class="metric-value">{{ formatAltitude(data.altitude) }}</span>
        </div>
      </div>

      <div
        v-if="data.speed || data.velocity"
        class="metric-card"
      >
        <div class="metric-icon speed">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-label">Speed</span>
          <span class="metric-value">{{ formatSpeed(data.speed || data.velocity) }}</span>
        </div>
      </div>

      <div
        v-if="data.heading"
        class="metric-card"
      >
        <div class="metric-icon heading">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :style="{ transform: `rotate(${data.heading}deg)` }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-label">Heading</span>
          <span class="metric-value">{{ data.heading }}°</span>
        </div>
      </div>

      <div
        v-if="data.distance"
        class="metric-card"
      >
        <div class="metric-icon distance">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-label">Distance</span>
          <span class="metric-value">{{ formatDistance(data.distance) }}</span>
        </div>
      </div>
    </div>

    <!-- Fuel Status (if available) -->
    <div
      v-if="data.fuelStatus || data.fuelRemaining"
      class="preview-card fuel-status"
    >
      <h4>Fuel Status</h4>
      <div class="fuel-info">
        <div
          v-if="data.fuelStatus"
          class="fuel-status-badge"
          :class="getFuelStatusClass(data.fuelStatus)"
        >
          {{ data.fuelStatus }}
        </div>
        <div
          v-if="data.fuelRemaining !== undefined"
          class="fuel-remaining"
        >
          <span class="fuel-label">Remaining:</span>
          <span class="fuel-value">{{ data.fuelRemaining }} kg</span>
        </div>
        <div
          v-if="data.fuelPercentage !== undefined"
          class="fuel-bar"
        >
          <div
            class="fuel-fill"
            :style="{ width: `${data.fuelPercentage}%` }"
            :class="getFuelBarClass(data.fuelPercentage)"
          />
          <span class="fuel-percentage">{{ data.fuelPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Systems Health (if available) -->
    <div
      v-if="data.systems"
      class="preview-card systems-health"
    >
      <h4>Systems Health</h4>
      <div class="systems-grid">
        <div
          v-for="(status, system) in data.systems"
          :key="system"
          class="system-item"
        >
          <div
            class="system-indicator"
            :class="getSystemStatusClass(status)"
          />
          <span class="system-name">{{ formatSystemName(system) }}</span>
          <span class="system-status">{{ typeof status === 'object' ? status.status : status }}</span>
        </div>
      </div>
    </div>

    <!-- Additional Info (if available) -->
    <div
      v-if="hasAdditionalInfo"
      class="preview-card additional-info"
    >
      <h4>Additional Information</h4>
      <div class="info-grid">
        <div
          v-if="data.airline"
          class="info-item"
        >
          <span class="info-label">Airline:</span>
          <span class="info-value">{{ data.airline }}</span>
        </div>
        <div
          v-if="data.aircraft"
          class="info-item"
        >
          <span class="info-label">Aircraft:</span>
          <span class="info-value">{{ data.aircraft }}</span>
        </div>
        <div
          v-if="data.eta"
          class="info-item"
        >
          <span class="info-label">ETA:</span>
          <span class="info-value">{{ data.eta }}</span>
        </div>
        <div
          v-if="data.progress !== undefined"
          class="info-item"
        >
          <span class="info-label">Progress:</span>
          <span class="info-value">{{ Math.round(data.progress * 100) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const hasAdditionalInfo = computed(() => {
  return props.data.airline || props.data.aircraft || props.data.eta || props.data.progress !== undefined;
});

const formatAltitude = (altitude) => {
  const alt = parseInt(altitude, 10);
  return `${alt.toLocaleString()} ft`;
};

const formatSpeed = (speed) => {
  const spd = parseInt(speed, 10);
  return `${spd} kts`;
};

const formatDistance = (distance) => {
  const dist = parseInt(distance, 10);
  return `${dist.toLocaleString()} km`;
};

const formatSystemName = (system) => {
  return system.charAt(0).toUpperCase() + system.slice(1).replace(/_/g, ' ');
};

const getStatusClass = (status) => {
  const statusMap = {
    'on-time': 'status-success',
    'delayed': 'status-warning',
    'cancelled': 'status-error',
    'departed': 'status-info',
    'arrived': 'status-success'
  };
  return statusMap[status?.toLowerCase()] || 'status-default';
};

const getFuelStatusClass = (status) => {
  const statusMap = {
    'NORMAL': 'fuel-normal',
    'LOW': 'fuel-warning',
    'CRITICAL': 'fuel-critical'
  };
  return statusMap[status] || 'fuel-normal';
};

const getFuelBarClass = (percentage) => {
  if (percentage <= 20) return 'fuel-critical';
  if (percentage <= 40) return 'fuel-warning';
  return 'fuel-normal';
};

const getSystemStatusClass = (status) => {
  const statusValue = typeof status === 'object' ? status.status : status;
  const normalized = statusValue?.toString().toLowerCase();

  if (normalized === 'normal' || normalized === 'ok' || normalized === 'operational') {
    return 'status-ok';
  }
  if (normalized === 'warning' || normalized === 'degraded') {
    return 'status-warning';
  }
  if (normalized === 'critical' || normalized === 'failed' || normalized === 'error') {
    return 'status-critical';
  }
  return 'status-unknown';
};
</script>

<style scoped>
.flight-data-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.preview-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  animation: fadeIn 0.3s ease;
}

.preview-card h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin: 0 0 var(--spacing-3) 0;
}

/* Flight Header */
.flight-header {
  background: linear-gradient(135deg, var(--color-primary-alpha-10), var(--color-surface));
  border-color: var(--color-primary-alpha-30);
}

.flight-identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.callsign {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.plane-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.callsign-text {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.status-badge {
  padding: 4px var(--spacing-3);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-success {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.status-warning {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.status-info {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.status-default {
  background: var(--color-white-alpha-10);
  color: var(--color-text-secondary);
}

.route-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.airport-code {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.arrow-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-3);
}

.metric-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
  transition: all 0.2s ease;
}

.metric-card:hover {
  border-color: var(--color-primary-alpha-40);
  background: var(--color-primary-alpha-10);
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
}

.metric-icon.altitude {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.metric-icon.speed {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.metric-icon.heading {
  background: var(--color-info);
  color: white;
}

.metric-icon.distance {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

/* Fuel Status */
.fuel-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.fuel-status-badge {
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  width: fit-content;
}

.fuel-normal {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.fuel-warning {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.fuel-critical {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.fuel-remaining {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fuel-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.fuel-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.fuel-bar {
  position: relative;
  height: 32px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.fuel-fill {
  height: 100%;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: var(--spacing-2);
}

.fuel-percentage {
  position: absolute;
  right: var(--spacing-2);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  z-index: 1;
}

/* Systems Health */
.systems-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.system-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-base);
}

.system-indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.status-ok {
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
}

.status-warning {
  background: var(--color-warning);
  box-shadow: 0 0 8px var(--color-warning);
}

.status-critical {
  background: var(--color-error);
  box-shadow: 0 0 8px var(--color-error);
}

.status-unknown {
  background: var(--color-text-tertiary);
}

.system-name {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.system-status {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
}

/* Additional Info */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-white);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
