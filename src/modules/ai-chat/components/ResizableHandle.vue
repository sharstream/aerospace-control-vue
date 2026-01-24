<template>
  <div
    class="resizable-handle"
    :class="{ dragging: isDragging }"
    @mousedown="handleMouseDown"
    role="separator"
    aria-orientation="vertical"
    aria-label="Resize panels"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <div class="handle-indicator">
      <div class="handle-line" />
      <div class="handle-line" />
      <div class="handle-line" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isDragging: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['resize', 'snap']);

const handleMouseDown = (event) => {
  emit('resize', event);
};

/**
 * Keyboard navigation for accessibility
 * Arrow keys adjust panel size, Enter snaps to default
 */
const handleKeyDown = (event) => {
  const step = 5; // Percentage step for keyboard adjustment

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      emit('snap', -step);
      break;
    case 'ArrowRight':
      event.preventDefault();
      emit('snap', step);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      emit('snap', 35); // Reset to default 35%
      break;
    default:
      break;
  }
};
</script>

<style scoped>
.resizable-handle {
  width: 12px;
  flex-shrink: 0;
  cursor: col-resize;
  position: relative;
  background: var(--color-bg-primary);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.resizable-handle:hover,
.resizable-handle:focus {
  background: var(--color-primary-alpha-10);
  border-left-color: var(--color-primary);
  border-right-color: var(--color-primary);
  outline: none;
}

.resizable-handle:focus-visible {
  box-shadow: inset 0 0 0 2px var(--color-primary);
}

.resizable-handle.dragging {
  background: var(--color-primary-alpha-20);
  border-left-color: var(--color-primary);
  border-right-color: var(--color-primary);
}

.handle-indicator {
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: none;
}

.handle-line {
  width: 2px;
  height: 16px;
  background: var(--color-text-tertiary);
  border-radius: 1px;
  transition: background 0.2s ease;
}

.resizable-handle:hover .handle-line,
.resizable-handle:focus .handle-line,
.resizable-handle.dragging .handle-line {
  background: var(--color-primary);
}

/* Touch support */
@media (hover: none) and (pointer: coarse) {
  .resizable-handle {
    width: 20px;
  }

  .handle-line {
    width: 3px;
    height: 20px;
  }
}
</style>
