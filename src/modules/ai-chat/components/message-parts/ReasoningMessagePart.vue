<template>
    <div class="reasoning-message-part">
        <button
            class="reasoning-toggle"
            :aria-expanded="isExpanded"
            aria-controls="reasoning-content"
            @click="isExpanded = !isExpanded"
        >
            <svg
                class="toggle-icon"
                :class="{ expanded: isExpanded }"
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
            <span class="reasoning-label">
                <svg
                    class="brain-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                Reasoning
            </span>
            <span class="token-count">{{ tokenCount }} tokens</span>
        </button>

        <div
            v-if="isExpanded"
            id="reasoning-content"
            class="reasoning-content"
        >
            <MarkdownRenderer :content="part.content" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import MarkdownRenderer from '../MarkdownRenderer.vue';

const props = defineProps({
    part: {
        type: Object,
        required: true,
        validator: value => value.type === 'reasoning' && typeof value.content === 'string'
    }
});

const isExpanded = ref(false);

// Rough token estimation (1 token ≈ 4 characters)
const tokenCount = computed(() => Math.ceil(props.part.content.length / 4));
</script>

<style scoped>
.reasoning-message-part {
    margin: var(--spacing-3) 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface-secondary);
}

.reasoning-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
}

.reasoning-toggle:hover {
    background: var(--color-white-alpha-05);
    color: var(--color-text-primary);
}

.toggle-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.toggle-icon.expanded {
    transform: rotate(90deg);
}

.reasoning-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    font-weight: var(--font-weight-medium);
    flex: 1;
}

.brain-icon {
    width: 16px;
    height: 16px;
    color: var(--color-info);
}

.token-count {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    padding: 2px var(--spacing-2);
    background: var(--color-white-alpha-05);
    border-radius: var(--radius-base);
}

.reasoning-content {
    padding: 0 var(--spacing-3) var(--spacing-3) var(--spacing-3);
    animation: slideDown 0.2s ease;
    border-top: 1px solid var(--color-border);
    margin-top: var(--spacing-2);
    padding-top: var(--spacing-3);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
