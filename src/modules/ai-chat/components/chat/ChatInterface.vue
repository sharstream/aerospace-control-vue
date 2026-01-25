<template>
  <div class="chat-interface">
    <div class="chat-header">
      <div class="chat-title">
        <h2>Commander Atlas</h2>
        <p>Aviation Systems Expert | Airfare Engineer | AI Co-Pilot</p>
        <p
          class="mcp-status"
          :class="{ connected: mcpConnected }"
        >
          {{ mcpStatusText }}
        </p>
      </div>
    </div>

    <div class="chat-actions">
      <button
        class="action-btn"
        @click="$emit('action', 'identify-bottlenecks')"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        Identify Bottlenecks
      </button>

      <button
        class="action-btn"
        @click="$emit('action', 'suggest-reroute')"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
        Suggest Reroute
      </button>
    </div>

    <MessageList
      :messages="messages"
      :is-loading="isLoading"
      @show-preview="$emit('show-preview', $event)"
    />

    <div class="message-input">
      <input
        v-model="inputText"
        type="text"
        placeholder="Ask about flight status, route optimization, or system monitoring..."
        @keypress.enter="handleSend"
      />
      <button
        class="send-btn"
        title="Send message"
        @click="handleSend"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import MessageList from './MessageList.vue';

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  mcpConnected: {
    type: Boolean,
    default: false
  },
  mcpStatusText: {
    type: String,
    default: 'MCP: Offline'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['action', 'send-message', 'show-preview']);

const inputText = ref('');

const handleSend = () => {
  if (!inputText.value.trim()) return;

  emit('send-message', inputText.value);
  inputText.value = '';
};
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-primary);
}

.chat-header {
  padding: var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-primary-alpha-10) 0%, var(--color-primary-alpha-20) 100%);
}

.chat-title h2 {
  font-size: var(--font-size-2xl);
  color: var(--color-text-white);
  margin: 0 0 4px 0;
  font-weight: var(--font-weight-semibold);
}

.chat-title p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.mcp-status {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mcp-status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-text-tertiary);
}

.mcp-status.connected {
  color: var(--color-success);
}

.mcp-status.connected::before {
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success-alpha-20);
}

.chat-actions {
  padding: var(--spacing-4);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.action-btn {
  padding: var(--spacing-3);
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-30);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-primary-alpha-20);
  border-color: var(--color-primary);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* MessageList component now handles message area styling */

.message-input {
  padding: var(--spacing-6) var(--spacing-5);
  border-top: 2px solid var(--color-border);
  background: linear-gradient(180deg, var(--color-black-alpha-40) 0%, var(--color-black-alpha-50) 100%);
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.message-input input {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
  background: linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
}

.message-input input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha-10);
}

.send-btn {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, var(--color-info) 0%, var(--color-info) 100%);
  border: 2px solid var(--color-primary-alpha-40);
  border-radius: var(--radius-xl);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%);
  transform: translateY(-2px) scale(1.05);
}

.send-btn svg {
  width: 24px;
  height: 24px;
}
</style>
