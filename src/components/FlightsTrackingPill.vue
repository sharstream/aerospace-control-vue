<template>
  <div
    v-if="flight.icao24"
    class="tracking-toggle-container"
    :class="{ 'is-tracked': isTracked }"
    @click.stop="handleToggle"
  >
    <div class="toggle-track">
      <div class="toggle-slider">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          width="12"
          height="12"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>
      <span class="toggle-label">{{ isTracked ? 'Tracked' : 'Track' }}</span>
    </div>
  </div>
  <span
    v-else
    class="tracking-disabled"
    title="Real-time data required"
  >
    N/A
  </span>
</template>

<script>
export default {
  name: 'FlightsTrackingPill',
  props: {
    flight: {
      type: Object,
      required: true
    },
    isTracked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['track', 'untrack'],
  methods: {
    handleToggle() {
      if (this.isTracked) {
        this.$emit('untrack', this.flight);
      } else {
        this.$emit('track', this.flight);
      }
    }
  }
};
</script>

<style scoped>
/* Toggle Container - Pill Shape */
.tracking-toggle-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 95px;
  height: 30px;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Default state - Untracked (Green) */
  background: linear-gradient(135deg, rgba(95, 219, 95, 0.2) 0%, rgba(95, 219, 95, 0.15) 100%);
  border: 1.5px solid rgba(95, 219, 95, 0.5);
  box-shadow: 0 2px 8px rgba(95, 219, 95, 0.25);
}

.tracking-toggle-container:hover {
  background: linear-gradient(135deg, rgba(95, 219, 95, 0.3) 0%, rgba(95, 219, 95, 0.2) 100%);
  border-color: rgba(95, 219, 95, 0.7);
  box-shadow: 0 4px 12px rgba(95, 219, 95, 0.35);
  transform: translateY(-1px);
}

.tracking-toggle-container:active {
  transform: translateY(0) scale(0.98);
}

/* Tracked state - Red */
.tracking-toggle-container.is-tracked {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.18) 100%);
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.tracking-toggle-container.is-tracked:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(220, 38, 38, 0.25) 100%);
  border-color: rgba(239, 68, 68, 0.8);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Toggle Track (Inner container) */
.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 4px;
}

/* Sliding Circle/Knob */
.toggle-slider {
  position: absolute;
  left: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;

  /* Default - Green circle */
  background: linear-gradient(135deg, #5fdb5f 0%, #4ade80 100%);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.1);
}

.toggle-slider svg {
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

/* Tracked state - Slider moves right, turns red */
.tracking-toggle-container.is-tracked .toggle-slider {
  left: calc(100% - 27px);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.35),
    0 0 0 2px rgba(255, 255, 255, 0.15);
}

/* Label Text */
.toggle-label {
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  /* Default - Track label on right */
  right: 8px;
  color: #5fdb5f;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Tracked state - Tracked label on left */
.tracking-toggle-container.is-tracked .toggle-label {
  right: auto;
  left: 8px;
  color: #ef4444;
}

.tracking-disabled {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  color: #666;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
