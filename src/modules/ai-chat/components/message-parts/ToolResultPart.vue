<template>
    <div class="tool-result-part">
        <div class="result-header">
            <svg
                class="status-icon"
                :class="statusClass"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    v-if="isSuccess"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span class="tool-name">{{ part.content.toolName }}</span>
            <span class="status-text">{{ statusText }}</span>

            <button
                v-if="hasPreview"
                class="preview-btn"
                title="View details in preview panel"
                @click="handleShowPreview"
            >
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                View Details
            </button>
        </div>

        <div
            v-if="part.content.summary"
            class="result-summary"
        >
            {{ part.content.summary }}
        </div>

        <button
            v-if="hasDetailedData"
            class="toggle-details"
            :aria-expanded="showDetails"
            @click="showDetails = !showDetails"
        >
            <svg
                class="toggle-icon"
                :class="{ expanded: showDetails }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                />
            </svg>
            {{ showDetails ? 'Hide' : 'Show' }} raw data
        </button>

        <pre
            v-if="showDetails && hasDetailedData"
            class="raw-data"
        ><code>{{ JSON.stringify(part.content.data, null, 2) }}</code></pre>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    part: {
        type: Object,
        required: true,
        validator: value => value.type === 'tool-result'
    }
});

const emit = defineEmits(['show-preview']);

const showDetails = ref(false);

const isSuccess = computed(() => !props.part.content.error);

const statusClass = computed(() => (isSuccess.value ? 'success' : 'error'));

const statusText = computed(() => (isSuccess.value ? 'completed' : 'failed'));

const hasPreview = computed(() => props.part.content.previewType && props.part.content.data);

const hasDetailedData = computed(() => props.part.content.data && Object.keys(props.part.content.data).length > 0);

const handleShowPreview = () => {
    if (hasPreview.value) {
        emit('show-preview', {
            type: props.part.content.previewType,
            data: props.part.content.data
        });
    }
};
</script>

<style scoped>
.tool-result-part {
    margin: var(--spacing-3) 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-secondary);
}

.result-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
}

.status-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.status-icon.success {
    color: var(--color-success);
}

.status-icon.error {
    color: var(--color-error);
}

.tool-name {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-white);
    font-weight: var(--font-weight-medium);
}

.status-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.preview-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    padding: 4px var(--spacing-2);
    background: var(--color-primary-alpha-10);
    border: 1px solid var(--color-primary-alpha-30);
    border-radius: var(--radius-base);
    color: var(--color-primary);
    cursor: pointer;
    font-size: var(--font-size-xs);
    transition: all 0.2s ease;
}

.preview-btn:hover {
    background: var(--color-primary-alpha-20);
    border-color: var(--color-primary);
}

.preview-btn svg {
    width: 14px;
    height: 14px;
}

.result-summary {
    padding: 0 var(--spacing-3) var(--spacing-3) var(--spacing-3);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
}

.toggle-details {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    background: transparent;
    border: none;
    border-top: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: var(--font-size-xs);
    width: 100%;
    transition: all 0.2s ease;
}

.toggle-details:hover {
    background: var(--color-white-alpha-05);
    color: var(--color-text-primary);
}

.toggle-icon {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
}

.toggle-icon.expanded {
    transform: rotate(90deg);
}

.raw-data {
    padding: var(--spacing-3);
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    overflow-x: auto;
    margin: 0;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    animation: slideDown 0.2s ease;
}

.raw-data code {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-primary);
    line-height: var(--line-height-relaxed);
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
    }

    to {
        opacity: 1;
        max-height: 1000px;
    }
}
</style>
