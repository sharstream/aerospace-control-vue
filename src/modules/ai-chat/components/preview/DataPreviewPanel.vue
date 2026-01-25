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
      <!-- Specialized Preview Components -->
      <div
        v-if="hasData"
        class="data-display"
      >
        <FlightDataPreview
          v-if="previewType === 'flight-data'"
          :data="previewData"
        />

        <WeatherAnalysisPreview
          v-else-if="previewType === 'weather'"
          :data="previewData"
        />

        <RouteOptimizationPreview
          v-else-if="previewType === 'route'"
          :data="previewData"
        />

        <SystemStatusPreview
          v-else-if="previewType === 'system'"
          :data="previewData"
        />

        <!-- Generic Data Preview (fallback) -->
        <div
          v-else
          class="generic-preview"
        >
          <div class="preview-card">
            <h4>Data Preview</h4>
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
        <span class="empty-hint">Flight data, weather analysis, route optimization, and system status will appear here</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import FlightDataPreview from './FlightDataPreview.vue';
import WeatherAnalysisPreview from './WeatherAnalysisPreview.vue';
import RouteOptimizationPreview from './RouteOptimizationPreview.vue';
import SystemStatusPreview from './SystemStatusPreview.vue';

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
  flex-shrink: 0;
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
  overflow-x: hidden;
}

/* Custom scrollbar styling */
.preview-content::-webkit-scrollbar {
  width: 8px;
}

.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb {
  background: var(--color-text-tertiary);
  border-radius: var(--radius-base);
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

.data-display {
  padding: var(--spacing-5);
  animation: fadeIn 0.3s ease;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-8);
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
  max-width: 320px;
  line-height: var(--line-height-relaxed);
}

/* Generic Preview (fallback) */
.preview-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
}

.preview-card h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin: 0 0 var(--spacing-4) 0;
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
