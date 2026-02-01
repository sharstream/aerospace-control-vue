import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Composable for making elements draggable
 * Persists position to localStorage for consistency across sessions
 *
 * @param {String} storageKey - localStorage key for persisting position
 * @returns {Object} - Draggable state and methods
 */
export function useDraggable(storageKey = 'draggable-position') {
    const position = ref({ x: 100, y: 100 });
    const isDragging = ref(false);
    const dragStart = ref({ x: 0, y: 0 });

    // Load saved position from localStorage
    onMounted(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                position.value = parsed;
            } catch (e) {
                console.warn('Failed to parse saved position:', e);
            }
        }
    });

    // Save position to localStorage
    const savePosition = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(position.value));
        } catch (e) {
            console.warn('Failed to save position:', e);
        }
    };

    // Start dragging
    const startDrag = (event) => {
        event.preventDefault();
        isDragging.value = true;

        // Store initial mouse position relative to element position
        dragStart.value = {
            x: event.clientX - position.value.x,
            y: event.clientY - position.value.y
        };

        // Add global listeners
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'move';
    };

    // Handle drag movement
    const onDrag = (event) => {
        if (!isDragging.value) return;

        // Calculate new position
        let newX = event.clientX - dragStart.value.x;
        let newY = event.clientY - dragStart.value.y;

        // Boundary constraints (keep within viewport)
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - 100; // Leave space for visibility
        const maxY = window.innerHeight - 100;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        position.value = { x: newX, y: newY };
    };

    // Stop dragging
    const stopDrag = () => {
        if (isDragging.value) {
            isDragging.value = false;
            savePosition();

            // Restore default cursor and selection
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }

        // Remove global listeners
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    };

    // Cleanup on unmount
    onBeforeUnmount(() => {
        stopDrag();
    });

    // Reset to default position
    const resetPosition = () => {
        position.value = { x: 100, y: 100 };
        savePosition();
    };

    return {
        position,
        isDragging,
        startDrag,
        resetPosition
    };
}
