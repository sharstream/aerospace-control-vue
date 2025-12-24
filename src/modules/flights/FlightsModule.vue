<template>
  <div class="flights-view active">
    <div class="flights-header">
      <h1 class="flights-title">Active Flights</h1>
      <p class="flights-subtitle">{{ flights.length }} aircraft currently in the air</p>
    </div>

    <div class="flights-list-container">
      <div
        v-for="flight in flights"
        :key="flight.name"
        class="flight-list-item"
      >
        <div
          class="flight-item-header"
          @click="toggleFlightDetails(flight.name)"
        >
          <div
            class="flight-item-logo"
            :style="{ background: airlines[flight.airline].color }"
          >
            {{ airlines[flight.airline].logo }}
          </div>
          <div class="flight-item-info">
            <div class="flight-item-name">{{ flight.name }}</div>
            <div class="flight-item-airline">
              {{ airlines[flight.airline].name }} • {{ flight.aircraft }}
            </div>
          </div>
          <div
            v-if="flight.systems"
            :class="['systems-health-badge', flight.systems.overall.statusClass]"
          >
            {{ flight.systems.overall.label }}
          </div>
          <div :class="['flight-item-status', flight.statusClass]">
            {{ flight.status }}
          </div>
        </div>

        <div class="flight-item-details">
          <div class="flight-detail-row">
            <span class="detail-label">Route:</span>
            <span class="detail-value route-value">
              <span class="route-airport">{{ flight.from }}</span>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
              <span class="route-airport">{{ flight.to }}</span>
            </span>
          </div>

          <div class="flight-detail-row">
            <span class="detail-label">Altitude:</span>
            <span class="detail-value">{{ flight.altitude }}</span>
          </div>

          <div class="flight-detail-row">
            <span class="detail-label">Passengers:</span>
            <span class="detail-value">{{ flight.passengers }}</span>
          </div>

          <div class="flight-detail-row">
            <span class="detail-label">Departure:</span>
            <span class="detail-value">{{ flight.departure }}</span>
          </div>

          <div
            v-if="flight.systems"
            class="flight-health-section"
          >
            <div class="health-bar-container">
              <div
                :class="['health-bar-fill', flight.systems.overall.statusClass]"
                :style="{ width: flight.systems.overall.health + '%' }"
              >
              </div>
            </div>
            <div class="health-text">
              {{ flight.systems.overall.health }}% Systems Health • Click for Details
            </div>
          </div>

          <div
            v-if="flight.bottleneck"
            class="bottleneck-alert"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            Bottleneck Detected
          </div>
        </div>

        <!-- Expanded Detail View -->
        <transition name="expand">
          <div
            v-if="expandedFlight === flight.name"
            class="flight-expanded-view"
          >
            <!-- Aircraft Visualization -->
            <div class="aircraft-visual-section">
              <div class="aircraft-info-badge">
                {{ flight.aircraft }}
              </div>
              <div class="aircraft-icon">✈️</div>
            </div>

            <!-- Flight Progress Info -->
            <div class="flight-progress-section">
              <div class="progress-info-grid">
                <div class="progress-info-item">
                  <div class="progress-label">FLIGHT NUMBER</div>
                  <div class="progress-value">{{ flight.name }}</div>
                </div>
                <div class="progress-info-item">
                  <div class="progress-label">DEPARTURE</div>
                  <div class="progress-value">{{ flight.departure }}</div>
                </div>
                <div class="progress-info-item">
                  <div class="progress-label">ARRIVAL (ETA)</div>
                  <div class="progress-value">{{ flight.arrival }}</div>
                </div>
                <div class="progress-info-item">
                  <div class="progress-label">GATE / TERMINAL</div>
                  <div class="progress-value">{{ flight.gate }} / {{ flight.terminal }}</div>
                </div>
                <div class="progress-info-item">
                  <div class="progress-label">PROGRESS</div>
                  <div class="progress-value">{{ Math.round(flight.progress * 100) }}%</div>
                </div>
                <div class="progress-info-item">
                  <div class="progress-label">CURRENT ALTITUDE</div>
                  <div class="progress-value">{{ flight.altitude }}</div>
                </div>
              </div>
            </div>

            <!-- Cabin Layout Section -->
            <div
              v-if="flight.systems"
              class="cabin-section"
            >
              <div class="section-header">
                <span class="section-title">CABIN LAYOUT & PASSENGER MANIFEST</span>
                <span class="section-subtitle">
                  {{ flight.passengers }} / {{ getTotalSeats(flight.aircraft) }} Seats
                  ({{ Math.round((flight.passengers / getTotalSeats(flight.aircraft)) * 100) }}% Full)
                </span>
              </div>
              <div class="cabin-visual">
                <div class="cabin-deck">
                  <div class="deck-label">FLIGHT DECK</div>
                  <div class="seat-row">
                    <div class="row-number">0</div>
                    <div class="seat flight-deck">👨‍✈️</div>
                    <div class="seat flight-deck">👨‍✈️</div>
                  </div>
                </div>
                <div class="cabin-deck">
                  <div class="deck-label">FIRST CLASS</div>
                  <div
                    v-for="row in 2"
                    :key="'fc-' + row"
                    class="seat-row"
                  >
                    <div class="row-number">{{ row }}</div>
                    <div class="seat first-class occupied">👤</div>
                    <div class="seat first-class occupied">👤</div>
                  </div>
                </div>
                <div class="cabin-deck">
                  <div class="deck-label">ECONOMY CLASS</div>
                  <div
                    v-for="row in 8"
                    :key="'ec-' + row"
                    class="seat-row"
                  >
                    <div class="row-number">{{ row + 6 }}</div>
                    <div
                      v-for="col in 3"
                      :key="'l-' + col"
                      :class="['seat', getSeatStatus(row, col)]"
                    >
                      <span v-if="getSeatStatus(row, col) === 'occupied'">👤</span>
                    </div>
                    <div class="aisle"></div>
                    <div
                      v-for="col in 3"
                      :key="'r-' + col"
                      :class="['seat', getSeatStatus(row, col + 3)]"
                    >
                      <span v-if="getSeatStatus(row, col + 3) === 'occupied'">👤</span>
                    </div>
                  </div>
                </div>
                <div class="cabin-legend">
                  <div class="legend-item">
                    <div class="legend-box occupied"></div>
                    <span>Occupied</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-box available"></div>
                    <span>Available</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-box first-class"></div>
                    <span>First Class</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-box flight-deck"></div>
                    <span>Flight Deck</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Systems Monitoring Section -->
            <div
              v-if="flight.systems"
              class="systems-section"
            >
              <div class="systems-grid">
                <div
                  v-for="(system, key) in getSystemsList(flight.systems)"
                  :key="key"
                  :class="['system-card', system.statusClass]"
                >
                  <div class="system-card-header">
                    <div class="system-card-title">
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path :d="system.icon" />
                      </svg>
                      {{ system.name }}
                    </div>
                    <div :class="['system-status-badge', system.statusClass]">
                      {{ system.status }}
                    </div>
                  </div>
                  <div class="system-card-body">
                    <div
                      v-for="(value, metric) in system.metrics"
                      :key="metric"
                      class="system-metric"
                    >
                      <span class="metric-label">{{ metric }}</span>
                      <span :class="['metric-value', getMetricClass(value)]">{{ value }}</span>
                    </div>
                    <div class="system-health-bar">
                      <div
                        :class="['system-health-fill', system.statusClass]"
                        :style="{ width: system.health + '%' }"
                      >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlightsModule',
  props: {
    flights: {
      type: Array,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expandedFlight: null
    };
  },
  methods: {
    toggleFlightDetails(flightName) {
      this.expandedFlight = this.expandedFlight === flightName ? null : flightName;
    },
    getSystemsList(systems) {
      const { overall, ...systemsList } = systems;
      return systemsList;
    },
    getTotalSeats(aircraft) {
      const seatMap = {
        A320neo: 180,
        'B777-300ER': 332,
        'B787-9': 290,
        'A350-900': 325,
        'B737-800': 175,
        'A330-300': 277
      };
      return seatMap[aircraft] || 200;
    },
    getSeatStatus(row, col) {
      const seed = (row * 7 + col * 11) % 10;
      return seed < 7 ? 'occupied' : 'available';
    },
    getMetricClass(value) {
      if (typeof value === 'string') {
        if (value.includes('ONLINE') || value === 'ON') return 'normal';
        if (value.includes('OFFLINE') || value.includes('HIGH')) return 'critical';
        const numMatch = value.match(/(\d+)/);
        if (numMatch && value.includes('%')) {
          const num = parseInt(numMatch[1]);
          if (num < 70) return 'critical';
          if (num < 85) return 'warning';
        }
      }
      return '';
    }
  }
};
</script>

<style scoped>
.flights-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  padding-bottom: 90px;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(10, 22, 40, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  backdrop-filter: blur(8px);
  z-index: 800;
}

.flights-header {
  margin-bottom: 24px;
}

.flights-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.flights-subtitle {
  font-size: 15px;
  color: #888;
  margin: 0;
  font-weight: 400;
}

.flights-list-container {
  display: grid;
  gap: 16px;
}

.flight-list-item {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.flight-list-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.02), transparent);
  pointer-events: none;
}

.flight-list-item:hover {
  border-color: rgba(74, 157, 215, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.flight-item-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: background 0.2s ease;
}

.flight-item-header:hover {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.flight-item-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.flight-item-info {
  flex: 1;
}

.flight-item-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.flight-item-airline {
  font-size: 13px;
  color: #888;
}

.systems-health-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 8px;
}

.systems-health-badge.operational {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.systems-health-badge.warning {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.systems-health-badge.critical {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.flight-item-status {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flight-item-status.on-time {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.flight-item-status.delayed {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.flight-item-status.boarding {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.flight-item-details {
  display: grid;
  gap: 12px;
}

.flight-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 600;
}

.route-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.route-airport {
  color: #4a9dd7;
  font-weight: 700;
}

.route-value svg {
  color: #666;
}

.flight-health-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.health-bar-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.health-bar-fill {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.health-bar-fill.operational {
  background: linear-gradient(90deg, #4ade80, #22c55e);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

.health-bar-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
}

.health-bar-fill.critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.health-text {
  font-size: 11px;
  color: #888;
  text-align: center;
}

.bottleneck-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

/* Expanded View Styles */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 3000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.flight-expanded-view {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(74, 157, 215, 0.2);
}

.aircraft-visual-section {
  position: relative;
  background: linear-gradient(135deg, rgba(74, 157, 215, 0.15) 0%, rgba(74, 157, 215, 0.05) 100%);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
}

.aircraft-info-badge {
  background: rgba(74, 157, 215, 0.2);
  color: #4a9dd7;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid rgba(74, 157, 215, 0.4);
}

.aircraft-icon {
  font-size: 96px;
  opacity: 0.9;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.flight-progress-section {
  background: linear-gradient(135deg, rgba(26, 38, 50, 0.6) 0%, rgba(20, 30, 40, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.progress-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.progress-info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.progress-value {
  font-size: 15px;
  color: #e0e0e0;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.cabin-section {
  background: linear-gradient(135deg, rgba(26, 38, 50, 0.6) 0%, rgba(20, 30, 40, 0.6) 100%);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #4a9dd7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 12px;
  color: #888;
  font-weight: 600;
}

.cabin-visual {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cabin-deck {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deck-label {
  font-size: 10px;
  font-weight: 700;
  color: #4a9dd7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.row-number {
  width: 24px;
  font-size: 10px;
  color: #666;
  text-align: right;
  font-weight: 600;
}

.seat {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 1px solid;
  transition: all 0.2s ease;
  cursor: pointer;
}

.seat:hover {
  transform: scale(1.15);
}

.seat.occupied {
  background: #4a7ba7;
  border-color: #5a8dc7;
  box-shadow: 0 2px 4px rgba(74, 123, 167, 0.3);
}

.seat.available {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.seat.first-class {
  background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%);
  border-color: #e5c047;
  box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
}

.seat.flight-deck {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #f87171;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.aisle {
  width: 16px;
}

.cabin-legend {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #b0b0b0;
}

.legend-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid;
}

.legend-box.occupied {
  background: #4a7ba7;
  border-color: #5a8dc7;
}

.legend-box.available {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.legend-box.first-class {
  background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%);
  border-color: #e5c047;
}

.legend-box.flight-deck {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #f87171;
}

.systems-section {
  margin-top: 24px;
}

.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.system-card {
  background: linear-gradient(135deg, rgba(26, 38, 50, 0.6) 0%, rgba(20, 30, 40, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.system-card:hover {
  border-color: rgba(74, 157, 215, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.system-card.operational {
  border-color: rgba(74, 222, 128, 0.2);
}

.system-card.warning {
  border-color: rgba(251, 191, 36, 0.3);
}

.system-card.critical {
  border-color: rgba(239, 68, 68, 0.3);
}

.system-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.system-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.system-card-title svg {
  color: #4a9dd7;
}

.system-status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.system-status-badge.operational {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.system-status-badge.warning {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.system-status-badge.critical {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.system-card-body {
  padding: 20px;
}

.system-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.system-metric:last-of-type {
  border-bottom: none;
}

.metric-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 13px;
  color: #e0e0e0;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.metric-value.normal {
  color: #4ade80;
}

.metric-value.warning {
  color: #fbbf24;
}

.metric-value.critical {
  color: #ef4444;
}

.system-health-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
}

.system-health-fill {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.system-health-fill.operational {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.system-health-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.system-health-fill.critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

@media (max-width: 768px) {
  .flights-view {
    padding: 20px;
  }

  .flights-title {
    font-size: 26px;
  }

  .flight-item-header {
    flex-wrap: wrap;
  }

  .systems-health-badge {
    order: 3;
    margin-right: 0;
    margin-top: 8px;
  }

  .flight-item-status {
    order: 2;
  }

  .progress-info-grid {
    grid-template-columns: 1fr;
  }

  .systems-grid {
    grid-template-columns: 1fr;
  }

  .aircraft-icon {
    font-size: 64px;
  }
}
</style>
