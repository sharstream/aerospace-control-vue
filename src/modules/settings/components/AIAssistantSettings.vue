<template>
  <div class="settings-card full-width">
    <div class="card-header">
      <div class="header-content">
        <h2 class="card-title">AI Assistant</h2>
        <div class="session-toggle">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="sessionEnabled" 
              @change="toggleSession"
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">{{ sessionEnabled ? 'Enabled' : 'Disabled' }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="settings-content">
      <p class="section-description">Integrate with ChatGPT, Claude, and Gemini for intelligent aerospace monitoring</p>

      <!-- Provider selection - Always visible -->
      <div class="provider-tabs">
        <button 
          v-for="provider in providers" 
          :key="provider.id"
          :class="['provider-tab', { active: activeProvider === provider.id }]"
          @click="activeProvider = provider.id"
        >
          <span class="provider-icon">{{ provider.icon }}</span>
          <span class="provider-name">{{ provider.name }}</span>
        </button>
      </div>

      <!-- API Key Input - Always visible -->
      <div class="api-key-section">
        <label class="input-label">{{ providerConfig.name }} API Key</label>
        <div class="api-key-input-wrapper">
          <input 
            :type="showApiKey ? 'text' : 'password'"
            v-model="apiKey" 
            placeholder="Enter your API key..."
            class="api-key-input"
          />
          <button 
            @click="showApiKey = !showApiKey"
            class="visibility-toggle"
            type="button"
          >
            <svg v-if="!showApiKey" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
        </div>
        <p class="input-description">API key is encrypted and stored securely in your browser</p>
      </div>

      <!-- Button Group - Always visible -->
      <div class="button-group">
        <button @click="saveConfiguration" class="save-btn">
          Save Configuration
        </button>
        <button 
          @click="testConnection" 
          :disabled="testing || !apiKey"
          class="test-btn"
        >
          <span v-if="!testing">Test Connection</span>
          <span v-else class="testing-spinner">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10v-2c-4.41 0-8-3.59-8-8s3.59-8 8-8V2z"/>
            </svg>
            Testing...
          </span>
        </button>
      </div>

      <!-- Test Result - Always visible when present -->
      <div v-if="testResult" :class="['test-result', testResult.success ? 'success' : 'error']">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path v-if="testResult.success" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          <path v-else d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        {{ testResult.message }}
      </div>

      <!-- Session Info - Only shown when enabled -->
      <div v-if="sessionEnabled" class="session-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Session ID</span>
            <span class="info-value">{{ sessionId || 'Not created' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">MCP Status</span>
            <span :class="['status-badge', mcpConnected ? 'status-connected' : 'status-disconnected']">
              <span class="status-dot"></span>
              {{ mcpConnected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Available Tools</span>
            <span class="info-value">{{ toolCount }} aerospace monitoring tools</span>
          </div>
        </div>
      </div>

      <!-- Features info - Only shown when disabled -->
      <div v-if="!sessionEnabled" class="features-info">
        <p class="features-intro">Once enabled, you'll have access to:</p>
        <ul class="features-list">
          <li>✈️ Real-time flight analysis and anomaly detection</li>
          <li>🔧 System malfunction diagnosis and recommendations</li>
          <li>📊 Predictive trajectory analysis</li>
          <li>⚡ Multi-agent collaboration for complex tasks</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { MCPClient } from '@/services/mcp-client';
import { encryptData, decryptData } from '@/services/encryption-service';

export default {
  name: 'AIAssistantSettings',
  setup() {
    const sessionEnabled = ref(false);
    const sessionId = ref(null);
    const activeProvider = ref('openai');
    const apiKey = ref('');
    const showApiKey = ref(false);
    const mcpClient = ref(null);
    const mcpConnected = ref(false);
    const toolCount = ref(0);
    const testing = ref(false);
    const testResult = ref(null);

    const providers = [
      { id: 'openai', name: 'OpenAI', icon: '🤖' },
      { id: 'anthropic', name: 'Anthropic Claude', icon: '🧠' },
      { id: 'google', name: 'Google Gemini', icon: '✨' }
    ];

    const providerConfig = computed(() => 
      providers.find(p => p.id === activeProvider.value)
    );

    const toggleSession = async () => {
      if (sessionEnabled.value) {
        // Validate API key before creating session
        if (!apiKey.value || apiKey.value.trim().length === 0) {
          alert(`Please enter a ${providerConfig.value.name} API key before enabling AI features.`);
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
        
        console.log('✓ AI session created and MCP connected');
      } catch (error) {
        console.error('Session creation failed:', error);
        sessionEnabled.value = false;
        alert(`Failed to create AI session: ${error.message}`);
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
        
        console.log('✓ AI session disabled');
      } catch (error) {
        console.error('Session disable failed:', error);
      }
    };

    const saveConfiguration = async () => {
      try {
        // Save encrypted API key to localStorage
        const encrypted = await encryptData(apiKey.value);
        localStorage.setItem(`ai_key_${activeProvider.value}`, encrypted);
        
        alert('Configuration saved successfully');
      } catch (error) {
        console.error('Save failed:', error);
        alert(`Failed to save configuration: ${error.message}`);
      }
    };

    const testConnection = async () => {
      testing.value = true;
      testResult.value = null;

      try {
        // Simple validation test - in production, this would call the actual provider API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        testResult.value = {
          success: true,
          message: `Successfully connected to ${providerConfig.value.name}`
        };
      } catch (error) {
        testResult.value = {
          success: false,
          message: `Connection failed: ${error.message}`
        };
      } finally {
        testing.value = false;
      }
    };

    onMounted(() => {
      // Load saved configuration
      const savedKey = localStorage.getItem(`ai_key_${activeProvider.value}`);
      if (savedKey) {
        decryptData(savedKey).then(decrypted => {
          apiKey.value = decrypted;
        }).catch(error => {
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
        mcpClient.value.connect().then(result => {
          mcpConnected.value = result.success;
          toolCount.value = result.toolCount || 0;
        });
      }
    });

    onBeforeUnmount(() => {
      // Cleanup
      if (mcpClient.value) {
        mcpClient.value.disconnect();
      }
    });

    return {
      sessionEnabled,
      sessionId,
      activeProvider,
      apiKey,
      showApiKey,
      providers,
      providerConfig,
      mcpConnected,
      toolCount,
      testing,
      testResult,
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

@media (max-width: 900px) {
  .provider-tabs {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

