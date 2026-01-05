/**
 * Agent Message Bus Client
 * Enables multiple AI agents to coordinate via WebSocket
 *
 * Implements peer-to-peer message pattern for multi-agent collaboration
 * on complex aerospace monitoring tasks.
 */

/* eslint-disable no-underscore-dangle */
export class AgentMessageBusClient {
  constructor(agentId, capabilities = []) {
    this.agentId = agentId;
    this.capabilities = capabilities;
    this.ws = null;
    this.subscriptions = new Map(); // topic -> callback
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to message bus
   *
   * @param {string} wsUrl - Optional WebSocket URL override
   * @returns {Promise<boolean>} Connection success
   */
  connect(wsUrl = null) {
    return new Promise((resolve, reject) => {
      const url = wsUrl || `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/agents/${this.agentId}`;

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log(`✓ Agent ${this.agentId} connected to message bus`);
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this._handleMessage(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('Message bus connection error:', error);
          this.connected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log(`✗ Agent ${this.agentId} disconnected from message bus`);
          this.connected = false;
          this._attemptReconnect();
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect to message bus
   * Uses exponential backoff
   */
  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Subscribe to topics
   *
   * @param {string|Array<string>} topics - Topic name(s)
   * @param {Function} callback - Message handler
   */
  subscribe(topics, callback) {
    const topicArray = Array.isArray(topics) ? topics : [topics];

    topicArray.forEach((topic) => {
      this.subscriptions.set(topic, callback);
    });

    if (this.connected) {
      this._send({
        action: 'subscribe',
        topics: topicArray
      });
    }
  }

  /**
   * Unsubscribe from topics
   *
   * @param {string|Array<string>} topics - Topic name(s)
   */
  unsubscribe(topics) {
    const topicArray = Array.isArray(topics) ? topics : [topics];

    topicArray.forEach((topic) => {
      this.subscriptions.delete(topic);
    });

    if (this.connected) {
      this._send({
        action: 'unsubscribe',
        topics: topicArray
      });
    }
  }

  /**
   * Publish message to topic
   *
   * @param {string} topic - Topic name
   * @param {Object} message - Message data
   */
  publish(topic, message) {
    if (!this.connected) {
      console.warn('Not connected to message bus');
      return;
    }

    this._send({
      action: 'publish',
      topic,
      message
    });
  }

  /**
   * Request collaboration from agents with specific capability
   *
   * @param {string} capability - Required capability
   * @param {Object} context - Collaboration context
   * @returns {Promise<Object>} Collaboration request result
   */
  requestCollaboration(capability, context) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Not connected to message bus'));
        return;
      }

      this._send({
        action: 'request_collaboration',
        capability,
        context
      });

      // Store callback for response
      const timeout = setTimeout(() => {
        reject(new Error('Collaboration request timeout'));
      }, 30000); // 30 second timeout

      // Subscribe to collaboration responses
      this.subscribe('collaboration_response', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });
  }

  /**
   * Send direct message to specific agent
   *
   * @param {string} recipientId - Target agent ID
   * @param {Object} message - Message data
   * @returns {Promise<void>}
   */
  async directMessage(recipientId, message) {
    if (!this.connected) {
      throw new Error('Not connected to message bus');
    }

    this._send({
      action: 'direct_message',
      recipient: recipientId,
      message
    });
  }

  /**
   * Get list of connected agents
   *
   * @returns {Promise<Array>} List of connected agents
   */
  getConnectedAgents() {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('Not connected to message bus'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Get agents timeout'));
      }, 5000);

      // Listen for response
      const responseHandler = (message) => {
        if (message.status === 'ok' && message.agents) {
          clearTimeout(timeout);
          resolve(message.agents);
        }
      };

      // Temporary one-time listener
      const originalOnMessage = this.ws.onmessage;
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        responseHandler(message);
        this.ws.onmessage = originalOnMessage;
      };

      this._send({ action: 'get_agents' });
    });
  }

  /**
   * Handle incoming message
   *
   * @param {Object} message - Message from server
   */
  _handleMessage(message) {
    const { topic, data, type } = message;

    // Handle status responses
    if (message.status) {
      console.log('Message bus status:', message.status);
      return;
    }

    // Handle topic messages
    if (topic) {
      const callback = this.subscriptions.get(topic);
      if (callback) {
        callback(data);
      }
    }

    // Handle direct messages
    if (type === 'direct_message') {
      const callback = this.subscriptions.get('direct_message');
      if (callback) {
        callback(data);
      }
    }
  }

  /**
   * Send message through WebSocket
   *
   * @param {Object} data - Data to send
   */
  _send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not ready, message not sent');
    }
  }

  /**
   * Disconnect from message bus
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.subscriptions.clear();
    console.log(`✓ Agent ${this.agentId} disconnected`);
  }

  /**
   * Check if connected
   *
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connected && this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}
