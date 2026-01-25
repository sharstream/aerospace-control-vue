<template>
  <div class="settings-card full-width">
    <div class="card-header">
      <div class="header-content">
        <h2 class="card-title">{{ $Labels.aiAssistant.title }}</h2>
        <div class="session-toggle">
          <label class="toggle-label">
            <input
              v-model="sessionEnabled"
              type="checkbox"
              class="toggle-input"
              @change="toggleSession"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">{{ sessionEnabled ? $Labels.aiAssistant.enabled : $Labels.aiAssistant.disabled }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="settings-content">
      <p class="section-description">{{ $Labels.aiAssistant.description }}</p>

      <!-- Provider selection - Always visible -->
      <div class="provider-tabs">
        <button
          v-for="provider in providers"
          :key="provider.id"
          :class="['provider-tab', { active: activeProvider === provider.id }]"
          @click="activeProvider = provider.id"
        >
          <span class="provider-icon">{{ provider.icon }}</span>
          <span class="provider-name">{{ $Labels.aiAssistant.providers[provider.id] }}</span>
        </button>
      </div>

      <!-- Model Selection Custom Dropdown -->
      <div class="model-selection">
        <label class="input-label">Model</label>
        <div
          class="model-dropdown-custom"
          @click="toggleModelDropdown"
        >
          <div class="selected-model">
            <div class="model-icon-wrapper">
              <component :is="getProviderIcon(activeProvider)" />
            </div>
            <div class="model-info">
              <span class="model-name">{{ selectedModel.name }}</span>
              <span
                v-if="selectedModel.description"
                class="model-description"
              >{{ selectedModel.description }}</span>
            </div>
            <svg
              class="dropdown-arrow"
              :class="{ open: modelDropdownOpen }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <transition name="dropdown">
            <div
              v-if="modelDropdownOpen"
              class="model-dropdown-menu"
            >
              <button
                v-for="model in currentProviderModels"
                :key="model.id"
                :class="['model-option', { selected: selectedModelId === model.id }]"
                @click.stop="selectModel(model.id)"
              >
                <div class="model-option-content">
                  <div class="model-icon-wrapper">
                    <component :is="getProviderIcon(activeProvider)" />
                  </div>
                  <div class="model-info">
                    <span class="model-name">{{ model.name }}</span>
                    <span
                      v-if="model.description"
                      class="model-description"
                    >{{ model.description }}</span>
                  </div>
                  <svg
                    v-if="selectedModelId === model.id"
                    class="check-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              </button>
            </div>
          </transition>
        </div>
        <p class="input-description">
          Select the AI model to use for this provider
        </p>
      </div>

      <!-- API Key Input - Always visible -->
      <div class="api-key-section">
        <label class="input-label">{{ $replacePlaceholders($Labels.aiAssistant.apiKey.label, { provider: providerConfig.name }) }}</label>
        <div class="api-key-input-wrapper">
          <input
            v-model="apiKey"
            :type="showApiKey ? 'text' : 'password'"
            :placeholder="$Labels.aiAssistant.apiKey.placeholder"
            class="api-key-input"
          />
          <button
            class="visibility-toggle"
            type="button"
            @click="showApiKey = !showApiKey"
          >
            <svg
              v-if="!showApiKey"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
            </svg>
          </button>
        </div>
        <p class="input-description">{{ $Labels.aiAssistant.apiKey.description }}</p>
      </div>

      <!-- Button Group - Always visible -->
      <div class="button-group">
        <button
          class="save-btn"
          @click="saveConfiguration"
        >
          {{ $Labels.aiAssistant.buttons.saveConfiguration }}
        </button>
        <button
          :disabled="testing || !apiKey"
          class="test-btn"
          @click="testConnection"
        >
          <span v-if="!testing">{{ $Labels.aiAssistant.buttons.testConnection }}</span>
          <span
            v-else
            class="testing-spinner"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                opacity=".3"
              />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10v-2c-4.41 0-8-3.59-8-8s3.59-8 8-8V2z" />
            </svg>
            {{ $Labels.aiAssistant.buttons.testing }}
          </span>
        </button>
      </div>

      <!-- Test Result removed - now using toast notifications -->

      <!-- Session Info - Only shown when enabled -->
      <div
        v-if="sessionEnabled"
        class="session-info"
      >
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ $Labels.aiAssistant.session.sessionIdLabel }}</span>
            <span class="info-value">{{ sessionId || $Labels.aiAssistant.session.notCreated }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $Labels.aiAssistant.session.mcpStatusLabel }}</span>
            <span :class="['status-badge', mcpConnected ? 'status-connected' : 'status-disconnected']">
              <span class="status-dot"></span>
              {{ mcpConnected ? $Labels.aiAssistant.session.connected : $Labels.aiAssistant.session.disconnected }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ $Labels.aiAssistant.session.availableToolsLabel }}</span>
            <span class="info-value">{{ $replacePlaceholders($Labels.aiAssistant.session.toolsCount, { count: toolCount }) }}</span>
          </div>
        </div>
      </div>

      <!-- Features info - Only shown when disabled -->
      <div
        v-if="!sessionEnabled"
        class="features-info"
      >
        <p class="features-intro">{{ $Labels.aiAssistant.features.intro }}</p>
        <ul class="features-list">
          <li>{{ $Labels.aiAssistant.features.flightAnalysis }}</li>
          <li>{{ $Labels.aiAssistant.features.systemDiagnosis }}</li>
          <li>{{ $Labels.aiAssistant.features.trajectoryAnalysis }}</li>
          <li>{{ $Labels.aiAssistant.features.multiAgent }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance, h, watch } from 'vue';
import { MCPClient } from '@/services/mcp-client';
import { encryptData, decryptData } from '@/services/encryption-service';
import { useToast } from '@/composables/useToast';

// Provider Icon Components
const OpenAIIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  class: 'provider-logo'
}, [
  h('path', {
    d: 'M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z'
  })
]);

const AnthropicIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  class: 'provider-logo'
}, [
  h('path', {
    d: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm6.5 14L12 19.5 5.5 16V8L12 4.5 18.5 8v8z'
  }),
  h('path', {
    d: 'M12 6L8 8v8l4 2 4-2V8l-4-2zm0 2.5L14.5 10v4L12 15.5 9.5 14v-4L12 8.5z'
  })
]);

const GoogleIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  class: 'provider-logo'
}, [
  h('path', {
    d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
    fill: '#4285F4'
  }),
  h('path', {
    d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z',
    fill: '#34A853'
  }),
  h('path', {
    d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z',
    fill: '#FBBC05'
  }),
  h('path', {
    d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
    fill: '#EA4335'
  })
]);

export default {
  name: 'AIAssistantSettings',
  setup() {
    const sessionEnabled = ref(false);
    const sessionId = ref(null);
    const activeProvider = ref('openai');
    const selectedModelId = ref('gpt-4-turbo');
    const modelDropdownOpen = ref(false);
    const apiKey = ref('');
    const showApiKey = ref(false);
    const mcpClient = ref(null);
    const mcpConnected = ref(false);
    const toolCount = ref(0);
    const testing = ref(false);

    // Toast notifications
    const { showSuccess, showError, showWarning } = useToast();

    // Access global properties ($Labels, $replacePlaceholders)
    const app = getCurrentInstance();
    const { $Labels, $replacePlaceholders } = app.appContext.config.globalProperties;

    const providers = [
      { id: 'openai', name: 'OpenAI', icon: '🤖' },
      { id: 'anthropic', name: 'Anthropic Claude', icon: '🧠' },
      { id: 'google', name: 'Google Gemini', icon: '✨' }
    ];

    // Static model data for UI display only
    const providerModels = {
      openai: [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Most capable, multimodal' },
        { id: 'gpt-4', name: 'GPT-4', description: 'High intelligence' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' }
      ],
      anthropic: [
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and compact' }
      ],
      google: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile' },
        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Efficient' }
      ]
    };

    const providerConfig = computed(() => providers.find(p => p.id === activeProvider.value));

    // Current provider models
    const currentProviderModels = computed(() => providerModels[activeProvider.value] || []);

    // Selected model object
    const selectedModel = computed(() => {
      const models = currentProviderModels.value;
      return models.find(m => m.id === selectedModelId.value) || models[0] || {};
    });

    // Get provider icon component
    const getProviderIcon = (providerId) => {
      const iconMap = {
        openai: OpenAIIcon,
        anthropic: AnthropicIcon,
        google: GoogleIcon
      };
      return iconMap[providerId] || OpenAIIcon;
    };

    // Toggle model dropdown
    const toggleModelDropdown = () => {
      modelDropdownOpen.value = !modelDropdownOpen.value;
    };

    // Select model
    const selectModel = (modelId) => {
      selectedModelId.value = modelId;
      modelDropdownOpen.value = false;
    };

    // Watch provider changes to update selected model
    watch(activeProvider, (newProvider) => {
      const models = providerModels[newProvider] || [];
      if (models.length > 0) {
        selectedModelId.value = models[0].id;
      }
      modelDropdownOpen.value = false;
    });

    const toggleSession = async () => {
      if (sessionEnabled.value) {
        // Validate API key before creating session
        if (!apiKey.value || apiKey.value.trim().length === 0) {
          const message = $replacePlaceholders(
            $Labels.aiAssistant.validation.apiKeyRequired,
            { provider: providerConfig.value.name }
          );
          showWarning(message, $Labels.aiAssistant.title);
          sessionEnabled.value = false;
          return;
        }
        await createSession();
      } else {
        await disableSession();
      }
    };

    const createSession = async () => {
      try {
        // Encrypt API key
        const encrypted = await encryptData(apiKey.value);

        // Create session on backend
        const response = await fetch('http://localhost:8000/api/v1/ai-session/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: activeProvider.value,
            model: selectedModelId.value,
            encrypted_api_key: encrypted
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        const data = await response.json();
        sessionId.value = data.session_id;

        // Store session ID
        localStorage.setItem('ai_session_id', sessionId.value);

        // Connect to MCP server
        mcpClient.value = new MCPClient(sessionId.value);
        const result = await mcpClient.value.connect();
        mcpConnected.value = result.success;
        toolCount.value = result.toolCount || 0;

        // Show success toast
        showSuccess(
          `AI session created successfully with ${toolCount.value} tools available`,
          'Session Created'
        );
      } catch (error) {
        console.error('Session creation failed:', error);
        sessionEnabled.value = false;

        const message = $replacePlaceholders(
          $Labels.aiAssistant.validation.sessionCreationFailed,
          { error: error.message }
        );
        showError(message, $Labels.aiAssistant.title);
      }
    };

    const disableSession = async () => {
      try {
        if (sessionId.value) {
          // Disable session on backend
          await fetch(`http://localhost:8000/api/v1/ai-session/${sessionId.value}/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: false })
          });

          // Disconnect MCP client
          if (mcpClient.value) {
            mcpClient.value.disconnect();
          }
        }

        mcpClient.value = null;
        mcpConnected.value = false;
        sessionId.value = null;
        localStorage.removeItem('ai_session_id');

        showSuccess('AI session disabled successfully', 'Session Disabled');
      } catch (error) {
        console.error('Session disable failed:', error);
        showError(`Failed to disable session: ${error.message}`, 'Error');
      }
    };

    const saveConfiguration = async () => {
      try {
        // Save encrypted API key to localStorage
        const encrypted = await encryptData(apiKey.value);
        localStorage.setItem(`ai_key_${activeProvider.value}`, encrypted);

        showSuccess($Labels.aiAssistant.validation.configSaved, 'Success');
      } catch (error) {
        console.error('Save failed:', error);

        const message = $replacePlaceholders(
          $Labels.aiAssistant.validation.configSaveFailed,
          { error: error.message }
        );
        showError(message, 'Error');
      }
    };

    const testConnection = async () => {
      testing.value = true;

      try {
        // Simple validation test - in production, this would call the actual provider API
        await new Promise((resolve) => {
          setTimeout(resolve, 1500);
        });

        const message = `${$Labels.aiAssistant.testResults.successPrefix} ${providerConfig.value.name}`;
        showSuccess(message, 'Connection Test');
      } catch (error) {
        const message = `${$Labels.aiAssistant.testResults.failurePrefix} ${error.message}`;
        showError(message, 'Connection Test');
      } finally {
        testing.value = false;
      }
    };

    onMounted(() => {
      // Load saved configuration
      const savedKey = localStorage.getItem(`ai_key_${activeProvider.value}`);
      if (savedKey) {
        decryptData(savedKey).then((decrypted) => {
          apiKey.value = decrypted;
        }).catch((error) => {
          console.error('Failed to decrypt saved key:', error);
        });
      }

      // Check for existing session
      const savedSessionId = localStorage.getItem('ai_session_id');
      if (savedSessionId) {
        sessionId.value = savedSessionId;
        sessionEnabled.value = true;

        // Try to reconnect
        mcpClient.value = new MCPClient(savedSessionId);
        mcpClient.value.connect().then((result) => {
          mcpConnected.value = result.success;
          toolCount.value = result.toolCount || 0;
        });
      }

      // Close dropdown on click outside
      document.addEventListener('click', handleClickOutside);
    });

    // Handle click outside dropdown
    const handleClickOutside = (event) => {
      const dropdown = event.target.closest('.model-dropdown-custom');
      if (!dropdown && modelDropdownOpen.value) {
        modelDropdownOpen.value = false;
      }
    };

    onBeforeUnmount(() => {
      // Cleanup
      if (mcpClient.value) {
        mcpClient.value.disconnect();
      }
      // Remove click outside listener
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      sessionEnabled,
      sessionId,
      activeProvider,
      selectedModelId,
      modelDropdownOpen,
      apiKey,
      showApiKey,
      providers,
      providerConfig,
      currentProviderModels,
      selectedModel,
      mcpConnected,
      toolCount,
      testing,
      getProviderIcon,
      toggleModelDropdown,
      selectModel,
      toggleSession,
      saveConfiguration,
      testConnection
    };
  }
};
</script>

<style scoped>
.settings-card {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 32px;
}

.settings-card.full-width {
  width: 100%;
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #3a3a3a;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.settings-content {
  padding: 32px;
}

.section-description {
  color: #888;
  font-size: 14px;
  margin: 0 0 24px 0;
}

.session-toggle {
  flex-shrink: 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background: #3a3a3a;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
}

.toggle-input:checked + .toggle-slider {
  background: #4ade80;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(24px);
}

.toggle-text {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-input:checked ~ .toggle-text {
  color: #4ade80;
}

.provider-config {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.provider-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.provider-tab {
  padding: 16px;
  background: #1f1f1f;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
}

.provider-tab:hover {
  border-color: #4a7ba7;
}

.provider-tab.active {
  border-color: #5b9dd1;
  background: rgba(91, 157, 209, 0.1);
  color: #5b9dd1;
}

.provider-icon {
  font-size: 20px;
}

.provider-name {
  font-size: 14px;
  font-weight: 500;
}

.api-key-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.input-label {
  font-size: 12px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.api-key-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.api-key-input {
  width: 100%;
  padding: 14px 48px 14px 16px;
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  transition: all 0.2s ease;
}

.api-key-input::placeholder {
  color: #666;
}

.api-key-input:focus {
  outline: none;
  border-color: #5b9dd1;
  background: #252525;
}

.visibility-toggle {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.visibility-toggle:hover {
  color: #5b9dd1;
}

.visibility-toggle svg {
  width: 20px;
  height: 20px;
}

.input-description {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  align-items: center;
}

.save-btn {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #5b9dd1;
}

.save-btn:hover {
  background: rgba(91, 157, 209, 0.1);
  border-color: #5b9dd1;
  transform: translateY(-2px);
}

.save-btn:active {
  transform: translateY(0);
}

.test-btn {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #5b9dd1;
}

.test-btn:hover:not(:disabled) {
  background: rgba(91, 157, 209, 0.1);
  border-color: #5b9dd1;
  transform: translateY(-2px);
}

.test-btn:active:not(:disabled) {
  transform: translateY(0);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.testing-spinner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.testing-spinner svg {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.test-result {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
}

.test-result.success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
}

.test-result.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.test-result svg {
  width: 20px;
  height: 20px;
}

.session-info {
  padding: 20px;
  background: #1f1f1f;
  border: 1px solid #3a3a3a;
  border-radius: 12px;
  margin-top: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.info-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-connected {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.status-connected .status-dot {
  background: #4ade80;
  animation: pulse 2s infinite;
}

.status-disconnected {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.status-disconnected .status-dot {
  background: #9ca3af;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.features-info {
  padding: 24px;
  background: rgba(91, 157, 209, 0.05);
  border: 1px solid rgba(91, 157, 209, 0.2);
  border-radius: 12px;
  margin-top: 24px;
}

.features-intro {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
  color: #e0e0e0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.features-list li {
  font-size: 14px;
  color: #e0e0e0;
  padding-left: 8px;
}

/* Model Selection Custom Dropdown */
.model-selection {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  position: relative;
}

.model-dropdown-custom {
  position: relative;
  width: 100%;
  cursor: pointer;
  user-select: none;
}

.selected-model {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #1f1f1f;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.model-dropdown-custom:hover .selected-model {
  border-color: #4a7ba7;
  background: #252525;
}

.model-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(91, 157, 209, 0.1);
  border-radius: 8px;
  padding: 6px;
}

.model-icon-wrapper :deep(.provider-logo) {
  width: 100%;
  height: 100%;
  color: #5b9dd1;
}

.model-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.model-name {
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
  line-height: 1.3;
}

.model-description {
  font-size: 12px;
  color: #888;
  line-height: 1.3;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  color: #888;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.model-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1f1f1f;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.model-dropdown-menu::-webkit-scrollbar {
  width: 8px;
}

.model-dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.model-dropdown-menu::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 4px;
}

.model-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

.model-option {
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease;
  padding: 0;
  border-bottom: 1px solid #2a2a2a;
}

.model-option:last-child {
  border-bottom: none;
}

.model-option:hover {
  background: #252525;
}

.model-option.selected {
  background: #4a7ba7;
}

.model-option.selected:hover {
  background: #5b9dd1;
}

.model-option-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.model-option .model-name {
  font-size: 15px;
  font-weight: 600;
  color: #e0e0e0;
}

.model-option.selected .model-name {
  color: #ffffff;
}

.model-option .model-description {
  font-size: 12px;
  color: #888;
}

.model-option.selected .model-description {
  color: rgba(255, 255, 255, 0.8);
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
  flex-shrink: 0;
  margin-left: auto;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}

@media (max-width: 900px) {
  .provider-tabs {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
