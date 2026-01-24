/**
 * Composable for managing resizable panel widths
 * Handles drag interactions and persists panel sizes to localStorage
 *
 * @param {import('vue').Ref<HTMLElement>} containerRef - Reference to the panel container
 * @returns {Object} Panel resize state and methods
 */
import { ref, computed, watchEffect, onMounted, onUnmounted } from 'vue';

const MIN_WIDTH = 25; // Minimum panel width percentage
const MAX_WIDTH = 75; // Maximum panel width percentage
const STORAGE_KEY = 'ai-chat-panel-width';

export function usePanelResize(containerRef) {
  const leftWidth = ref(35); // Default: 35% for chat, 65% for preview
  const isDragging = ref(false);

  // Compute right panel width
  const rightWidth = computed(() => 100 - leftWidth.value);

  // Restore saved width from localStorage
  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= MIN_WIDTH && parsed <= MAX_WIDTH) {
        leftWidth.value = parsed;
      }
    }
  });

  // Persist width changes to localStorage
  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, leftWidth.value.toString());
  });

  /**
   * Start resizing operation
   * @param {MouseEvent} event - Mouse down event
   */
  const startResize = (event) => {
    event.preventDefault();
    isDragging.value = true;

    const onMouseMove = (moveEvent) => {
      if (!isDragging.value || !containerRef.value) return;

      const container = containerRef.value;
      const containerRect = container.getBoundingClientRect();
      const offsetX = moveEvent.clientX - containerRect.left;
      const newWidth = (offsetX / containerRect.width) * 100;

      // Apply constraints
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        leftWidth.value = Math.round(newWidth);
      }
    };

    const onMouseUp = () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  /**
   * Snap to preset size
   * @param {number} percentage - Target width percentage
   */
  const snapTo = (percentage) => {
    const constrained = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, percentage));
    leftWidth.value = constrained;
  };

  return {
    leftWidth,
    rightWidth,
    isDragging,
    startResize,
    snapTo
  };
}
