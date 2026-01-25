<template>
    <div
        class="message-item"
        :class="[message.role, { 'has-preview': hasPreviewPart }]"
    >
        <!-- Avatar -->
        <div class="message-avatar">
            <svg
                v-if="message.role === 'assistant'"
                class="bot-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <svg
                v-else-if="message.role === 'user'"
                class="user-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
            <svg
                v-else
                class="system-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </div>

        <!-- Message Content -->
        <div class="message-bubble">
            <div
                v-if="message.role !== 'system'"
                class="message-meta"
            >
                <span class="message-sender">{{ senderName }}</span>
                <span class="message-time">{{ formattedTime }}</span>
            </div>

            <!-- Render message parts dynamically -->
            <component
                :is="getPartComponent(part.type)"
                v-for="(part, idx) in message.parts"
                :key="idx"
                :part="part"
                @show-preview="handleShowPreview"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import TextMessagePart from '../message-parts/TextMessagePart.vue';
import ReasoningMessagePart from '../message-parts/ReasoningMessagePart.vue';
import ToolInvocationPart from '../message-parts/ToolInvocationPart.vue';
import ToolResultPart from '../message-parts/ToolResultPart.vue';

const props = defineProps({
    message: {
        type: Object,
        required: true,
        validator: value => (
            value.role
            && ['user', 'assistant', 'system'].includes(value.role)
            && Array.isArray(value.parts)
        )
    }
});

const emit = defineEmits(['show-preview']);

const senderName = computed(() => {
    if (props.message.role === 'user') return 'You';
    if (props.message.role === 'assistant') return 'Commander Atlas';
    return 'System';
});

const formattedTime = computed(() => {
    if (!props.message.timestamp) return '';

    const date = new Date(props.message.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

const hasPreviewPart = computed(() => props.message.parts.some(p => p.type === 'tool-result' && p.content?.previewType));

/**
 * Map part types to Vue components
 */
const getPartComponent = (type) => {
    const components = {
        text: TextMessagePart,
        reasoning: ReasoningMessagePart,
        'tool-invocation': ToolInvocationPart,
        'tool-result': ToolResultPart
    };

    return components[type] || TextMessagePart;
};

/**
 * Handle preview request from child components
 */
const handleShowPreview = (previewData) => {
    emit('show-preview', previewData);
};
</script>

<style scoped>
.message-item {
    display: flex;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    border-radius: var(--radius-md);
    transition: background 0.2s ease;
}

.message-item:hover {
    background: var(--color-white-alpha-05);
}

.message-item.user {
    background: var(--color-primary-alpha-10);
    border-left: 3px solid var(--color-primary);
}

.message-item.assistant {
    border-left: 3px solid var(--color-success);
}

.message-item.system {
    background: var(--color-warning-alpha-20);
    border-left: 3px solid var(--color-warning);
}

.message-item.has-preview {
    cursor: pointer;
}

.message-avatar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
}

.bot-icon,
.user-icon,
.system-icon {
    width: 20px;
    height: 20px;
}

.bot-icon {
    color: var(--color-success);
}

.user-icon {
    color: var(--color-primary);
}

.system-icon {
    color: var(--color-warning);
}

.message-bubble {
    flex: 1;
    min-width: 0; /* Allow text wrapping */
}

.message-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-2);
}

.message-sender {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-white);
    font-size: var(--font-size-sm);
}

.message-time {
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
}

/* Animation for new messages */
@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-item {
    animation: messageSlideIn 0.3s ease;
}
</style>
