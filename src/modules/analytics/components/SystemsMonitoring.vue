<template>
  <div class="systems-monitoring">
    <div
      v-for="system in systems"
      :key="system.name"
      :class="['system-panel', system.statusClass]"
    >
      <div class="system-panel-header">
        <div class="system-panel-title">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path v-html="system.icon" />
          </svg>
          {{ system.name }}
        </div>
        <div :class="['system-status-badge', system.statusClass]">{{ system.status }}</div>
      </div>
      <div class="system-panel-body">
        <div
          v-for="(value, key) in system.metrics"
          :key="key"
          class="system-metric-row"
        >
          <span class="system-metric-label">{{ key }}</span>
          <span :class="['system-metric-value', getMetricClass(value)]">{{ value }}</span>
        </div>
        <div class="system-progress-bar">
          <div
            :class="['system-progress-fill', system.statusClass]"
            :style="{ width: system.health + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemsMonitoring',
  props: {
    systems: {
      type: Array,
      required: true
    }
  },
  methods: {
    getMetricClass(value) {
      if (typeof value === 'string') {
        if (value.includes('ONLINE') || value === 'ON') return 'normal';
        if (value.includes('OFFLINE') || value.includes('HIGH')) return 'critical';
        if (value.includes('%') && parseInt(value) > 80) return 'critical';
      }
      return '';
    }
  }
};
</script>

<style scoped>
.systems-monitoring {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.system-panel {
  background: linear-gradient(135deg, rgba(26, 38, 50, 0.6) 0%, rgba(20, 30, 40, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.system-panel:hover {
  border-color: rgba(74, 157, 215, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.system-panel.critical {
  border-color: rgba(239, 68, 68, 0.3);
}

.system-panel.warning {
  border-color: rgba(251, 191, 36, 0.3);
}

.system-panel.operational {
  border-color: rgba(74, 222, 128, 0.2);
}

.system-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.system-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.system-panel-title svg {
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

.system-panel-body {
  padding: 20px;
}

.system-metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.system-metric-row:last-of-type {
  border-bottom: none;
}

.system-metric-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.system-metric-value {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.system-metric-value.normal {
  color: #4ade80;
}

.system-metric-value.critical {
  color: #ef4444;
}

.system-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  margin-top: 16px;
  overflow: hidden;
}

.system-progress-fill {
  height: 100%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.system-progress-fill.operational {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.system-progress-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.system-progress-fill.critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
</style>
