<template>
  <div class="flight-list-column">
    <h2 class="section-title">Active Flights - Aircraft Systems Monitoring</h2>
    <div
      v-for="flight in flights"
      :key="flight.name"
      class="flight-card"
      :class="flight.statusClass"
      @click="$emit('select-flight', flight)"
    >
      <div class="flight-card-header">
        <div class="flight-number">
          <span class="airline-logo">{{ airlines[flight.airline]?.logo }}</span>
          <div>
            <span style="display: block;">{{ flight.name }}</span>
            <span style="font-size: 12px; opacity: 0.7; font-weight: normal;">{{ airlines[flight.airline]?.name }}</span>
          </div>
        </div>
        <span class="flight-status" :class="flight.statusClass">
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
        <div class="flight-progress-fill" :style="{ width: (flight.progress * 100) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightList',
  props: {
    flights: {
      type: Array,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    },
    airports: {
      type: Object,
      required: true
    }
  },
  emits: ['select-flight']
}
</script>

<style scoped>
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
