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
        <!-- AI Assistant -->
        <div class="settings-card full-width">
          <AIAssistantSettings />
        </div>

        <!-- Data Source Configuration -->
        <DataSourceConfiguration
          :apiStatus="apiStatus"
          :lastUpdate="lastUpdate"
          :useRealData="useRealData"
          :rateLimitInfo="rateLimitInfo"
          :countdownSeconds="countdownSeconds"
          @toggle-data-source="toggleDataSource"
        />

        <!-- Usage Metrics (Full Width) -->
        <div class="settings-card full-width">
          <div class="card-header">
            <h2 class="card-title">Usage Metrics</h2>
          </div>

          <div class="settings-content">
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
  </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useUsageTracking } from '../../composables/useUsageTracking';
import { useFlightsStore } from '@/stores/flights';
import DataSourceConfiguration from '@/components/settings/DataSourceConfiguration.vue';
import AIAssistantSettings from './components/AIAssistantSettings.vue';

export default {
  name: 'SettingsModule',
  components: {
    DataSourceConfiguration,
    AIAssistantSettings
  },
  setup() {
    const flightsStore = useFlightsStore();
    const {
      lastUpdate, apiStatus, useRealData, rateLimitInfo, countdownSeconds
    } = storeToRefs(flightsStore);

    return {
      flightsStore,
      lastUpdate,
      apiStatus,
      useRealData,
      rateLimitInfo,
      countdownSeconds
    };
  },
  data() {
    return {
      openaiApiKey: '',
      showApiKey: false,
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
    },

    async toggleDataSource() {
      if (this.flightsStore) {
        await this.flightsStore.toggleDataSource();
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
  background: #1a1a1a;
  z-index: 800;
}

.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Header */
.settings-header {
  margin-bottom: 40px;
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Settings Card */
.settings-card {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.settings-card.full-width {
  width: 100%;
}

/* Card Header */
.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #3a3a3a;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Settings Content */
.settings-content {
  padding: 32px;
}

/* API Key Section */
.api-key-section {
  max-width: 800px;
}

.input-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin-bottom: 12px;
}

.api-key-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.api-key-input {
  width: 100%;
  padding: 16px 52px 16px 20px;
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  color: #e0e0e0;
  font-size: 15px;
  font-family: 'Courier New', monospace;
  transition: all 0.2s ease;
}

.api-key-input::placeholder {
  color: #666;
}

.api-key-input:hover {
  border-color: #4a7ba7;
}

.api-key-input:focus {
  outline: none;
  border-color: #5b9dd1;
  background: #252525;
}

.toggle-visibility-btn {
  position: absolute;
  right: 16px;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-visibility-btn:hover {
  color: #5b9dd1;
}

.input-description {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

/* Section Description */
.section-description {
  color: #888;
  font-size: 14px;
  margin: 0 0 32px 0;
}

/* Metrics Summary */
.metrics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
}

.metric-card:hover {
  border-color: #4a7ba7;
  background: #252525;
  transform: translateY(-2px);
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #5b9dd1;
  margin-bottom: 8px;
  line-height: 1;
}

.metric-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Metrics Details */
.metrics-details {
  margin-bottom: 32px;
}

.metrics-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 16px 0;
}

.time-spent-list {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
}

.time-spent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #3a3a3a;
  transition: background 0.2s ease;
}

.time-spent-item:last-child {
  border-bottom: none;
}

.time-spent-item:hover {
  background: #252525;
}

.view-name {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
}

.time-value {
  color: #5b9dd1;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

/* Export Actions */
.export-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.export-btn,
.clear-btn {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #5b9dd1;
}

.export-btn:hover {
  background: rgba(91, 157, 209, 0.1);
  border-color: #5b9dd1;
  transform: translateY(-2px);
}

.clear-btn {
  color: #d74a4a;
}

.clear-btn:hover {
  background: rgba(215, 74, 74, 0.1);
  border-color: #d74a4a;
  transform: translateY(-2px);
}

.export-btn:active,
.clear-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 900px) {
  .settings-container {
    padding: 24px 16px;
  }

  .settings-content {
    padding: 24px;
  }

  .card-header {
    padding: 20px 24px;
  }

  .metrics-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
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
  background: #1a1a1a;
}

.settings-view::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 4px;
}

.settings-view::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

</style>
