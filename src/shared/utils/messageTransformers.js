/**
 * Message transformation utilities
 * Converts between old and new message formats for backward compatibility
 */

/**
 * Generate unique ID for messages
 * @returns {string} Unique message ID
 */
export function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Adapt old message format to new enhanced structure
 * Old format: { title, content, type, time }
 * New format: { id, role, timestamp, parts }
 *
 * @param {Object} oldMessage - Old format message
 * @returns {Object} New format message
 */
export function adaptOldMessageToNew(oldMessage) {
  // Determine role from title
  let role = 'assistant';
  if (oldMessage.title === 'You') {
    role = 'user';
  } else if (oldMessage.title === 'System' || oldMessage.type === 'system') {
    role = 'system';
  }

  // Parse timestamp from time string or use current time
  let timestamp = new Date();
  if (oldMessage.time) {
    // Try to parse time string like "3:45 PM"
    const timeParts = oldMessage.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeParts) {
      const now = new Date();
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = timeParts[3];

      if (period) {
        if (period.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }

      timestamp = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
    }
  }

  return {
    id: generateMessageId(),
    role,
    timestamp,
    parts: [
      {
        type: 'text',
        content: oldMessage.content || ''
      }
    ]
  };
}

/**
 * Create new message with text content
 *
 * @param {string} role - Message role (user, assistant, system)
 * @param {string} content - Message text content
 * @returns {Object} New format message
 */
export function createTextMessage(role, content) {
  return {
    id: generateMessageId(),
    role,
    timestamp: new Date(),
    parts: [
      {
        type: 'text',
        content
      }
    ]
  };
}

/**
 * Create message with tool invocation and result
 *
 * @param {string} toolName - Name of the tool
 * @param {Object} params - Tool parameters
 * @param {Object} result - Tool result data
 * @param {string} previewType - Type of preview (flight-data, weather, route, system)
 * @returns {Object} New format message
 */
export function createToolResultMessage(toolName, params, result, previewType = null) {
  const parts = [
    {
      type: 'tool-invocation',
      content: {
        name: toolName,
        params,
        status: 'completed'
      }
    },
    {
      type: 'tool-result',
      content: {
        toolName,
        summary: result.summary || generateSummary(toolName, result),
        previewType,
        data: result,
        error: result.error || null
      }
    }
  ];

  // Add text explanation if available
  if (result.explanation || result.message) {
    parts.push({
      type: 'text',
      content: result.explanation || result.message
    });
  }

  return {
    id: generateMessageId(),
    role: 'assistant',
    timestamp: new Date(),
    parts
  };
}

/**
 * Create message with reasoning
 *
 * @param {string} text - Main message text
 * @param {string} reasoning - Reasoning content
 * @returns {Object} New format message
 */
export function createMessageWithReasoning(text, reasoning) {
  return {
    id: generateMessageId(),
    role: 'assistant',
    timestamp: new Date(),
    parts: [
      {
        type: 'reasoning',
        content: reasoning
      },
      {
        type: 'text',
        content: text
      }
    ]
  };
}

/**
 * Generate summary from tool result
 *
 * @param {string} toolName - Tool name
 * @param {Object} result - Tool result
 * @returns {string} Summary text
 */
function generateSummary(toolName, result) {
  if (result.summary) return result.summary;

  // Generate generic summaries based on tool name
  const summaries = {
    'analyze_fuel_consumption': `Fuel analysis completed: ${result.fuel_status || 'Status unknown'}`,
    'detect_pressure_anomaly': `Pressure check: ${result.status || 'Status unknown'}`,
    'predict_trajectory': `Trajectory prediction completed`,
    'get_aircraft_status': `System status: ${result.overall_status || 'Status unknown'}`
  };

  return summaries[toolName] || `${toolName} completed successfully`;
}

/**
 * Batch convert old messages to new format
 *
 * @param {Array} oldMessages - Array of old format messages
 * @returns {Array} Array of new format messages
 */
export function batchAdaptMessages(oldMessages) {
  if (!Array.isArray(oldMessages)) return [];

  return oldMessages.map((msg) => {
    // Check if already in new format
    if (msg.parts && Array.isArray(msg.parts)) {
      return msg;
    }

    // Convert old format
    return adaptOldMessageToNew(msg);
  });
}
