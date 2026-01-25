<template>
  <div class="system-status-preview">
    <!-- Overall Status Card -->
    <div class="preview-card overall-status">
      <div class="status-header">
        <div
          class="status-indicator"
          :class="getOverallStatusClass(data.overall_status || data.overallStatus)"
        />
        <div class="status-info">
          <h4>System Status</h4>
          <span class="status-text">{{ data.overall_status || data.overallStatus || 'Unknown' }}</span>
        </div>
      </div>
    </div>

    <!-- Systems Grid -->
    <div
      v-if="data.systems_checked || data.systemsChecked"
      class="preview-card systems-grid-card"
    >
      <h4>Systems Checked</h4>
      <div class="systems-grid">
        <div
          v-for="system in (data.systems_checked || data.systemsChecked)"
          :key="system"
          class="system-badge"
        >
          <svg
            class="check-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ formatSystemName(system) }}</span>
        </div>
      </div>
    </div>

    <!-- Active Alerts -->
    <div
      v-if="data.alerts && data.alerts.length > 0"
      class="preview-card alerts-card"
    >
      <h4>Active Alerts</h4>
      <div class="alerts-list">
        <div
          v-for="(alert, index) in data.alerts"
          :key="index"
          class="alert-item"
          :class="getAlertSeverityClass(alert.severity || 'medium')"
        >
          <svg
            class="alert-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span class="alert-text">{{ alert }}</span>
        </div>
      </div>
    </div>

    <!-- System Details (if available) -->
    <div
      v-if="data.systemDetails"
      class="system-details"
    >
      <div
        v-for="(detail, systemName) in data.systemDetails"
        :key="systemName"
        class="preview-card system-detail-card"
      >
        <div class="system-detail-header">
          <div
            class="system-status-dot"
            :class="getSystemDetailStatusClass(detail.status)"
          />
          <h4>{{ formatSystemName(systemName) }}</h4>
        </div>

        <div class="detail-metrics">
          <div
            v-for="(value, metric) in detail.metrics"
            :key="metric"
            class="detail-metric"
          >
            <span class="metric-label">{{ formatMetricName(metric) }}:</span>
            <span class="metric-value">{{ formatMetricValue(value) }}</span>
          </div>
        </div>

        <div
          v-if="detail.message"
          class="detail-message"
        >
          {{ detail.message }}
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div
      v-if="hasPerformanceMetrics"
      class="preview-card performance-metrics"
    >
      <h4>Performance Metrics</h4>
      <div class="metrics-grid">
        <div
          v-if="data.uptime"
          class="metric-card"
        >
          <div class="metric-icon uptime">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ data.uptime }}</span>
            <span class="metric-label">Uptime</span>
          </div>
        </div>

        <div
          v-if="data.responseTime"
          class="metric-card"
        >
          <div class="metric-icon response">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ data.responseTime }}</span>
            <span class="metric-label">Response Time</span>
          </div>
        </div>

        <div
          v-if="data.throughput"
          class="metric-card"
        >
          <div class="metric-icon throughput">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ data.throughput }}</span>
            <span class="metric-label">Throughput</span>
          </div>
        </div>

        <div
          v-if="data.errorRate !== undefined"
          class="metric-card"
        >
          <div class="metric-icon error-rate">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="metric-content">
            <span class="metric-value">{{ data.errorRate }}%</span>
            <span class="metric-label">Error Rate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const hasPerformanceMetrics = computed(() => {
  return props.data.uptime || props.data.responseTime || props.data.throughput || props.data.errorRate !== undefined;
});

const formatSystemName = (system) => {
  return system.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatMetricName = (metric) => {
  return metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatMetricValue = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

const getOverallStatusClass = (status) => {
  const normalized = status?.toString().toLowerCase();
  if (normalized === 'normal' || normalized === 'ok' || normalized === 'operational') {
    return 'status-ok';
  }
  if (normalized === 'warning' || normalized === 'degraded') {
    return 'status-warning';
  }
  if (normalized === 'critical' || normalized === 'failed' || normalized === 'error') {
    return 'status-critical';
  }
  return 'status-unknown';
};

const getSystemDetailStatusClass = (status) => {
  return getOverallStatusClass(status);
};

const getAlertSeverityClass = (severity) => {
  const normalized = severity?.toLowerCase();
  if (normalized === 'high' || normalized === 'critical') {
    return 'alert-critical';
  }
  if (normalized === 'medium' || normalized === 'warning') {
    return 'alert-warning';
  }
  return 'alert-info';
};
</script>

<style scoped>
.system-status-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.preview-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  animation: fadeIn 0.3s ease;
}

.preview-card h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin: 0 0 var(--spacing-3) 0;
}

/* Overall Status */
.overall-status {
  background: linear-gradient(135deg, var(--color-surface), var(--color-bg-primary));
}

.status-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.status-indicator {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.status-indicator::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

.status-indicator.status-ok {
  background: var(--color-success);
  box-shadow: 0 0 24px var(--color-success);
}

.status-indicator.status-ok::before {
  background: var(--color-success);
}

.status-indicator.status-warning {
  background: var(--color-warning);
  box-shadow: 0 0 24px var(--color-warning);
}

.status-indicator.status-warning::before {
  background: var(--color-warning);
}

.status-indicator.status-critical {
  background: var(--color-error);
  box-shadow: 0 0 24px var(--color-error);
}

.status-indicator.status-critical::before {
  background: var(--color-error);
}

.status-indicator.status-unknown {
  background: var(--color-text-tertiary);
  box-shadow: 0 0 24px var(--color-text-tertiary);
}

.status-info h4 {
  margin: 0 0 4px 0;
}

.status-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Systems Grid */
.systems-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.system-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-success-alpha-20);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-success);
}

.check-icon {
  width: 16px;
  height: 16px;
}

/* Alerts List */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-left: 4px solid var(--color-border);
  border-radius: var(--radius-md);
}

.alert-item.alert-critical {
  border-left-color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

.alert-item.alert-warning {
  border-left-color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

.alert-item.alert-info {
  border-left-color: var(--color-primary);
  background: var(--color-primary-alpha-10);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
}

/* System Details */
.system-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.system-detail-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.system-status-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.system-status-dot.status-ok {
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
}

.system-status-dot.status-warning {
  background: var(--color-warning);
  box-shadow: 0 0 8px var(--color-warning);
}

.system-status-dot.status-critical {
  background: var(--color-error);
  box-shadow: 0 0 8px var(--color-error);
}

.system-status-dot.status-unknown {
  background: var(--color-text-tertiary);
}

.detail-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.detail-metric {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
}

.metric-label {
  color: var(--color-text-secondary);
}

.metric-value {
  color: var(--color-text-white);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-mono);
}

.detail-message {
  margin-top: var(--spacing-3);
  padding: var(--spacing-2);
  background: var(--color-primary-alpha-10);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

/* Performance Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.metric-card {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  align-items: center;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
}

.metric-icon.uptime {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.metric-icon.response {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.metric-icon.throughput {
  background: var(--color-info);
  color: white;
}

.metric-icon.error-rate {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-content .metric-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
}

.metric-content .metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}
</style>
