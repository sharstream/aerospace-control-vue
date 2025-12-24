<template>
  <div class="flight-monitoring-card">
    <div
      class="flight-card-header"
      :style="{ borderLeftColor: airlines[flight.airline].color }"
      @click="$emit('toggle-detail')"
    >
      <div
        class="flight-card-logo"
        :style="{ color: airlines[flight.airline].color }"
      >
        {{ airlines[flight.airline].logo }}
      </div>
      <div class="flight-card-info">
        <div class="flight-card-title">{{ flight.name }}</div>
        <div class="flight-card-subtitle">{{ airlines[flight.airline].name }} • {{ flight.aircraft }}</div>
      </div>
      <div :class="['system-badge', systemHealth.statusClass]">
        {{ systemHealth.label }}
      </div>
    </div>

    <div class="flight-card-stats">
      <div class="flight-stat">
        <span class="stat-label">Route:</span>
        <span class="stat-value">{{ flight.from }} → {{ flight.to }}</span>
      </div>
      <div class="flight-stat">
        <span class="stat-label">Status:</span>
        <span :class="['stat-value', 'status-' + flight.statusClass]">{{ flight.status }}</span>
      </div>
      <div class="flight-stat">
        <span class="stat-label">Altitude:</span>
        <span class="stat-value">{{ flight.altitude }}</span>
      </div>
      <div class="flight-stat">
        <span class="stat-label">Passengers:</span>
        <span class="stat-value">{{ flight.passengers }}</span>
      </div>
    </div>

    <div class="health-bar">
      <div
        :class="['health-fill', systemHealth.statusClass]"
        :style="{ width: systemHealth.health + '%' }"
      ></div>
    </div>
    <div class="health-text">{{ systemHealth.health }}% Systems Health • Click for Details</div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FlightMonitoringCard',
  props: {
    flight: {
      type: Object,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    },
    systemHealth: {
      type: Object,
      required: false,
      default: () => ({
        health: 95,
        statusClass: 'operational',
        label: 'Operational'
      })
    }
  },
  emits: ['toggle-detail']
};
</script>

<style scoped>
.flight-monitoring-card {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.4) 0%, rgba(31, 31, 31, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.flight-monitoring-card:hover {
  border-color: rgba(74, 157, 215, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.flight-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-left: 4px solid;
  cursor: pointer;
  transition: background 0.2s ease;
}

.flight-card-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.flight-card-logo {
  font-size: 32px;
  flex-shrink: 0;
}

.flight-card-info {
  flex: 1;
}

.flight-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.flight-card-subtitle {
  font-size: 11px;
  color: #888;
}

.system-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.system-badge.operational {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.system-badge.warning {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.system-badge.critical {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.flight-card-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.flight-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 600;
}

.stat-value.status-on-time {
  color: #4ade80;
}

.stat-value.status-delayed {
  color: #fbbf24;
}

.stat-value.status-boarding {
  color: #3b82f6;
}

.health-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 24px;
}

.health-fill {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.health-fill.operational {
  background: linear-gradient(90deg, #4ade80, #22c55e);
  box-shadow: 0 0 8px #4ade80;
}

.health-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 8px #fbbf24;
}

.health-fill.critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  box-shadow: 0 0 8px #ef4444;
}

.health-text {
  text-align: center;
  padding: 12px 24px 20px;
  font-size: 11px;
  color: #888;
}
</style>
