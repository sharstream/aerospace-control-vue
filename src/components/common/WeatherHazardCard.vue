<template>
  <div class="outage-card">
    <div class="outage-header">
      <div class="outage-type">{{ hazard.type }}</div>
      <div :class="['outage-severity', `severity-${hazard.severity}`]">
        {{ hazard.severity.toUpperCase() }} SEVERITY
      </div>
    </div>

    <div class="outage-details">
      <div class="outage-detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">
          {{ hazard.center[0].toFixed(2) }}°N, {{ Math.abs(hazard.center[1]).toFixed(2) }}°W
        </span>
      </div>

      <div class="outage-detail-row">
        <span class="detail-label">Radius:</span>
        <span class="detail-value">{{ hazard.radius }} km</span>
      </div>

      <div class="outage-detail-row">
        <span class="detail-label">Impact:</span>
        <span :class="['impact-badge', `impact-${hazard.severity === 'high' ? 'high' : 'medium'}`]">
          {{ affectedFlights.length }} Flight{{ affectedFlights.length !== 1 ? 's' : '' }} Affected
        </span>
      </div>
    </div>

    <div v-if="affectedFlights.length > 0" class="affected-flights">
      <div class="affected-flights-label">AFFECTED FLIGHTS:</div>
      <div class="affected-flights-list">
        <div
          v-for="flight in affectedFlights"
          :key="flight.name"
          class="flight-chip"
        >
          <span class="flight-chip-logo">{{ airlines[flight.airline]?.logo }}</span>
          <span class="flight-chip-name">{{ flight.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherHazardCard',
  props: {
    hazard: {
      type: Object,
      required: true
    },
    affectedFlights: {
      type: Array,
      default: () => []
    },
    airlines: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.outage-card {
  background: linear-gradient(135deg, rgba(51, 51, 51, 0.8) 0%, rgba(42, 42, 42, 0.8) 100%);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 12px;
  border-left: 4px solid #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.outage-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top left, rgba(239, 68, 68, 0.08), transparent);
  pointer-events: none;
}

.outage-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
}

.outage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.outage-type {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.outage-severity {
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 1px solid;
}

.severity-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}

.severity-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
}

.severity-low {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.4);
}

.outage-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.outage-detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b0b0b0;
  font-size: 13px;
  line-height: 1.5;
}

.detail-label {
  font-weight: 600;
  color: #888;
  min-width: 80px;
}

.detail-value {
  color: #e0e0e0;
  font-weight: 500;
}

.impact-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.impact-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}

.impact-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
}

.impact-low {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.4);
}

.affected-flights {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.affected-flights-label {
  color: #888;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.affected-flights-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.flight-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(74, 157, 215, 0.15);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #4a9dd7;
  transition: all 0.2s ease;
}

.flight-chip:hover {
  background: rgba(74, 157, 215, 0.25);
  border-color: #4a9dd7;
  transform: translateY(-2px);
}

.flight-chip-logo {
  font-size: 14px;
}

.flight-chip-name {
  letter-spacing: 0.3px;
}
</style>
