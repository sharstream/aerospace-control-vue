<template>
  <div class="settings-view active">
    <div class="settings-container">
      <!-- Header -->
      <div class="settings-header">
        <h1>System Settings</h1>
        <p class="settings-subtitle">Configure display preferences, map options, and system behavior</p>
      </div>

      <!-- Settings Grid -->
      <div class="settings-grid">
        <!-- Display Preferences -->
        <div class="settings-card">
          <div class="card-header">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
            </svg>
            <span>Display Preferences</span>
          </div>

          <div class="settings-list">
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Dark Mode</div>
                <div class="setting-description">Enable dark theme for the interface</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.darkMode"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">High Contrast</div>
                <div class="setting-description">Increase contrast for better visibility</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.highContrast"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Animations</div>
                <div class="setting-description">Enable smooth transitions and animations</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.animateFlights"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Font Size</div>
                <div class="setting-description">Adjust text size throughout the interface</div>
              </div>
              <select
                v-model="settings.fontSize"
                class="setting-select"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Map Configuration -->
        <div class="settings-card">
          <div class="card-header">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
            <span>Map Configuration</span>
          </div>

          <div class="settings-list">
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Default Basemap</div>
                <div class="setting-description">Choose the default map style</div>
              </div>
              <select
                v-model="settings.basemap"
                class="setting-select"
              >
                <option value="streets">Streets</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Show Timezone Grid</div>
                <div class="setting-description">Display timezone boundaries on startup</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.showTimezoneGrid"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Auto-Refresh</div>
                <div class="setting-description">Automatically update flight positions</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.autoRefresh"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Refresh Interval</div>
                <div class="setting-description">Update frequency in seconds</div>
              </div>
              <input
                v-model.number="settings.refreshInterval"
                type="number"
                min="5"
                max="300"
                class="setting-input"
              />
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Map Zoom Level</div>
                <div class="setting-description">Default zoom level on load</div>
              </div>
              <select
                v-model="settings.zoomLevel"
                class="setting-select"
              >
                <option value="1">1 - World</option>
                <option value="2">2 - Continent</option>
                <option value="3">3 - Region</option>
                <option value="4">4 - Country</option>
                <option value="5">5 - State</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data & Performance -->
        <div class="settings-card">
          <div class="card-header">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
            <span>Data & Performance</span>
          </div>

          <div class="settings-list">
            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Cache Flight Data</div>
                <div class="setting-description">Store flight information locally for faster loading</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.cacheData"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Show Weather Alerts</div>
                <div class="setting-description">Display real-time weather hazard notifications</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.showWeather"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Show Flight Paths</div>
                <div class="setting-description">Display route lines on the map</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.showFlightPaths"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <div class="setting-title">Notifications</div>
                <div class="setting-description">Enable system notifications</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.notifications"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Usage Metrics (Full Width) -->
        <div class="settings-card full-width">
          <div class="card-header">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
            <span>Usage Metrics</span>
          </div>

          <p class="section-description">Track and export your application usage statistics</p>

          <div class="metrics-summary">
            <div class="metric-card">
              <div class="metric-value">{{ usageMetrics.totalSessions }}</div>
              <div class="metric-label">Total Sessions</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ totalViewChanges }}</div>
              <div class="metric-label">View Changes</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ usageMetrics.featureUsage.flightClicks }}</div>
              <div class="metric-label">Flight Clicks</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">{{ usageMetrics.featureUsage.aiPanelOpens }}</div>
              <div class="metric-label">AI Panel Opens</div>
            </div>
          </div>

          <div class="metrics-details">
            <h3>Time Spent by View</h3>
            <div class="time-spent-list">
              <div
                v-for="(time, view) in usageMetrics.timeSpent"
                :key="view"
                class="time-spent-item"
              >
                <span class="view-name">{{ formatViewName(view) }}</span>
                <span class="time-value">{{ formatTime(time) }}</span>
              </div>
            </div>
          </div>

          <div class="export-actions">
            <button
              class="export-btn"
              @click="exportMetrics('json')"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              Export JSON
            </button>
            <button
              class="export-btn"
              @click="exportMetrics('csv')"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              Export CSV
            </button>
            <button
              class="export-btn"
              @click="exportMetrics('txt')"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              Export TXT
            </button>
            <button
              class="clear-btn"
              @click="clearMetrics"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUsageTracking } from '../../composables/useUsageTracking';

export default {
  name: 'SettingsModule',
  data() {
    return {
      settings: {
        darkMode: true,
        highContrast: false,
        animateFlights: true,
        fontSize: 'medium',
        basemap: 'streets',
        showTimezoneGrid: false,
        autoRefresh: true,
        refreshInterval: 30,
        zoomLevel: '3',
        cacheData: true,
        showWeather: true,
        showFlightPaths: true,
        notifications: true
      },
      tracker: null,
      usageMetrics: {
        totalSessions: 0,
        viewChanges: {},
        timeSpent: {},
        featureUsage: {
          flightClicks: 0,
          aiPanelOpens: 0
        }
      },
      metricsUpdateInterval: null
    };
  },
  computed: {
    totalViewChanges() {
      return Object.values(this.usageMetrics.viewChanges).reduce((sum, count) => sum + count, 0);
    }
  },
  mounted() {
    // Initialize usage tracking
    this.tracker = useUsageTracking();
    this.usageMetrics = this.tracker.getMetrics();

    // Update metrics periodically
    this.metricsUpdateInterval = setInterval(() => {
      this.usageMetrics = this.tracker.getMetrics();
    }, 1000);
  },
  beforeUnmount() {
    // Clear interval when component is destroyed
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
    }
  },
  methods: {
    formatViewName(view) {
      return view.charAt(0).toUpperCase() + view.slice(1);
    },

    formatTime(milliseconds) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);

      if (minutes === 0) {
        return `${seconds}s`;
      }
      return `${minutes}m ${seconds}s`;
    },

    exportMetrics(format) {
      this.tracker.exportMetrics(format);
    },

    clearMetrics() {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Are you sure you want to clear all usage data? This action cannot be undone.')) {
        this.tracker.clearMetrics();
        this.usageMetrics = this.tracker.getMetrics();
      }
    }
  }
};
</script>

<style scoped>
.settings-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 90px;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(15, 15, 15, 0.98) 100%);
  backdrop-filter: blur(16px);
  z-index: 800;
}

.settings-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Header */
.settings-header {
  margin-bottom: 32px;
}

.settings-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.settings-subtitle {
  color: #888;
  font-size: 15px;
  margin: 0;
  line-height: 1.5;
}

/* Grid Layout */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

/* Settings Card */
.settings-card {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(74, 157, 215, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.settings-card:hover {
  border-color: rgba(74, 157, 215, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(74, 157, 215, 0.2);
}

.settings-card.full-width {
  grid-column: 1 / -1;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(74, 157, 215, 0.15) 0%, rgba(74, 157, 215, 0.05) 100%);
  border-bottom: 1px solid rgba(74, 157, 215, 0.2);
}

.card-header svg {
  color: #4a9dd7;
  flex-shrink: 0;
}

.card-header span {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Settings List */
.settings-list {
  padding: 8px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.setting-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.setting-info {
  flex: 1;
  min-width: 0;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.setting-description {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 26px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #888;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-switch input:checked + .toggle-slider {
  background: linear-gradient(135deg, #4a9dd7 0%, #357ab8 100%);
  border-color: #4a9dd7;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(22px);
  background: #fff;
}

.toggle-switch:hover .toggle-slider {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.toggle-switch input:checked:hover + .toggle-slider {
  background: linear-gradient(135deg, #5aaee0 0%, #4589c5 100%);
}

/* Select & Input */
.setting-select,
.setting-input {
  min-width: 160px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.setting-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234a9dd7' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.setting-select:hover,
.setting-input:hover {
  border-color: #4a9dd7;
  background: rgba(0, 0, 0, 0.5);
}

.setting-select:focus,
.setting-input:focus {
  outline: none;
  border-color: #4a9dd7;
  box-shadow: 0 0 0 3px rgba(74, 157, 215, 0.1);
}

/* Metrics Section */
.section-description {
  color: #888;
  font-size: 14px;
  margin: 0 0 24px 0;
  padding: 0 24px;
}

.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin: 0 24px 32px 24px;
}

.metric-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
}

.metric-card:hover {
  border-color: #4a9dd7;
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #4a9dd7;
  margin-bottom: 8px;
  line-height: 1;
}

.metric-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.metrics-details {
  margin: 0 24px 24px 24px;
}

.metrics-details h3 {
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 12px 0;
}

.time-spent-list {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 12px;
  padding: 12px;
}

.time-spent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.time-spent-item:last-child {
  border-bottom: none;
}

.time-spent-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.view-name {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
}

.time-value {
  color: #4a9dd7;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.export-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 0 24px 24px 24px;
}

.export-btn,
.clear-btn {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn {
  background: linear-gradient(135deg, #4a9dd7 0%, #357ab8 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(74, 157, 215, 0.3);
}

.export-btn:hover {
  background: linear-gradient(135deg, #5aaee0 0%, #4589c5 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(74, 157, 215, 0.4);
}

.clear-btn {
  background: linear-gradient(135deg, #d74a4a 0%, #b83535 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(215, 74, 74, 0.3);
}

.clear-btn:hover {
  background: linear-gradient(135deg, #e05a5a 0%, #c54545 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(215, 74, 74, 0.4);
}

.export-btn:active,
.clear-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-container {
    padding: 24px 16px;
  }

  .metrics-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .toggle-switch,
  .setting-select,
  .setting-input {
    width: 100%;
  }

  .setting-select,
  .setting-input {
    max-width: none;
  }

  .metrics-summary {
    grid-template-columns: 1fr;
  }

  .export-actions {
    flex-direction: column;
  }

  .export-btn,
  .clear-btn {
    min-width: 100%;
  }
}

/* Scrollbar Styling */
.settings-view::-webkit-scrollbar {
  width: 8px;
}

.settings-view::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.settings-view::-webkit-scrollbar-thumb {
  background: rgba(74, 157, 215, 0.3);
  border-radius: 4px;
}

.settings-view::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 157, 215, 0.5);
}
</style>
