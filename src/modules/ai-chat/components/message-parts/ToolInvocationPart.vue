<template>
    <div class="tool-invocation-part">
        <div class="tool-header">
            <svg
                class="tool-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
            <span class="tool-name">{{ part.content.name }}</span>
            <span
                class="tool-status"
                :class="part.content.status"
            >
                {{ formatStatus(part.content.status) }}
            </span>
        </div>

        <button
            v-if="hasParams"
            class="params-toggle"
            :aria-expanded="showParams"
            @click="showParams = !showParams"
        >
            <svg
                class="toggle-icon"
                :class="{ expanded: showParams }"
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
            View parameters
        </button>

        <pre
            v-if="showParams && hasParams"
            class="params-content"
        ><code>{{ JSON.stringify(part.content.params, null, 2) }}</code></pre>
    </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
    part: {
        type: Object,
        required: true,
        validator: value => value.type === 'tool-invocation'
    }
});

const showParams = ref(false);

const hasParams = computed(() => props.part.content.params && Object.keys(props.part.content.params).length > 0);

const formatStatus = (status) => {
    const statusMap = {
        pending: 'Pending',
        running: 'Running',
        completed: 'Completed',
        failed: 'Failed'
    };
    return statusMap[status] || status;
};
</script>

<style scoped>
.tool-invocation-part {
    margin: var(--spacing-3) 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-secondary);
}

.tool-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
}

.tool-icon {
    width: 18px;
    height: 18px;
    color: var(--color-primary);
    flex-shrink: 0;
}

.tool-name {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-sm);
    color: var(--color-text-white);
    font-weight: var(--font-weight-medium);
    flex: 1;
}

.tool-status {
    font-size: var(--font-size-xs);
    padding: 2px var(--spacing-2);
    border-radius: var(--radius-base);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.tool-status.pending {
    background: var(--color-warning-alpha-20);
    color: var(--color-warning);
}

.tool-status.running {
    background: var(--color-primary-alpha-20);
    color: var(--color-primary);
    animation: pulse 2s infinite;
}

.tool-status.completed {
    background: var(--color-success-alpha-20);
    color: var(--color-success);
}

.tool-status.failed {
    background: rgb(239 68 68 / 20%);
    color: var(--color-error);
}

.params-toggle {
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

.params-toggle:hover {
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

.params-content {
    padding: var(--spacing-3);
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border);
    overflow-x: auto;
    margin: 0;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    animation: slideDown 0.2s ease;
}

.params-content code {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-primary);
    line-height: var(--line-height-relaxed);
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
    }

    to {
        opacity: 1;
        max-height: 500px;
    }
}
</style>
