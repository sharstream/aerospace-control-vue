<template>
  <div class="settings-view active">
    <div class="settings-header">
      <h1>Settings</h1>
      <p class="settings-subtitle">Configure application preferences</p>
    </div>

    <div class="settings-sections">
      <div class="settings-section">
        <h2>Display Options</h2>
        <div class="setting-item">
          <label>
            <input
              v-model="settings.showWeather"
              type="checkbox"
            />
            Show weather hazards on map
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              v-model="settings.showFlightPaths"
              type="checkbox"
            />
            Show flight paths
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              v-model="settings.animateFlights"
              type="checkbox"
            />
            Animate flight movement
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h2>Notifications</h2>
        <div class="setting-item">
          <label>
            <input
              v-model="settings.notifications"
              type="checkbox"
            />
            Enable notifications
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input
              v-model="settings.soundAlerts"
              type="checkbox"
            />
            Sound alerts for delays
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h2>AI Assistant</h2>
        <div class="setting-item">
          <label>OpenAI API Key</label>
          <input
            v-model="settings.apiKey"
            type="password"
            placeholder="sk-..."
            class="api-key-input"
          />
          <p class="setting-help">Required for ChatGPT integration</p>
        </div>
      </div>

      <div class="settings-section">
        <h2>Usage Metrics</h2>
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
</template>

<script>
import { useUsageTracking } from '../../composables/useUsageTracking';

export default {
  name: 'SettingsModule',
  data() {
    return {
      settings: {
        showWeather: true,
        showFlightPaths: true,
        animateFlights: true,
        notifications: true,
        soundAlerts: false,
        apiKey: localStorage.getItem('openai_api_key') || ''
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
  watch: {
    'settings.apiKey': function (newValue) {
      // Save API key to localStorage when it changes
      if (newValue) {
        localStorage.setItem('openai_api_key', newValue);
      } else {
        localStorage.removeItem('openai_api_key');
      }
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
  padding: 24px;
  padding-bottom: 90px;
  overflow-y: auto;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(8px);
  z-index: 800;
}

.settings-header h1 {
  font-size: 28px;
  color: #fff;
  margin: 0 0 8px 0;
}

.settings-subtitle {
  color: #999;
  margin: 0 0 32px 0;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 600px;
}

.settings-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(74, 157, 215, 0.2);
}

.settings-section h2 {
  font-size: 20px;
  color: #fff;
  margin: 0 0 16px 0;
}

.setting-item {
  margin-bottom: 16px;
}

.setting-item label {
  color: #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.api-key-input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 14px;
  margin-top: 8px;
}

.api-key-input:focus {
  outline: none;
  border-color: #4a9dd7;
}

.setting-help {
  color: #999;
  font-size: 12px;
  margin: 8px 0 0 0;
}

.section-description {
  color: #999;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.metric-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  color: #4a9dd7;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metrics-details {
  margin-bottom: 24px;
}

.metrics-details h3 {
  font-size: 16px;
  color: #e0e0e0;
  margin: 0 0 12px 0;
}

.time-spent-list {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.time-spent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.time-spent-item:last-child {
  border-bottom: none;
}

.view-name {
  color: #e0e0e0;
  font-size: 14px;
}

.time-value {
  color: #4a9dd7;
  font-weight: 600;
  font-size: 14px;
}

.export-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.export-btn,
.clear-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn {
  background: linear-gradient(135deg, #4a9dd7 0%, #357ab8 100%);
  color: white;
}

.export-btn:hover {
  background: linear-gradient(135deg, #5aaee0 0%, #4589c5 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 157, 215, 0.3);
}

.clear-btn {
  background: linear-gradient(135deg, #d74a4a 0%, #b83535 100%);
  color: white;
}

.clear-btn:hover {
  background: linear-gradient(135deg, #e05a5a 0%, #c54545 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(215, 74, 74, 0.3);
}

.export-btn:active,
.clear-btn:active {
  transform: translateY(0);
}
</style>
