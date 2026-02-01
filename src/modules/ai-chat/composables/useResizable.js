import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Composable for making elements resizable with 8-direction handles
 * Persists size to localStorage for consistency across sessions
 *
 * @param {String} storageKey - localStorage key for persisting size
 * @param {Object} defaults - Default width and height
 * @returns {Object} - Resizable state and methods
 */
export function useResizable(storageKey = 'resizable-dimensions', defaults = {}) {
    const dimensions = ref({
        width: defaults.width || 900,
        height: defaults.height || 600
    });

    const constraints = ref({
        minWidth: defaults.minWidth || 600,
        minHeight: defaults.minHeight || 400,
        maxWidth: defaults.maxWidth || window.innerWidth - 100,
        maxHeight: defaults.maxHeight || window.innerHeight - 100
    });

    const isResizing = ref(false);
    const resizeDirection = ref(null);
    const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0 });

    // Load saved dimensions from localStorage
    onMounted(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dimensions.value = parsed;
            } catch (e) {
                console.warn('Failed to parse saved dimensions:', e);
            }
        }

        // Update max constraints on window resize
        window.addEventListener('resize', updateConstraints);
    });

    // Update constraints based on viewport
    const updateConstraints = () => {
        constraints.value.maxWidth = window.innerWidth - 100;
        constraints.value.maxHeight = window.innerHeight - 100;
    };

    // Save dimensions to localStorage
    const saveDimensions = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(dimensions.value));
        } catch (e) {
            console.warn('Failed to save dimensions:', e);
        }
    };

    // Start resizing
    const startResize = (direction, event) => {
        event.preventDefault();
        event.stopPropagation();

        isResizing.value = true;
        resizeDirection.value = direction;

        resizeStart.value = {
            x: event.clientX,
            y: event.clientY,
            width: dimensions.value.width,
            height: dimensions.value.height
        };

        // Add global listeners
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', stopResize);

        // Prevent text selection during resize
        document.body.style.userSelect = 'none';
        document.body.style.cursor = getCursorForDirection(direction);
    };

    // Handle resize movement
    const onResize = (event) => {
        if (!isResizing.value) return;

        const deltaX = event.clientX - resizeStart.value.x;
        const deltaY = event.clientY - resizeStart.value.y;

        let newWidth = resizeStart.value.width;
        let newHeight = resizeStart.value.height;

        // Calculate new dimensions based on direction
        const dir = resizeDirection.value;

        if (dir.includes('e')) { // East (right)
            newWidth = resizeStart.value.width + deltaX;
        }
        if (dir.includes('w')) { // West (left)
            newWidth = resizeStart.value.width - deltaX;
        }
        if (dir.includes('s')) { // South (bottom)
            newHeight = resizeStart.value.height + deltaY;
        }
        if (dir.includes('n')) { // North (top)
            newHeight = resizeStart.value.height - deltaY;
        }

        // Apply constraints
        newWidth = Math.max(
            constraints.value.minWidth,
            Math.min(newWidth, constraints.value.maxWidth)
        );
        newHeight = Math.max(
            constraints.value.minHeight,
            Math.min(newHeight, constraints.value.maxHeight)
        );

        dimensions.value = {
            width: Math.round(newWidth),
            height: Math.round(newHeight)
        };
    };

    // Stop resizing
    const stopResize = () => {
        if (isResizing.value) {
            isResizing.value = false;
            resizeDirection.value = null;
            saveDimensions();

            // Restore default cursor and selection
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }

        // Remove global listeners
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);
    };

    // Get appropriate cursor for resize direction
    const getCursorForDirection = (direction) => {
        const cursorMap = {
            n: 'ns-resize',
            s: 'ns-resize',
            e: 'ew-resize',
            w: 'ew-resize',
            ne: 'nesw-resize',
            nw: 'nwse-resize',
            se: 'nwse-resize',
            sw: 'nesw-resize'
        };
        return cursorMap[direction] || 'default';
    };

    // Cleanup on unmount
    onBeforeUnmount(() => {
        stopResize();
        window.removeEventListener('resize', updateConstraints);
    });

    // Reset to default dimensions
    const resetDimensions = () => {
        dimensions.value = {
            width: defaults.width || 900,
            height: defaults.height || 600
        };
        saveDimensions();
    };

    return {
        dimensions,
        isResizing,
        resizeDirection,
        startResize,
        resetDimensions,
        getCursorForDirection
    };
}
