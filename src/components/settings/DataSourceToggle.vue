<template>
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
          :disabled="isToggling"
          @click="handleToggle"
        >
          <span class="toggle-slider"></span>
        </button>
      </label>
    </div>

    <div
      v-if="error"
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
      {{ error }}
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
</template>

<script>
export default {
  name: 'DataSourceToggle',
  props: {
    useRealData: {
      type: Boolean,
      required: true
    },
    isToggling: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const handleToggle = () => {
      if (!props.isToggling) {
        emit('toggle');
      }
    };

    return {
      handleToggle
    };
  }
};
</script>

<style scoped>
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

@media (max-width: 600px) {
  .toggle-label {
    flex-direction: column;
    align-items: flex-start;
  }

  .toggle-button {
    align-self: flex-end;
  }
}
</style>
