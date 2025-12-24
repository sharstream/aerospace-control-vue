<template>
  <div
    class="bottom-nav"
    :class="{ collapsed }"
  >
    <button
      class="bottom-nav-toggle"
      title="Toggle Navigation"
      @click="collapsed = !collapsed"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </button>

    <div
      class="nav-item"
      :class="{ active: activeView === 'dashboard' }"
      @click="changeView('dashboard')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
      <span>Dashboard</span>
    </div>

    <div
      class="nav-item"
      :class="{ active: activeView === 'map' }"
      @click="changeView('map')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
      </svg>
      <span>Live Map</span>
      <span class="nav-item-badge success">Live</span>
    </div>

    <div
      class="nav-item"
      :class="{ active: activeView === 'flights' }"
      @click="changeView('flights')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
      </svg>
      <span>Flights</span>
      <span class="nav-item-badge info">{{ flightCount }}</span>
    </div>

    <div
      class="nav-item"
      :class="{ active: activeView === 'weather' }"
      @click="changeView('weather')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
      <span>Weather</span>
      <span class="nav-item-badge warning">3</span>
    </div>

    <div
      class="nav-item"
      :class="{ active: activeView === 'analytics' }"
      @click="changeView('analytics')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
      </svg>
      <span>Analytics</span>
    </div>

    <div
      class="nav-item"
      :class="{ active: activeView === 'settings' }"
      @click="changeView('settings')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
      <span>Settings</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

defineProps({
  activeView: {
    type: String,
    required: true
  },
  flightCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['change-view', 'collapse-state-change']);

const collapsed = ref(false);

// Watch for collapse state changes and emit
watch(collapsed, (newVal) => {
  emit('collapse-state-change', newVal);
});

function changeView(view) {
  emit('change-view', view);
}
</script>

<style scoped>
.nav-item-badge.info {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}
</style>
