<template>
  <div class="message-list-scroll">
    <div
      ref="messageContainer"
      class="message-list"
    >
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @show-preview="$emit('show-preview', $event)"
      />

      <!-- Loading indicator -->
      <div
        v-if="isLoading"
        class="loading-indicator"
      >
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="loading-text">Commander Atlas is thinking...</span>
      </div>

      <!-- Empty state -->
      <div
        v-if="!isLoading && messages.length === 0"
        class="empty-state"
      >
        <svg
          class="empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p>No messages yet</p>
        <span class="empty-hint">Start a conversation with Commander Atlas</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, defineProps, defineEmits } from 'vue';
import MessageItem from './MessageItem.vue';

const props = defineProps({
    messages: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
});

defineEmits(['show-preview']);

const messageContainer = ref(null);

/**
 * Auto-scroll to bottom when new messages arrive
 */
const scrollToBottom = () => {
    nextTick(() => {
        if (messageContainer.value) {
            const scrollContainer = messageContainer.value.parentElement;
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    });
};

// Watch for new messages and scroll
watch(
    () => props.messages.length,
    () => {
        scrollToBottom();
    }
);

// Watch for loading state changes
watch(
    () => props.isLoading,
    () => {
        scrollToBottom();
    }
);
</script>

<style scoped>
.message-list-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Custom scrollbar styling */
.message-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.message-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.message-list-scroll::-webkit-scrollbar-thumb {
  background: var(--color-text-tertiary);
  border-radius: var(--radius-base);
}

.message-list-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

.message-list {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-height: 100%;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-success);
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-success);
  animation: dotPulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-style: italic;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-8);
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-3);
}

.empty-state p {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-1) 0;
  color: var(--color-text-secondary);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
