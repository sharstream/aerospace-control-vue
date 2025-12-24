<template>
  <transition name="slide-up">
    <div
      v-if="!collapsed"
      class="flights-data-table"
    >
      <div class="table-header">
        <div class="table-header-content">
          <div class="table-title">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
            </svg>
            <span>Active Flights</span>
            <span class="flight-count">{{ flights.length }}</span>
          </div>
          <button
            class="view-all-btn"
            @click="$emit('view-all')"
          >
            View All
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
        <button
          class="collapse-btn"
          title="Hide Flights Table"
          @click="collapsed = true"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </button>
      </div>

      <div class="table-container">
        <table class="flights-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Route</th>
              <th>Aircraft</th>
              <th>Status</th>
              <th>Altitude</th>
              <th>Systems</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="flight in flights"
              :key="flight.name"
              class="flight-row"
              @click="handleFlightClick(flight)"
            >
              <td class="flight-cell">
                <div class="flight-cell-content">
                  <div
                    class="airline-logo"
                    :style="{ background: airlines[flight.airline].color }"
                  >
                    {{ airlines[flight.airline].logo }}
                  </div>
                  <div class="flight-info">
                    <div class="flight-number">{{ flight.name }}</div>
                    <div class="airline-name">{{ airlines[flight.airline].name }}</div>
                  </div>
                </div>
              </td>
              <td class="route-cell">
                <div class="route-content">
                  <span class="airport">{{ flight.from }}</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                  >
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                  <span class="airport">{{ flight.to }}</span>
                </div>
              </td>
              <td class="aircraft-cell">{{ flight.aircraft }}</td>
              <td>
                <span :class="['status-badge', flight.statusClass]">
                  {{ flight.status }}
                </span>
              </td>
              <td class="altitude-cell">{{ flight.altitude }}</td>
              <td>
                <span
                  v-if="flight.systems"
                  :class="['systems-badge', flight.systems.overall.statusClass]"
                >
                  {{ flight.systems.overall.health }}%
                </span>
                <span
                  v-else
                  class="systems-badge operational"
                >N/A</span>
              </td>
              <td class="action-cell">
                <button
                  class="action-btn"
                  @click.stop="$emit('flight-details', flight)"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </transition>

  <!-- Collapsed Toggle Button -->
  <transition name="fade">
    <button
      v-if="collapsed"
      class="expand-btn"
      @click="collapsed = false"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
      </svg>
      <span>Show Flights ({{ flights.length }})</span>
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>
  </transition>
</template>

<script>
export default {
  name: 'FlightsDataTable',
  props: {
    flights: {
      type: Array,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    },
    bottomNavCollapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-all', 'flight-details', 'flight-click', 'collapse-state-change'],
  data() {
    return {
      collapsed: true
    };
  },
  computed: {
    bottomPosition() {
      return this.bottomNavCollapsed ? '10px' : '80px';
    },
    expandButtonBottom() {
      return this.bottomNavCollapsed ? '20px' : '90px';
    }
  },
  watch: {
    collapsed(newVal) {
      this.$emit('collapse-state-change', newVal);
    }
  },
  methods: {
    handleFlightClick(flight) {
      this.$emit('flight-click', flight);
    }
  }
};
</script>

<style scoped>
.flights-data-table {
  position: absolute;
  bottom: v-bind(bottomPosition);
  left: 16px;
  right: 16px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(74, 157, 215, 0.1);
  z-index: 900;
  max-height: 350px;
  display: flex;
  flex-direction: column;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.table-title svg {
  color: #4a9dd7;
}

.flight-count {
  background: rgba(74, 157, 215, 0.2);
  color: #4a9dd7;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(74, 157, 215, 0.3);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(74, 157, 215, 0.15);
  color: #4a9dd7;
  border: 1px solid rgba(74, 157, 215, 0.3);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(74, 157, 215, 0.25);
  transform: translateX(2px);
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.table-container {
  overflow-y: auto;
  overflow-x: auto;
  max-height: 280px;
}

.flights-table {
  width: 100%;
  border-collapse: collapse;
}

.flights-table thead {
  position: sticky;
  top: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.flights-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.flights-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.flights-table tbody tr:hover {
  background: rgba(74, 157, 215, 0.08);
}

.flights-table td {
  padding: 12px 16px;
  font-size: 13px;
  color: #e0e0e0;
}

.flight-cell {
  min-width: 180px;
}

.flight-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.airline-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.flight-number {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.airline-name {
  font-size: 11px;
  color: #888;
}

.route-cell {
  min-width: 150px;
}

.route-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.airport {
  font-weight: 600;
  color: #4a9dd7;
  font-size: 13px;
}

.route-content svg {
  color: #666;
}

.aircraft-cell {
  min-width: 120px;
  font-size: 12px;
  color: #b0b0b0;
}

.altitude-cell {
  min-width: 100px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-badge.on-time {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.status-badge.delayed {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.boarding {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.systems-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.systems-badge.operational {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.systems-badge.warning {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.systems-badge.critical {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.action-cell {
  width: 60px;
  text-align: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(74, 157, 215, 0.2);
  border-color: rgba(74, 157, 215, 0.3);
  color: #4a9dd7;
}

/* Collapsed State */
.expand-btn {
  position: absolute;
  bottom: v-bind(expandButtonBottom);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(74, 157, 215, 0.25) 0%, rgba(74, 157, 215, 0.15) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(74, 157, 215, 0.3);
  color: #4a9dd7;
  padding: 12px 20px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 900;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.expand-btn:hover {
  background: linear-gradient(135deg, rgba(74, 157, 215, 0.35) 0%, rgba(74, 157, 215, 0.25) 100%);
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* Scrollbar Styling */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(74, 157, 215, 0.3);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 157, 215, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .flights-data-table {
    left: 8px;
    right: 8px;
    bottom: 70px;
    max-height: 280px;
  }

  .table-header {
    padding: 12px 16px;
  }

  .table-title {
    font-size: 13px;
  }

  .view-all-btn {
    padding: 6px 10px;
    font-size: 11px;
  }

  .flights-table th,
  .flights-table td {
    padding: 10px 12px;
    font-size: 12px;
  }

  .flight-cell {
    min-width: 150px;
  }

  .route-cell {
    min-width: 120px;
  }
}
</style>
