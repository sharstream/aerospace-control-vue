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
          <div class="card-header">
            <h2 class="card-title">AI Assistant</h2>
          </div>

          <div class="settings-content">
            <div class="api-key-section">
              <label class="input-label">OpenAI API Key</label>
              <div class="api-key-input-wrapper">
                <input
                  v-model="openaiApiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="api-key-input"
                  placeholder="sk-..."
                />
                <button
                  class="toggle-visibility-btn"
                  @click="showApiKey = !showApiKey"
                >
                  <svg
                    v-if="!showApiKey"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  <svg
                    v-else
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                </button>
              </div>
              <p class="input-description">Required for ChatGPT integration</p>
            </div>
          </div>
        </div>

        <!-- Data Source Configuration -->
        <div class="settings-card full-width">
          <div class="card-header">
            <h2 class="card-title">Data Source</h2>
          </div>

          <div class="settings-content">
            <p class="section-description">Configure real-time aircraft data from SkySentinel backend</p>

            <div class="data-source-controls">
              <div class="status-section">
                <div class="status-header">
                  <span class="status-label">Backend Status:</span>
                  <span
                    :class="['status-badge', apiStatusClass]"
                  >
                    <span class="status-dot"></span>
                    {{ apiStatusText }}
                  </span>
                </div>
                <p
                  v-if="lastUpdate"
                  class="last-update"
                >
                  Last update: {{ formatLastUpdate }}
                </p>
              </div>

              <!-- Rate Limit Status Section -->
              <div
                v-if="useRealData"
                class="rate-limit-section"
              >
                <div class="rate-limit-header">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    class="rate-limit-icon"
                  >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  <span class="rate-limit-title">API Rate Limit Status</span>
                </div>

                <!-- Rate Limit Info -->
                <div
                  v-if="rateLimitInfo.remaining !== null"
                  class="rate-limit-info"
                >
                  <div class="credits-display">
                    <div class="credits-label">Remaining Credits</div>
                    <div
                      :class="['credits-value', creditsStatusClass]"
                    >
                      {{ rateLimitInfo.remaining }}
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="credits-progress-container">
                    <div
                      class="credits-progress-bar"
                      :style="{ width: creditsPercentage + '%' }"
                      :class="creditsProgressClass"
                    ></div>
                  </div>

                  <div class="credits-description">
                    {{ creditsDescription }}
                  </div>
                </div>

                <!-- Rate Limited - Countdown Timer -->
                <div
                  v-if="apiStatus === 'rate_limited' && countdownSeconds !== null"
                  class="countdown-section"
                >
                  <div class="countdown-icon-wrapper">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      class="countdown-icon"
                    >
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                  </div>
                  <div class="countdown-content">
                    <div class="countdown-title">Rate Limit Reached</div>
                    <div class="countdown-timer">
                      <span class="countdown-time">{{ formatCountdown(countdownSeconds) }}</span>
                      <span class="countdown-label">until API available</span>
                    </div>
                    <div class="countdown-description">
                      The API will automatically retry when the cooldown period expires.
                    </div>
                  </div>
                </div>

                <!-- No Rate Limit Data Available -->
                <div
                  v-if="rateLimitInfo.remaining === null && apiStatus !== 'rate_limited'"
                  class="no-rate-limit-info"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  Rate limit information not available
                </div>
              </div>

              <div class="toggle-section">
                <div class="toggle-wrapper">
                  <label class="toggle-label">
                    <span class="toggle-text">
                      <strong>{{ useRealData ? 'Real-Time Data' : 'Demo Data' }}</strong>
                      <span class="toggle-description">
                        {{ useRealData ? 'Connected to OpenSky Network via backend' : 'Using mock flight data for demonstration' }}
                      </span>
                    </span>
                    <button
                      class="toggle-button"
                      :class="{ active: useRealData }"
                      :disabled="isTogglingData"
                      @click="toggleDataSource"
                    >
                      <span class="toggle-slider"></span>
                    </button>
                  </label>
                </div>

                <div
                  v-if="dataSourceError"
                  class="error-message"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {{ dataSourceError }}
                </div>

                <div
                  v-if="useRealData"
                  class="info-message"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  Data refreshes automatically every 10 seconds
                </div>
              </div>
            </div>
          </div>
        </div>

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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsageTracking } from '../../composables/useUsageTracking';
import { useFlightsStore } from '@/stores/flights';

export default {
  name: 'SettingsModule',
  setup() {
    const flightsStore = useFlightsStore();
    const { lastUpdate, apiStatus, useRealData, rateLimitInfo, countdownSeconds } = storeToRefs(flightsStore);

    // Create computed property for formatted date in setup
    const formatLastUpdate = computed(() => {
      try {
        if (!lastUpdate.value) return '';
        const date = new Date(lastUpdate.value);
        return date.toLocaleTimeString();
      } catch (error) {
        return '';
      }
    });

    const apiStatusClass = computed(() => {
      try {
        const statusMap = {
          connected: 'status-connected',
          disconnected: 'status-disconnected',
          rate_limited: 'status-warning',
          connection_error: 'status-error',
          error: 'status-error',
          unknown: 'status-unknown'
        };
        return statusMap[apiStatus.value] || 'status-unknown';
      } catch (error) {
        return 'status-unknown';
      }
    });

    const apiStatusText = computed(() => {
      try {
        const textMap = {
          connected: 'Connected',
          disconnected: 'Disconnected',
          rate_limited: 'Rate Limited',
          connection_error: 'Connection Error',
          error: 'Error',
          unknown: 'Unknown'
        };
        return textMap[apiStatus.value] || 'Unknown';
      } catch (error) {
        return 'Unknown';
      }
    });

    // Rate limit computed properties
    const creditsPercentage = computed(() => {
      try {
        if (rateLimitInfo.value.remaining === null) return 0;
        const remaining = parseInt(rateLimitInfo.value.remaining, 10);
        const maxCredits = 400; // OpenSky API default for anonymous users
        return Math.min((remaining / maxCredits) * 100, 100);
      } catch (error) {
        return 0;
      }
    });

    const creditsStatusClass = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 50) return 'credits-good';
      if (percentage > 20) return 'credits-warning';
      return 'credits-critical';
    });

    const creditsProgressClass = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 50) return 'progress-good';
      if (percentage > 20) return 'progress-warning';
      return 'progress-critical';
    });

    const creditsDescription = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 70) return 'API usage is healthy';
      if (percentage > 40) return 'Approaching rate limit';
      if (percentage > 10) return 'Low credits remaining - use cautiously';
      return 'Critical: Rate limit imminent';
    });

    return {
      flightsStore,
      lastUpdate,
      apiStatus,
      useRealData,
      rateLimitInfo,
      countdownSeconds,
      formatLastUpdate,
      apiStatusClass,
      apiStatusText,
      creditsPercentage,
      creditsStatusClass,
      creditsProgressClass,
      creditsDescription
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
      metricsUpdateInterval: null,
      isTogglingData: false,
      dataSourceError: null
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

    formatCountdown(totalSeconds) {
      if (totalSeconds === null || totalSeconds <= 0) {
        return '0:00';
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
      debugger;
      try {
        if (!this.flightsStore) {
          this.dataSourceError = 'Flights store not initialized';
          return;
        }

        this.isTogglingData = true;
        this.dataSourceError = null;

        await this.flightsStore.toggleDataSource();
      } catch (error) {
        this.dataSourceError = error?.message || 'An error occurred';
        console.error('Failed to toggle data source:', error);
      } finally {
        this.isTogglingData = false;
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

/* Data Source Controls */
.data-source-controls {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.status-section {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.status-label {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-connected {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.status-connected .status-dot {
  background: #4ade80;
}

.status-disconnected {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.status-disconnected .status-dot {
  background: #9ca3af;
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-error .status-dot {
  background: #ef4444;
}

.status-warning {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.status-warning .status-dot {
  background: #fbbf24;
}

.status-unknown {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.status-unknown .status-dot {
  background: #9ca3af;
}

.last-update {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #888;
  font-family: 'Courier New', monospace;
}

.toggle-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-wrapper {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.toggle-wrapper:hover {
  border-color: #4a7ba7;
  background: #252525;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 20px;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.toggle-text strong {
  font-size: 16px;
  color: #e0e0e0;
  font-weight: 600;
}

.toggle-description {
  font-size: 13px;
  color: #888;
  line-height: 1.4;
}

.toggle-button {
  position: relative;
  width: 52px;
  height: 28px;
  background: #3a3a3a;
  border: 2px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-button:hover:not(:disabled) {
  background: #4a4a4a;
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-button.active {
  background: #4ade80;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-button.active .toggle-slider {
  transform: translateX(24px);
}

.error-message,
.info-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.info-message {
  background: rgba(91, 157, 209, 0.1);
  border: 1px solid rgba(91, 157, 209, 0.3);
  color: #5b9dd1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 600px) {
  .toggle-label {
    flex-direction: column;
    align-items: flex-start;
  }

  .toggle-button {
    align-self: flex-end;
  }
}

/* Rate Limit Section */
.rate-limit-section {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.rate-limit-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #3a3a3a;
}

.rate-limit-icon {
  color: #5b9dd1;
  flex-shrink: 0;
}

.rate-limit-title {
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
}

.rate-limit-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.credits-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.credits-label {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

.credits-value {
  font-size: 28px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.credits-good {
  color: #4ade80;
}

.credits-warning {
  color: #fbbf24;
}

.credits-critical {
  color: #ef4444;
}

.credits-progress-container {
  width: 100%;
  height: 8px;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.credits-progress-bar {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.progress-good {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.progress-warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.progress-critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.credits-description {
  font-size: 13px;
  color: #888;
  text-align: center;
  padding-top: 4px;
}

/* Countdown Section */
.countdown-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  padding: 16px;
  margin-top: 12px;
}

.countdown-icon-wrapper {
  flex-shrink: 0;
}

.countdown-icon {
  color: #fbbf24;
}

.countdown-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.countdown-title {
  font-size: 15px;
  font-weight: 600;
  color: #fbbf24;
}

.countdown-timer {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.countdown-time {
  font-size: 32px;
  font-weight: 700;
  color: #fbbf24;
  font-family: 'Courier New', monospace;
  line-height: 1;
  letter-spacing: 1px;
}

.countdown-label {
  font-size: 13px;
  color: #d4a637;
  font-weight: 500;
}

.countdown-description {
  font-size: 13px;
  color: #d4a637;
  line-height: 1.5;
}

.no-rate-limit-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  font-size: 13px;
  color: #888;
  background: #2a2a2a;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .countdown-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .credits-display {
    flex-direction: column;
    gap: 8px;
  }

  .countdown-timer {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
