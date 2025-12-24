<template>
  <div>
    <!-- System Status -->
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-title">System Status</div>
        <div style="display: flex; gap: 12px;">
          <span class="status-indicator operational">
            <span class="status-dot"></span>
            ATC Systems
          </span>
          <span class="status-indicator operational">
            <span class="status-dot"></span>
            Navigation
          </span>
          <span class="status-indicator operational">
            <span class="status-dot"></span>
            Weather Data
          </span>
        </div>
      </div>
    </div>

    <!-- Performance Chart -->
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-title">On-Time Performance Trend (24h)</div>
        <div class="chart-legend">
          <div class="chart-legend-item">
            <div class="chart-legend-dot" style="background: #4ade80;"></div>
            On-Time
          </div>
          <div class="chart-legend-item">
            <div class="chart-legend-dot" style="background: #f59e0b;"></div>
            Delayed
          </div>
          <div class="chart-legend-item">
            <div class="chart-legend-dot" style="background: #ef4444;"></div>
            Critical
          </div>
        </div>
      </div>
      <div class="chart-canvas">
        <div style="padding: 60px; text-align: center; color: #666;">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" style="opacity: 0.5;">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
          </svg>
          <div style="margin-top: 12px; font-size: 13px;">Real-time performance monitoring</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCharts'
}
</script>

<style scoped>
.chart-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #fff;
}

.status-indicator.operational {
  color: #4ade80;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}

.chart-legend {
  display: flex;
  gap: 12px;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #999;
}

.chart-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.chart-canvas {
  /* Placeholder for canvas/chart styling */
}
</style>
