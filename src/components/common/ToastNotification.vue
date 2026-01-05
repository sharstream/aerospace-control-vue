<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <!-- Success Icon -->
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <!-- Error Icon -->
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <!-- Warning Icon -->
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <!-- Info Icon -->
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>

          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>

          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>

          <!-- Progress bar -->
          <div
            v-if="toast.duration"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
import { useToast } from '@/composables/useToast';

export default {
  name: 'ToastNotification',
  setup() {
    const { toasts, removeToast } = useToast();

    return {
      toasts,
      removeToast
    };
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 420px;
  width: 100%;
}

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-left: 4px solid;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
              0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: all;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: all 0.2s ease;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6),
              0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Toast Types */
.toast-success {
  border-left-color: #4ade80;
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(74, 222, 128, 0.05) 100%);
}

.toast-error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.toast-warning {
  border-left-color: #fbbf24;
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(251, 191, 36, 0.05) 100%);
}

.toast-info {
  border-left-color: #5b9dd1;
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(91, 157, 209, 0.05) 100%);
}

/* Toast Icon */
.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-success .toast-icon {
  color: #4ade80;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #fbbf24;
}

.toast-info .toast-icon {
  color: #5b9dd1;
}

.toast-icon svg {
  width: 24px;
  height: 24px;
}

/* Toast Content */
.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}

.toast-message {
  font-size: 13px;
  color: #e0e0e0;
  line-height: 1.5;
  word-wrap: break-word;
}

/* Close Button */
.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.toast-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

/* Progress Bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  transform-origin: left;
  animation: toast-progress linear forwards;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-success .toast-progress {
  background: linear-gradient(90deg,
    rgba(74, 222, 128, 0.6) 0%,
    rgba(74, 222, 128, 0.2) 100%
  );
}

.toast-error .toast-progress {
  background: linear-gradient(90deg,
    rgba(239, 68, 68, 0.6) 0%,
    rgba(239, 68, 68, 0.2) 100%
  );
}

.toast-warning .toast-progress {
  background: linear-gradient(90deg,
    rgba(251, 191, 36, 0.6) 0%,
    rgba(251, 191, 36, 0.2) 100%
  );
}

.toast-info .toast-progress {
  background: linear-gradient(90deg,
    rgba(91, 157, 209, 0.6) 0%,
    rgba(91, 157, 209, 0.2) 100%
  );
}

/* Transitions */
.toast-enter-active {
  animation: toast-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  animation: toast-slide-out 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.95);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .toast-container {
    top: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }

  .toast {
    padding: 14px 16px;
  }

  .toast-title {
    font-size: 13px;
  }

  .toast-message {
    font-size: 12px;
  }
}

/* Dark theme optimization */
@media (prefers-color-scheme: dark) {
  .toast {
    background: #2a2a2a;
    border-color: #3a3a3a;
  }
}
</style>
