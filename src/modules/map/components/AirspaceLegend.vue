<template>
  <div
    class="legend-panel"
    :class="{ collapsed: isCollapsed }"
  >
    <div
      class="legend-header"
      @click="isCollapsed = !isCollapsed"
    >
      <div class="legend-title">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
        </svg>
        Airspace Legend
      </div>
      <svg
        class="collapse-icon"
        fill="currentColor"
        viewBox="0 0 24 24"
        width="20"
        height="20"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>

    <div class="legend-content">
      <!-- Airlines Classification -->
      <div class="legend-section">
        <div class="section-header">
          <span class="section-dash">-</span>
          <span class="section-title">AIRLINES CLASSIFICATION</span>
          <span class="section-count">5 Active</span>
        </div>
        <div class="legend-items">
          <div
            v-for="airline in airlines"
            :key="airline.code"
            class="legend-item"
          >
            <div
              class="airline-icon"
              :style="{ background: airline.color }"
            >
              <span class="airline-logo">{{ airline.logo }}</span>
            </div>
            <span class="item-label">{{ airline.name }}</span>
            <span class="item-code">{{ airline.code }}</span>
          </div>
        </div>
      </div>

      <!-- Route Classification -->
      <div class="legend-section">
        <div class="section-header">
          <span class="section-dash">-</span>
          <span class="section-title">ROUTE CLASSIFICATION</span>
          <span class="section-count">2 Types</span>
        </div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="route-indicator optimized"></div>
            <span class="item-label">Optimized Route</span>
            <span class="item-code">AI</span>
          </div>
          <div class="legend-item">
            <div class="route-indicator standard"></div>
            <span class="item-label">Standard Route</span>
            <span class="item-code">STD</span>
          </div>
        </div>
      </div>

      <!-- Weather Hazards -->
      <div class="legend-section">
        <div class="section-header">
          <span class="section-dash">-</span>
          <span class="section-title">WEATHER HAZARDS</span>
          <span class="section-count">3 Active</span>
        </div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="weather-indicator storm"></div>
            <span class="item-label">Storm System</span>
            <span class="item-code">HIGH</span>
          </div>
          <div class="legend-item">
            <div class="weather-indicator turbulence"></div>
            <span class="item-label">Turbulence Zone</span>
            <span class="item-code">MED</span>
          </div>
        </div>
      </div>

      <!-- AI Navigation Button -->
      <button class="ai-nav-button">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        AI-Enhanced Navigation
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AirspaceLegend',
  props: {
    airlines: {
      type: Object,
      required: true
    },
    flightsTableCollapsed: {
      type: Boolean,
      default: true
    },
    bottomNavCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapsed: true
    };
  },
  computed: {
    bottomPosition() {
      // Base position when bottom nav is shown
      let base = 110;

      // Adjust for bottom nav collapse
      if (this.bottomNavCollapsed) {
        base = 40;
      }

      // Move up when flights table is open
      if (!this.flightsTableCollapsed) {
        base += 360;
      }

      return `${base}px`;
    }
  }
};
</script>

<style scoped>
.legend-panel {
  position: fixed;
  left: 24px;
  bottom: v-bind(bottomPosition);
  width: 280px;
  background: rgba(26, 38, 50, 0.98);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(74, 157, 215, 0.2);
  z-index: 900;
  border: 1px solid rgba(74, 157, 215, 0.2);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.legend-panel.collapsed .legend-content {
  display: none;
}

.legend-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.legend-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.legend-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-title svg {
  color: #4a9dd7;
}

.collapse-icon {
  color: #888;
  transition: transform 0.3s ease;
}

.legend-panel.collapsed .collapse-icon {
  transform: rotate(-90deg);
}

.legend-content {
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.legend-section {
  margin-bottom: 20px;
}

.legend-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 10px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-dash {
  color: #4a9dd7;
}

.section-title {
  flex: 1;
}

.section-count {
  background: rgba(74, 157, 215, 0.15);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 9px;
  color: #4a9dd7;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.airline-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.airline-logo {
  font-size: 16px;
}

.item-label {
  flex: 1;
  font-size: 12px;
  color: #e0e0e0;
  font-weight: 500;
}

.item-code {
  font-size: 10px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.route-indicator {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.route-indicator.optimized {
  background: linear-gradient(90deg, #4ade80, #22c55e);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

.route-indicator.standard {
  background: #666;
}

.weather-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.weather-indicator.storm {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 2px solid #ef4444;
}

.weather-indicator.turbulence {
  background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.1) 100%);
  border: 2px solid #f59e0b;
}

.ai-nav-button {
  width: 100%;
  margin-top: 16px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #4a7ba7 0%, #4a9dd7 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(74, 157, 215, 0.3);
}

.ai-nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 157, 215, 0.5);
}

.legend-content::-webkit-scrollbar {
  width: 4px;
}

.legend-content::-webkit-scrollbar-track {
  background: transparent;
}

.legend-content::-webkit-scrollbar-thumb {
  background: rgba(74, 157, 215, 0.3);
  border-radius: 2px;
}
</style>
