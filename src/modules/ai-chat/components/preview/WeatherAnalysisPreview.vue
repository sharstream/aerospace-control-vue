<template>
  <div class="weather-analysis-preview">
    <!-- Weather Summary Card -->
    <div class="preview-card weather-summary">
      <h4>Weather Conditions</h4>
      <div class="summary-grid">
        <div class="summary-stat">
          <div class="stat-icon severe">
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
          <div class="stat-content">
            <span class="stat-value">{{ data.severe || 0 }}</span>
            <span class="stat-label">Severe Hazards</span>
          </div>
        </div>

        <div class="summary-stat">
          <div class="stat-icon moderate">
            <svg
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
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ data.moderate || 0 }}</span>
            <span class="stat-label">Moderate Hazards</span>
          </div>
        </div>

        <div class="summary-stat">
          <div class="stat-icon affected">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ data.affected || 0 }}</span>
            <span class="stat-label">Affected Flights</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weather Hazards List -->
    <div
      v-if="data.hazards && data.hazards.length > 0"
      class="preview-card hazards-list"
    >
      <h4>Active Weather Hazards</h4>
      <div class="hazards-container">
        <div
          v-for="(hazard, index) in data.hazards"
          :key="index"
          class="hazard-item"
          :class="getHazardSeverityClass(hazard.severity)"
        >
          <div class="hazard-header">
            <div class="hazard-icon">
              <component :is="getWeatherIcon(hazard.type)" />
            </div>
            <div class="hazard-info">
              <span class="hazard-type">{{ formatHazardType(hazard.type) }}</span>
              <span
                class="hazard-severity"
                :class="getHazardSeverityClass(hazard.severity)"
              >
                {{ hazard.severity }}
              </span>
            </div>
          </div>

          <div
            v-if="hazard.location"
            class="hazard-location"
          >
            <svg
              class="location-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{{ hazard.location }}</span>
          </div>

          <div
            v-if="hazard.description"
            class="hazard-description"
          >
            {{ hazard.description }}
          </div>

          <div
            v-if="hazard.recommendations && hazard.recommendations.length > 0"
            class="hazard-recommendations"
          >
            <span class="recommendations-label">Recommendations:</span>
            <ul>
              <li
                v-for="(rec, idx) in hazard.recommendations"
                :key="idx"
              >
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Weather Forecast (if available) -->
    <div
      v-if="data.forecast"
      class="preview-card weather-forecast"
    >
      <h4>Forecast</h4>
      <div class="forecast-content">
        <p>{{ data.forecast }}</p>
      </div>
    </div>

    <!-- Safety Recommendations -->
    <div
      v-if="data.recommendations && data.recommendations.length > 0"
      class="preview-card safety-recommendations"
    >
      <h4>Safety Recommendations</h4>
      <ul class="recommendations-list">
        <li
          v-for="(recommendation, index) in data.recommendations"
          :key="index"
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
          <span>{{ recommendation }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, h } from 'vue';

defineProps({
    data: {
        type: Object,
        required: true
    }
});

const formatHazardType = (type) => {
    if (!type) return 'Unknown';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getHazardSeverityClass = (severity) => {
    const severityMap = {
        high: 'severity-high',
        severe: 'severity-high',
        critical: 'severity-high',
        medium: 'severity-medium',
        moderate: 'severity-medium',
        low: 'severity-low',
        minor: 'severity-low'
    };
    return severityMap[severity?.toLowerCase()] || 'severity-medium';
};

const getWeatherIcon = (type) => {
    const iconType = type?.toLowerCase() || '';

    if (iconType.includes('storm') || iconType.includes('thunder')) {
        return () => h('svg', {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
        }, h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M13 10V3L4 14h7v7l9-11h-7z'
        }));
    }

    if (iconType.includes('turbulence') || iconType.includes('wind')) {
        return () => h('svg', {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
        }, h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M14 5l7 7m0 0l-7 7m7-7H3'
        }));
    }

    if (iconType.includes('ice') || iconType.includes('snow')) {
        return () => h('svg', {
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
        }, h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M12 2v20m0-20l-4 4m4-4l4 4M2 12h20M2 12l4-4m-4 4l4 4m14-4l-4-4m4 4l-4 4'
        }));
    }

    // Default cloud icon
    return () => h('svg', {
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
    }, h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
    }));
};
</script>

<style scoped>
.weather-analysis-preview {
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
  margin: 0 0 var(--spacing-4) 0;
}

/* Weather Summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3);
}

.summary-stat {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.severe {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.stat-icon.moderate {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.stat-icon.affected {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* Hazards List */
.hazards-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.hazard-item {
  padding: var(--spacing-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-border);
}

.hazard-item.severity-high {
  border-left-color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}

.hazard-item.severity-medium {
  border-left-color: var(--color-warning);
  background: rgba(245, 158, 11, 0.05);
}

.hazard-item.severity-low {
  border-left-color: var(--color-success);
  background: rgba(74, 222, 128, 0.05);
}

.hazard-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.hazard-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hazard-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-secondary);
}

.hazard-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hazard-type {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
}

.hazard-severity {
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hazard-severity.severity-high {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-error);
}

.hazard-severity.severity-medium {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.hazard-severity.severity-low {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.hazard-location {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.location-icon {
  width: 16px;
  height: 16px;
}

.hazard-description {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-2);
}

.hazard-recommendations {
  margin-top: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--color-border);
}

.recommendations-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: var(--spacing-1);
}

.hazard-recommendations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hazard-recommendations li {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  padding-left: var(--spacing-4);
  position: relative;
  margin-bottom: 4px;
}

.hazard-recommendations li::before {
  content: '•';
  position: absolute;
  left: var(--spacing-2);
  color: var(--color-primary);
}

/* Forecast */
.forecast-content p {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* Safety Recommendations */
.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.check-icon {
  width: 20px;
  height: 20px;
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 2px;
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
