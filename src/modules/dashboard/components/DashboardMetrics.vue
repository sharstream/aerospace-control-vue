<template>
  <div class="aerospace-metrics-grid">
    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(74, 157, 215, 0.15); color: #4a9dd7;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M23,11.01L18,11c-0.55,0-1,0.45-1,1v9c0,0.55,0.45,1,1,1h5c0.55,0,1-0.45,1-1v-9C24,11.46,23.55,11.01,23,11.01z M23,20h-5v-7h5V20z" /><path d="M20,2H2v20h15v-2H4V4h14v5h2V2z" /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Avg Altitude</div>
        <div class="metric-value-large">{{ systemContext.avgAltitude.toLocaleString() }} ft</div>
      </div>
    </div>

    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(74, 222, 128, 0.15); color: #4ade80;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Fuel Efficiency</div>
        <div class="metric-value-large">93.7%</div>
      </div>
    </div>

    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z" /><circle
          cx="12"
          cy="12"
          r="5"
        /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Airspace Density</div>
        <div class="metric-value-large">68.4%</div>
      </div>
    </div>

    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Weather Alerts</div>
        <div class="metric-value-large">3 Active</div>
      </div>
    </div>

    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(236, 72, 153, 0.15); color: #ec4899;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M15,1H9v2h6V1z M11,14h2V8h-2V14z M19.03,7.39l1.42-1.42c-0.43-0.51-0.9-0.99-1.41-1.41l-1.42,1.42 C16.07,4.74,14.12,4,12,4c-4.97,0-9,4.03-9,9s4.02,9,9,9s9-4.03,9-9C21,10.88,20.26,8.93,19.03,7.39z M12,20c-3.87,0-7-3.13-7-7 s3.13-7,7-7s7,3.13,7,7S15.87,20,12,20z" /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Avg Flight Time</div>
        <div class="metric-value-large">4.2 hrs</div>
      </div>
    </div>

    <div class="metric-tile">
      <div
        class="metric-icon-circle"
        style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        ><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
      </div>
      <div class="metric-info">
        <div class="metric-title">Incidents (24h)</div>
        <div class="metric-value-large">0</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardMetrics',
  props: {
    systemContext: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.aerospace-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.metric-tile {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon-circle svg {
  width: 20px;
  height: 20px;
}

.metric-info {
  min-width: 0;
}

.metric-title {
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.metric-value-large {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
