<template>
  <div class="rate-limit-section">
    <div class="rate-limit-header">
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        class="rate-limit-icon"
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
      <span class="rate-limit-title">API Rate Limit Status</span>
    </div>

    <!-- Rate Limit Info -->
    <div
      v-if="rateLimitInfo.remaining !== null"
      class="rate-limit-info"
    >
      <div class="credits-display">
        <div class="credits-label">Remaining Credits</div>
        <div :class="['credits-value', creditsStatusClass]">
          {{ rateLimitInfo.remaining }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="credits-progress-container">
        <div
          class="credits-progress-bar"
          :style="{ width: creditsPercentage + '%' }"
          :class="creditsProgressClass"
        ></div>
      </div>

      <div class="credits-description">
        {{ creditsDescription }}
      </div>
    </div>

    <!-- Rate Limited - Countdown Timer -->
    <div
      v-if="apiStatus === 'rate_limited' && countdownSeconds !== null"
      class="countdown-section"
    >
      <div class="countdown-icon-wrapper">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="countdown-icon"
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      </div>
      <div class="countdown-content">
        <div class="countdown-title">Rate Limit Reached</div>
        <div class="countdown-timer">
          <span class="countdown-time">{{ formatCountdown(countdownSeconds) }}</span>
          <span class="countdown-label">until API available</span>
        </div>
        <div class="countdown-description">
          The API will automatically retry when the cooldown period expires.
        </div>
      </div>
    </div>

    <!-- No Rate Limit Data Available -->
    <div
      v-if="rateLimitInfo.remaining === null && apiStatus !== 'rate_limited'"
      class="no-rate-limit-info"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        width="16"
        height="16"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      Rate limit information not available
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'RateLimitStatusCard',
  props: {
    rateLimitInfo: {
      type: Object,
      required: true,
      default: () => ({
        remaining: null,
        retryAfterSeconds: null
      })
    },
    countdownSeconds: {
      type: Number,
      default: null
    },
    apiStatus: {
      type: String,
      required: true,
      default: 'unknown'
    },
    maxCredits: {
      type: Number,
      default: 400
    }
  },
  setup(props) {
    const creditsPercentage = computed(() => {
      try {
        if (props.rateLimitInfo.remaining === null) return 0;
        const remaining = parseInt(props.rateLimitInfo.remaining, 10);
        return Math.min((remaining / props.maxCredits) * 100, 100);
      } catch (error) {
        return 0;
      }
    });

    const creditsStatusClass = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 50) return 'credits-good';
      if (percentage > 20) return 'credits-warning';
      return 'credits-critical';
    });

    const creditsProgressClass = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 50) return 'progress-good';
      if (percentage > 20) return 'progress-warning';
      return 'progress-critical';
    });

    const creditsDescription = computed(() => {
      const percentage = creditsPercentage.value;
      if (percentage > 70) return 'API usage is healthy';
      if (percentage > 40) return 'Approaching rate limit';
      if (percentage > 10) return 'Low credits remaining - use cautiously';
      return 'Critical: Rate limit imminent';
    });

    const formatCountdown = (totalSeconds) => {
      if (totalSeconds === null || totalSeconds <= 0) {
        return '0:00';
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
      creditsPercentage,
      creditsStatusClass,
      creditsProgressClass,
      creditsDescription,
      formatCountdown
    };
  }
};
</script>

<style scoped>
/* Rate Limit Section */
.rate-limit-section {
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.rate-limit-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #3a3a3a;
}

.rate-limit-icon {
  color: #5b9dd1;
  flex-shrink: 0;
}

.rate-limit-title {
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
}

.rate-limit-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.credits-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.credits-label {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

.credits-value {
  font-size: 28px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.credits-good {
  color: #4ade80;
}

.credits-warning {
  color: #fbbf24;
}

.credits-critical {
  color: #ef4444;
}

.credits-progress-container {
  width: 100%;
  height: 8px;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.credits-progress-bar {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 4px;
}

.progress-good {
  background: linear-gradient(90deg, #4ade80, #22c55e);
}

.progress-warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.progress-critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.credits-description {
  font-size: 13px;
  color: #888;
  text-align: center;
  padding-top: 4px;
}

/* Countdown Section */
.countdown-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  padding: 16px;
  margin-top: 12px;
}

.countdown-icon-wrapper {
  flex-shrink: 0;
}

.countdown-icon {
  color: #fbbf24;
}

.countdown-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.countdown-title {
  font-size: 15px;
  font-weight: 600;
  color: #fbbf24;
}

.countdown-timer {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.countdown-time {
  font-size: 32px;
  font-weight: 700;
  color: #fbbf24;
  font-family: 'Courier New', monospace;
  line-height: 1;
  letter-spacing: 1px;
}

.countdown-label {
  font-size: 13px;
  color: #d4a637;
  font-weight: 500;
}

.countdown-description {
  font-size: 13px;
  color: #d4a637;
  line-height: 1.5;
}

.no-rate-limit-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  font-size: 13px;
  color: #888;
  background: #2a2a2a;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .countdown-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .credits-display {
    flex-direction: column;
    gap: 8px;
  }

  .countdown-timer {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
