<template>
  <div class="route-optimization-preview">
    <!-- Route Comparison Header -->
    <div class="preview-card route-header">
      <h4>Route Optimization Analysis</h4>
      <p
        v-if="data.flights"
        class="analysis-count"
      >
        Analyzing {{ data.flights.length }} flight{{ data.flights.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Routes List -->
    <div
      v-if="data.routes && data.routes.length > 0"
      class="routes-container"
    >
      <div
        v-for="(route, index) in data.routes"
        :key="index"
        class="route-card"
        :class="{ recommended: route.recommended }"
      >
        <div class="route-badge-container">
          <span
            v-if="route.recommended"
            class="recommended-badge"
          >
            <svg
              class="star-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Recommended
          </span>
          <span
            class="route-type"
            :class="route.type"
          >
            {{ route.type === 'direct' ? 'Direct Route' : 'Optimized Route' }}
          </span>
        </div>

        <div
          v-if="route.name"
          class="route-name"
        >
          {{ route.name }}
        </div>

        <div class="route-path">
          <span class="airport">{{ route.from }}</span>
          <div class="route-line">
            <svg
              v-if="route.waypoints && route.waypoints > 0"
              class="waypoint-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="2"
              />
            </svg>
            <div class="line" />
            <svg
              v-if="route.waypoints && route.waypoints > 1"
              class="waypoint-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="2"
              />
            </svg>
          </div>
          <span class="airport">{{ route.to }}</span>
        </div>

        <div class="route-metrics">
          <div class="metric-item">
            <svg
              class="metric-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span class="metric-label">Distance:</span>
            <span class="metric-value">{{ formatDistance(route.distance) }}</span>
          </div>

          <div class="metric-item">
            <svg
              class="metric-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="metric-label">Time:</span>
            <span class="metric-value">{{ formatTime(route.time) }}</span>
          </div>

          <div class="metric-item">
            <svg
              class="metric-icon"
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
            <span class="metric-label">Fuel:</span>
            <span class="metric-value">{{ formatFuel(route.fuel) }}</span>
          </div>
        </div>

        <div
          v-if="route.advantages && route.advantages.length > 0"
          class="route-advantages"
        >
          <span class="advantages-label">Advantages:</span>
          <ul>
            <li
              v-for="(advantage, idx) in route.advantages"
              :key="idx"
            >
              {{ advantage }}
            </li>
          </ul>
        </div>

        <div
          v-if="route.hazardsAvoided"
          class="hazards-avoided"
        >
          <svg
            class="warning-icon"
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
          <span>{{ route.hazardsAvoided }} weather hazard{{ route.hazardsAvoided !== 1 ? 's' : '' }} avoided</span>
        </div>
      </div>
    </div>

    <!-- Comparison Summary -->
    <div
      v-if="data.comparison"
      class="preview-card comparison-summary"
    >
      <h4>Savings Analysis</h4>
      <div class="savings-grid">
        <div
          v-if="data.comparison.timeSaved !== undefined"
          class="savings-item"
        >
          <div class="savings-icon time">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="savings-content">
            <span class="savings-value">{{ Math.abs(data.comparison.timeSaved) }} min</span>
            <span class="savings-label">{{ data.comparison.timeSaved >= 0 ? 'Time Saved' : 'Extra Time' }}</span>
          </div>
        </div>

        <div
          v-if="data.comparison.fuelSaved !== undefined"
          class="savings-item"
        >
          <div class="savings-icon fuel">
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
          <div class="savings-content">
            <span class="savings-value">{{ Math.abs(data.comparison.fuelSaved) }} kg</span>
            <span class="savings-label">{{ data.comparison.fuelSaved >= 0 ? 'Fuel Saved' : 'Extra Fuel' }}</span>
          </div>
        </div>

        <div
          v-if="data.comparison.costSaved !== undefined"
          class="savings-item"
        >
          <div class="savings-icon cost">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="savings-content">
            <span class="savings-value">${{ Math.abs(data.comparison.costSaved).toLocaleString() }}</span>
            <span class="savings-label">{{ data.comparison.costSaved >= 0 ? 'Cost Saved' : 'Extra Cost' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div
      v-if="data.recommendations && data.recommendations.length > 0"
      class="preview-card recommendations"
    >
      <h4>Recommendations</h4>
      <ul class="recommendations-list">
        <li
          v-for="(rec, index) in data.recommendations"
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
          <span>{{ rec }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const formatDistance = (distance) => {
  if (!distance) return 'N/A';
  return `${Math.round(distance).toLocaleString()} km`;
};

const formatTime = (time) => {
  if (!time) return 'N/A';
  const hours = Math.floor(time / 60);
  const minutes = Math.round(time % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatFuel = (fuel) => {
  if (!fuel) return 'N/A';
  return `${Math.round(fuel).toLocaleString()} kg`;
};
</script>

<style scoped>
.route-optimization-preview {
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

/* Route Header */
.analysis-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--spacing-2) 0 0 0;
}

/* Routes Container */
.routes-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.route-card {
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  transition: all 0.2s ease;
}

.route-card:hover {
  border-color: var(--color-primary-alpha-40);
  background: var(--color-primary-alpha-10);
}

.route-card.recommended {
  border-color: var(--color-success);
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.05), var(--color-bg-primary));
}

.route-badge-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.recommended-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 4px var(--spacing-2);
  background: var(--color-success-alpha-20);
  color: var(--color-success);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.star-icon {
  width: 14px;
  height: 14px;
}

.route-type {
  padding: 4px var(--spacing-2);
  background: var(--color-white-alpha-10);
  color: var(--color-text-secondary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.route-type.optimized {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.route-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  margin-bottom: var(--spacing-3);
}

.route-path {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.airport {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.route-line {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  position: relative;
}

.line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
}

.waypoint-icon {
  width: 12px;
  height: 12px;
  color: var(--color-primary);
}

.route-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--spacing-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-base);
}

.metric-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  margin-bottom: 2px;
}

.metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.metric-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.route-advantages {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
}

.advantages-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: var(--spacing-2);
}

.route-advantages ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.route-advantages li {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  padding-left: var(--spacing-4);
  position: relative;
  margin-bottom: 4px;
}

.route-advantages li::before {
  content: '✓';
  position: absolute;
  left: var(--spacing-2);
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
}

.hazards-avoided {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.warning-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Comparison Summary */
.savings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3);
}

.savings-item {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  align-items: center;
}

.savings-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.savings-icon svg {
  width: 28px;
  height: 28px;
}

.savings-icon.time {
  background: var(--color-primary-alpha-20);
  color: var(--color-primary);
}

.savings-icon.fuel {
  background: var(--color-success-alpha-20);
  color: var(--color-success);
}

.savings-icon.cost {
  background: var(--color-warning-alpha-20);
  color: var(--color-warning);
}

.savings-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.savings-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
  font-family: var(--font-family-mono);
}

.savings-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Recommendations */
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
