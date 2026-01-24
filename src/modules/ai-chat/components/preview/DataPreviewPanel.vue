<template>
  <div class="data-preview-panel">
    <div class="preview-header">
      <h3>{{ previewTitle }}</h3>
      <button
        v-if="hasData"
        class="clear-btn"
        @click="$emit('clear')"
        title="Clear preview"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>

    <div class="preview-content">
      <div
        v-if="hasData"
        class="data-display"
      >
        <!-- Flight Data Preview -->
        <div
          v-if="previewType === 'flight-data'"
          class="flight-preview"
        >
          <div class="preview-card">
            <h4>Flight Information</h4>
            <div class="data-grid">
              <div class="data-item">
                <span class="label">Callsign:</span>
                <span class="value">{{ previewData?.callsign || 'N/A' }}</span>
              </div>
              <div class="data-item">
                <span class="label">Altitude:</span>
                <span class="value">{{ previewData?.altitude || 'N/A' }} ft</span>
              </div>
              <div class="data-item">
                <span class="label">Speed:</span>
                <span class="value">{{ previewData?.speed || 'N/A' }} kts</span>
              </div>
              <div class="data-item">
                <span class="label">Heading:</span>
                <span class="value">{{ previewData?.heading || 'N/A' }}°</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Weather Preview -->
        <div
          v-else-if="previewType === 'weather'"
          class="weather-preview"
        >
          <div class="preview-card">
            <h4>Weather Analysis</h4>
            <p>Weather data preview will be displayed here</p>
          </div>
        </div>

        <!-- Route Preview -->
        <div
          v-else-if="previewType === 'route'"
          class="route-preview"
        >
          <div class="preview-card">
            <h4>Route Optimization</h4>
            <p>Route comparison data will be displayed here</p>
          </div>
        </div>

        <!-- Generic Data Preview -->
        <div
          v-else
          class="generic-preview"
        >
          <div class="preview-card">
            <pre class="data-json">{{ JSON.stringify(previewData, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="empty-state"
      >
        <svg
          class="empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p>Select a message with data to preview</p>
        <span class="empty-hint">Flight data, weather analysis, and route optimization will appear here</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  previewType: {
    type: String,
    default: null
  },
  previewData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['clear']);

const hasData = computed(() => props.previewData !== null);

const previewTitle = computed(() => {
  if (!hasData.value) return 'Data Preview';

  const titles = {
    'flight-data': 'Flight Data',
    'weather': 'Weather Analysis',
    'route': 'Route Optimization',
    'system': 'System Status'
  };

  return titles[props.previewType] || 'Data Preview';
});
</script>

<style scoped>
.data-preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
}

.preview-header {
  padding: var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin: 0;
}

.clear-btn {
  width: 32px;
  height: 32px;
  background: var(--color-white-alpha-05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
}

.clear-btn:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

.clear-btn svg {
  width: 18px;
  height: 18px;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-4);
}

.empty-state p {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-2) 0;
  color: var(--color-text-secondary);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  max-width: 300px;
}

.data-display {
  animation: fadeIn 0.3s ease;
}

.preview-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}

.preview-card h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin: 0 0 var(--spacing-4) 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-item .label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-item .value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
}

.data-json {
  background: var(--color-bg-secondary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  line-height: var(--line-height-relaxed);
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
</style>
