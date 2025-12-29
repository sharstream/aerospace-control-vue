<template>
  <div class="map-controls">
    <button
      class="control-btn"
      title="Pan"
      @click="handleControl('pan')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Zoom In"
      @click="handleControl('zoom-in')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Zoom Out"
      @click="handleControl('zoom-out')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Home"
      @click="handleControl('home')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Base Map"
      @click="handleControl('basemap')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Layers"
      @click="handleControl('layers')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="History"
      @click="handleControl('history')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    </button>

    <button
      class="control-btn"
      title="Print"
      @click="handleControl('print')"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MapControls',
  emits: ['control-action'],
  methods: {
    handleControl(action) {
      this.$emit('control-action', action);
    }
  }
};
</script>

<style scoped>
.map-controls {
  position: fixed;
  right: 24px;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(42, 42, 42, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 900;
  border: 1px solid rgba(74, 157, 215, 0.15);
}

.control-btn {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #e0e0e0;
}

.control-btn:hover {
  background: rgba(74, 157, 215, 0.15);
  color: #4a9dd7;
}

.control-btn svg {
  width: 20px;
  height: 20px;
}
</style>
