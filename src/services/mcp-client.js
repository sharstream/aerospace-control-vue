/**
 * MCP Client for connecting to SkySentinel FastMCP server
 * Implements progressive tool disclosure for context efficiency
 * 
 * Reduces initial context consumption by ~95% by loading tools on-demand
 * based on conversation content.
 */

const MCP_SERVER_URL = import.meta.env.VITE_MCP_SERVER_URL || 'http://localhost:8000/mcp';

export class MCPClient {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.availableTools = [];
    this.availableSkills = [];
    this.connected = false;
  }

  /**
   * Initialize MCP connection and fetch initial tool catalog
   * 
   * @returns {Promise<Object>} Connection result with tool count
   */
  async connect() {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/tools/list`, {
        headers: {
          'X-Session-ID': this.sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error(`MCP connection failed: ${response.status}`);
      }
      
      const data = await response.json();
      this.availableTools = data.tools;  // Lightweight tool catalog
      this.availableSkills = data.skills;  // Skill descriptions only
      this.connected = true;
      
      console.log('✓ MCP connected:', {
        tools: this.availableTools.length,
        skills: this.availableSkills.length
      });
      
      return {
        success: true,
        toolCount: this.availableTools.length,
        skillCount: this.availableSkills.length
      };
    } catch (error) {
      console.error('MCP connection failed:', error);
      this.connected = false;
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request specific tools/skills based on conversation context
   * Backend analyzes context and returns only relevant items
   * 
   * @param {Array} conversationHistory - List of {role, content} messages
   * @returns {Promise<Object>} Tools and skills payload
   */
  async requestTools(conversationHistory) {
    if (!this.connected) {
      console.warn('MCP not connected, attempting reconnection...');
      await this.connect();
    }
    
    try {
      const response = await fetch(`${MCP_SERVER_URL}/tools/inject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify({ conversation: conversationHistory })
      });
      
      if (!response.ok) {
        throw new Error(`Tool injection failed: ${response.status}`);
      }
      
      const toolsPayload = await response.json();
      
      console.log('✓ Tools injected:', {
        tools: toolsPayload.tools.length,
        skills: toolsPayload.skills.length,
        efficiency: toolsPayload.metadata.context_efficiency
      });
      
      // Backend analyzed context and returned relevant tools/skills
      return toolsPayload;  // { tools: [...], skills: [...], metadata: {...} }
    } catch (error) {
      console.error('Tool injection failed:', error);
      return { tools: [], skills: [], metadata: {} };
    }
  }

  /**
   * Execute tool on backend
   * 
   * @param {string} toolName - Name of tool to execute
   * @param {Object} parameters - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async executeTool(toolName, parameters) {
    if (!this.connected) {
      throw new Error('MCP not connected');
    }
    
    try {
      const response = await fetch(`${MCP_SERVER_URL}/tools/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        },
        body: JSON.stringify({ tool: toolName, params: parameters })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || `Tool execution failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log(`✓ Tool executed: ${toolName}`);
      
      return result;
    } catch (error) {
      console.error(`Tool execution failed: ${toolName}`, error);
      throw error;
    }
  }

  /**
   * Get full skill instructions (lazy-loaded)
   * 
   * @param {string} skillId - Skill identifier
   * @returns {Promise<Object>} Complete skill with instructions
   */
  async getSkill(skillId) {
    if (!this.connected) {
      throw new Error('MCP not connected');
    }
    
    try {
      const response = await fetch(`${MCP_SERVER_URL}/skills/${skillId}`, {
        headers: {
          'X-Session-ID': this.sessionId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Skill retrieval failed: ${response.status}`);
      }
      
      const skill = await response.json();
      
      console.log(`✓ Skill loaded: ${skill.name} (${skill.context_tokens} tokens)`);
      
      return skill;
    } catch (error) {
      console.error(`Skill retrieval failed: ${skillId}`, error);
      throw error;
    }
  }

  /**
   * Get MCP server status
   * 
   * @returns {Promise<Object>} Server status and capabilities
   */
  async getStatus() {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/status`);
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }
      
      const status = await response.json();
      return status;
    } catch (error) {
      console.error('MCP status check failed:', error);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Disconnect MCP client
   */
  disconnect() {
    this.connected = false;
    this.availableTools = [];
    this.availableSkills = [];
    console.log('✓ MCP disconnected');
  }

  /**
   * Check if client is connected
   * 
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get available tools catalog (lightweight)
   * 
   * @returns {Array} Available tools
   */
  getAvailableTools() {
    return this.availableTools;
  }

  /**
   * Get available skills catalog (lightweight)
   * 
   * @returns {Array} Available skills
   */
  getAvailableSkills() {
    return this.availableSkills;
  }
}

