import mitt from 'mitt'

// Create a single event bus instance
const eventBus = mitt()

/**
 * Event Bus composable using mitt
 *
 * Available events:
 * - 'flight:selected' - When a flight is selected
 * - 'flight:updated' - When flight data is updated
 * - 'view:changed' - When the active view changes
 * - 'ai:opened' - When AI panel is opened
 * - 'ai:closed' - When AI panel is closed
 * - 'map:control' - When a map control action is triggered
 * - 'weather:updated' - When weather data is updated
 * - 'notification:show' - When a notification should be shown
 */
export function useEventBus() {
  return {
    // Emit an event
    emit: eventBus.emit,

    // Listen to an event
    on: eventBus.on,

    // Remove event listener
    off: eventBus.off,

    // Listen to an event once
    once: (type, handler) => {
      const fn = (...args) => {
        eventBus.off(type, fn)
        handler(...args)
      }
      eventBus.on(type, fn)
    },

    // Clear all listeners for a specific event type
    clearEvent: (type) => {
      eventBus.all.delete(type)
    },

    // Clear all event listeners
    clearAll: () => {
      eventBus.all.clear()
    }
  }
}

// Export the raw event bus for direct access if needed
export { eventBus }
