<template>
  <div class="settings-card full-width">
    <div class="card-header">
      <h2 class="card-title">Data Source</h2>
    </div>

    <div class="settings-content">
      <p class="section-description">
        Configure real-time aircraft data from SkySentinel backend
      </p>

      <div class="data-source-controls">
        <!-- Backend Status Section -->
        <BackendStatusCard
          :api-status="apiStatus"
          :last-update="lastUpdate"
        />

        <!-- Rate Limit Status Section (only shown when using real data) -->
        <RateLimitStatusCard
          v-if="useRealData"
          :rate-limit-info="rateLimitInfo"
          :countdown-seconds="countdownSeconds"
          :api-status="apiStatus"
          :max-credits="maxCredits"
        />

        <!-- Data Source Toggle -->
        <DataSourceToggle
          :use-real-data="useRealData"
          :is-toggling="isToggling"
          :error="error"
          @toggle="handleToggle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BackendStatusCard from './BackendStatusCard.vue';
import RateLimitStatusCard from './RateLimitStatusCard.vue';
import DataSourceToggle from './DataSourceToggle.vue';

export default {
  name: 'DataSourceConfiguration',
  components: {
    BackendStatusCard,
    RateLimitStatusCard,
    DataSourceToggle
  },
  props: {
    apiStatus: {
      type: String,
      required: true,
      default: 'unknown'
    },
    lastUpdate: {
      type: Date,
      default: null
    },
    useRealData: {
      type: Boolean,
      required: true
    },
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
    maxCredits: {
      type: Number,
      default: 400
    }
  },
  emits: ['toggle-data-source'],
  data() {
    return {
      isToggling: false,
      error: null
    };
  },
  methods: {
    async handleToggle() {
      try {
        this.isToggling = true;
        this.error = null;
        this.$emit('toggle-data-source');
      } catch (error) {
        this.error = error?.message || 'Failed to toggle data source';
        console.error('Error toggling data source:', error);
      } finally {
        this.isToggling = false;
      }
    }
  }
};
</script>

<style scoped>
.settings-card {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.settings-card.full-width {
  width: 100%;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #3a3a3a;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.settings-content {
  padding: 32px;
}

.section-description {
  color: #888;
  font-size: 14px;
  margin: 0 0 32px 0;
}

.data-source-controls {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 900px) {
  .settings-content {
    padding: 24px;
  }

  .card-header {
    padding: 20px 24px;
  }
}
</style>
