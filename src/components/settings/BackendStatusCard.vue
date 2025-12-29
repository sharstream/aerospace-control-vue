<template>
  <div class="status-section">
    <div class="status-header">
      <span class="status-label">Backend Status:</span>
      <span :class="['status-badge', statusClass]">
        <span class="status-dot"></span>
        {{ statusText }}
      </span>
    </div>
    <p
      v-if="lastUpdate"
      class="last-update"
    >
      Last update: {{ formattedLastUpdate }}
    </p>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'BackendStatusCard',
  props: {
    apiStatus: {
      type: String,
      required: true,
      default: 'unknown'
    },
    lastUpdate: {
      type: Date,
      default: null
    }
  },
  setup(props) {
    const statusClass = computed(() => {
      const statusMap = {
        connected: 'status-connected',
        disconnected: 'status-disconnected',
        rate_limited: 'status-warning',
        connection_error: 'status-error',
        error: 'status-error',
        unknown: 'status-unknown'
      };
      return statusMap[props.apiStatus] || 'status-unknown';
    });

    const statusText = computed(() => {
      const textMap = {
        connected: 'Connected',
        disconnected: 'Disconnected',
        rate_limited: 'Rate Limited',
        connection_error: 'Connection Error',
        error: 'Error',
        unknown: 'Unknown'
      };
      return textMap[props.apiStatus] || 'Unknown';
    });

    const formattedLastUpdate = computed(() => {
      try {
        if (!props.lastUpdate) return '';
        const date = new Date(props.lastUpdate);
        return date.toLocaleTimeString();
      } catch (error) {
        return '';
      }
    });

    return {
      statusClass,
      statusText,
      formattedLastUpdate
    };
  }
};
</script>

<style scoped>
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
