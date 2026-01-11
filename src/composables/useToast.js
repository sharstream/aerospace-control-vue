/**
 * Toast Notification Composable
 *
 * Provides a centralized toast notification system for displaying
 * success, error, warning, and info messages.
 *
 * Usage:
 * ```javascript
 * import { useToast } from '@/composables/useToast';
 *
 * const { showToast } = useToast();
 *
 * // Show success toast
 * showToast({
 *   type: 'success',
 *   title: 'Success!',
 *   message: 'Configuration saved successfully',
 *   duration: 3000
 * });
 *
 * // Show error toast
 * showToast({
 *   type: 'error',
 *   message: 'Failed to connect to server',
 *   duration: 5000
 * });
 * ```
 */

import { ref } from 'vue';

// Global toast state (shared across all components)
const toasts = ref([]);
let nextId = 0;

/**
 * useToast composable
 * @returns {Object} Toast methods and state
 */
export function useToast() {
  /**
   * Show a toast notification
   * @param {Object} options - Toast configuration
   * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {string} options.message - Toast message (required)
   * @param {string} [options.title] - Optional toast title
   * @param {number} [options.duration=4000] - Auto-dismiss duration in ms (0 = no auto-dismiss)
   * @returns {number} Toast ID
   */
  const showToast = ({
    type = 'info',
    message,
    title = null,
    duration = 4000
  }) => {
    if (!message) {
      console.warn('Toast message is required');
      return null;
    }

    const id = nextId++;
    const toast = {
      id,
      type,
      message,
      title,
      duration
    };

    toasts.value.push(toast);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  /**
   * Remove a toast by ID
   * @param {number} id - Toast ID to remove
   */
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * Remove all toasts
   */
  const clearToasts = () => {
    toasts.value = [];
  };

  /**
   * Show success toast (convenience method)
   * @param {string} message - Success message
   * @param {string} [title='Success'] - Optional title
   * @param {number} [duration=3000] - Auto-dismiss duration
   */
  const showSuccess = (message, title = null, duration = 3000) => showToast({
      type: 'success',
      message,
      title,
      duration
    });

  /**
   * Show error toast (convenience method)
   * @param {string} message - Error message
   * @param {string} [title='Error'] - Optional title
   * @param {number} [duration=5000] - Auto-dismiss duration (longer for errors)
   */
  const showError = (message, title = null, duration = 5000) => showToast({
      type: 'error',
      message,
      title,
      duration
    });

  /**
   * Show warning toast (convenience method)
   * @param {string} message - Warning message
   * @param {string} [title='Warning'] - Optional title
   * @param {number} [duration=4000] - Auto-dismiss duration
   */
  const showWarning = (message, title = null, duration = 4000) => showToast({
      type: 'warning',
      message,
      title,
      duration
    });

  /**
   * Show info toast (convenience method)
   * @param {string} message - Info message
   * @param {string} [title='Info'] - Optional title
   * @param {number} [duration=4000] - Auto-dismiss duration
   */
  const showInfo = (message, title = null, duration = 4000) => showToast({
      type: 'info',
      message,
      title,
      duration
    });

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}
