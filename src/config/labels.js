/**
 * Centralized Label Storage for Aerospace Control Vue
 *
 * This file contains all UI labels used throughout the application.
 * Labels are organized by module/component for easy maintenance.
 *
 * Pattern based on ma-unified project: ext/MapsV2/desktop/main.js
 * Labels are injected globally via app.config.globalProperties.$Labels
 *
 * Usage in components:
 * - Options API: this.$Labels.aiAssistant.title
 * - Composition API: getCurrentInstance().appContext.config.globalProperties.$Labels.aiAssistant.title
 */

export const Labels = {
  // ============================================================================
  // AI ASSISTANT SETTINGS
  // ============================================================================
  aiAssistant: {
    title: 'AI Assistant',
    enabled: 'ENABLED',
    disabled: 'DISABLED',
    description: 'Integrate with ChatGPT, Claude, and Gemini for intelligent aerospace monitoring',

    // Provider names
    providers: {
      openai: 'OpenAI',
      anthropic: 'Anthropic Claude',
      google: 'Google Gemini'
    },

    // API Key section
    apiKey: {
      label: '{provider} API KEY', // Placeholder {provider} will be replaced dynamically
      placeholder: 'Enter your API key...',
      description: 'API key is encrypted and stored securely in your browser'
    },

    // Buttons
    buttons: {
      saveConfiguration: 'Save Configuration',
      testConnection: 'Test Connection',
      testing: 'Testing...'
    },

    // Test results
    testResults: {
      successPrefix: 'Successfully connected to',
      failurePrefix: 'Connection failed:'
    },

    // Session info
    session: {
      sessionIdLabel: 'SESSION ID',
      mcpStatusLabel: 'MCP STATUS',
      availableToolsLabel: 'AVAILABLE TOOLS',
      notCreated: 'Not created',
      connected: 'CONNECTED',
      disconnected: 'DISCONNECTED',
      toolsCount: '{count} aerospace monitoring tools'
    },

    // Features (when disabled)
    features: {
      intro: 'Once enabled, you\'ll have access to:',
      flightAnalysis: '✈️ Real-time flight analysis and anomaly detection',
      systemDiagnosis: '🔧 System malfunction diagnosis and recommendations',
      trajectoryAnalysis: '📊 Predictive trajectory analysis',
      multiAgent: '⚡ Multi-agent collaboration for complex tasks'
    },

    // Validation messages
    validation: {
      apiKeyRequired: 'Please enter a {provider} API key before enabling AI features.',
      sessionCreationFailed: 'Failed to create AI session: {error}',
      configSaved: 'Configuration saved successfully',
      configSaveFailed: 'Failed to save configuration: {error}'
    }
  },

  // ============================================================================
  // AI CHAT MODULE (Commander Atlas)
  // ============================================================================
  commanderAtlas: {
    title: 'Commander Atlas',
    subtitle: 'Aviation Systems Expert | Airfare Engineer | AI Co-Pilot',

    // MCP Status
    mcpStatus: {
      online: 'MCP: Online ({count} tools active)',
      onlineWithTotal: 'MCP: Online ({count}/{total} tools active)',
      onlineAvailable: 'MCP: Online ({count} tools available)',
      offline: 'MCP: Offline (using simulated responses)'
    },

    // Action buttons
    actions: {
      identifyBottlenecks: 'Identify Bottlenecks',
      suggestReroute: 'Suggest Reroute'
    },

    // Input placeholder
    input: {
      placeholder: 'Ask about flight status, route optimization, or system monitoring...'
    },

    // Message titles
    messages: {
      bottleneckAnalysis: 'Bottleneck Analysis',
      routeOptimization: 'Route Optimization',
      routeOptimizationReport: 'Route Optimization Report',
      weatherAnalysis: 'Weather Analysis',
      systemOverview: 'System Overview',
      multiAgentAlert: 'Multi-Agent Alert',
      error: 'Error',
      fuelAnalysis: 'Fuel Analysis',
      pressureAnalysis: 'Pressure Analysis',
      trajectoryPrediction: 'Trajectory Prediction',
      aircraftSystemsStatus: 'Aircraft Systems Status',
      analysisResult: 'Analysis Result'
    },

    // Response templates
    responses: {
      noBottlenecks: 'No critical bottlenecks detected. All flights are operating within normal parameters.',
      bottlenecksDetected: '⚠️ Identified {count} bottleneck flight{s} requiring immediate attention:\n\n{details}\n\nRecommendation: Consider rerouting these flights to avoid congestion and weather hazards.',
      noFlightsToOptimize: 'No active flights to optimize.',
      allRoutesOptimal: '✅ All flights are on optimal routes. No rerouting necessary at this time.',
      clearSkies: '☀️ Clear skies across all major flight corridors. No significant weather hazards detected.',
      mcpProcessingFailed: 'Failed to process request: {error}',
      collaborationRequest: 'Received collaboration request for {capability}',
      generalHelp: 'Based on current airspace conditions and historical data, I recommend reviewing the suggested optimizations. Try asking about bottlenecks, route optimization, or weather conditions.'
    },

    // Skill categories help text
    skillHelp: {
      intro: 'I can help you with:\n\n',
      fuel: '⛽ Fuel consumption analysis and range prediction\n',
      pressure: '📊 Cabin pressure monitoring and anomaly detection\n',
      trajectory: '🛫 Trajectory prediction and route optimization\n',
      electrical: '⚡ Electrical system health monitoring\n',
      malfunction: '🔧 System malfunction detection and diagnosis\n',
      askMore: '\nAsk me about fuel, pressure, trajectory, or system status for detailed analysis.'
    }
  },

  // ============================================================================
  // DATA SOURCE CONFIGURATION
  // ============================================================================
  dataSource: {
    title: 'Data Source',
    description: 'Configure real-time aircraft data from SkySentinel backend',

    // Backend status
    backendStatus: {
      label: 'Backend Status:',
      operational: 'OPERATIONAL',
      rateLimited: 'RATE LIMITED',
      error: 'ERROR',
      unknown: 'UNKNOWN'
    },

    // Real-time data toggle
    realTimeData: {
      label: 'Real-Time Data',
      description: 'Connected to OpenSky Network via backend',
      autoRefresh: 'Data refreshes automatically every 10 seconds'
    }
  },

  // ============================================================================
  // RATE LIMIT STATUS
  // ============================================================================
  rateLimit: {
    title: 'API Rate Limit Status',

    // Credits display
    credits: {
      label: 'Remaining Credits',
      healthy: 'API usage is healthy',
      approaching: 'Approaching rate limit',
      low: 'Low credits remaining - use cautiously',
      critical: 'Critical: Rate limit imminent'
    },

    // Countdown section
    countdown: {
      title: 'Rate Limit Reached',
      label: 'until API available',
      description: 'The API will automatically retry when the cooldown period expires.'
    },

    // No data available
    noData: 'Rate limit information not available'
  },

  // ============================================================================
  // SETTINGS MODULE
  // ============================================================================
  settings: {
    title: 'System Settings',
    subtitle: 'Configure display preferences, map options, and system behavior',

    // Usage Metrics
    usageMetrics: {
      title: 'Usage Metrics',
      description: 'Track and export your application usage statistics',

      // Metric labels
      metrics: {
        totalSessions: 'Total Sessions',
        viewChanges: 'View Changes',
        flightClicks: 'Flight Clicks',
        aiPanelOpens: 'AI Panel Opens'
      },

      // Time spent section
      timeSpent: {
        title: 'Time Spent by View'
      },

      // Export buttons
      export: {
        json: 'Export JSON',
        csv: 'Export CSV',
        txt: 'Export TXT',
        clear: 'Clear Data'
      },

      // Confirmation message
      confirmClear: 'Are you sure you want to clear all usage data? This action cannot be undone.'
    }
  },

  // ============================================================================
  // COMMON / SHARED LABELS
  // ============================================================================
  common: {
    // Generic actions
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      loading: 'Loading...',
      retry: 'Retry'
    },

    // Status indicators
    status: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      online: 'Online',
      offline: 'Offline',
      connected: 'Connected',
      disconnected: 'Disconnected',
      enabled: 'Enabled',
      disabled: 'Disabled'
    },

    // Time formatting
    time: {
      seconds: '{count}s',
      minutes: '{count}m',
      hours: '{count}h',
      minutesSeconds: '{minutes}m {seconds}s',
      hoursMinutes: '{hours}h {minutes}m'
    }
  }
};

/**
 * Helper function to replace placeholders in label strings
 *
 * @param {string} label - Label string with placeholders like '{count}', '{provider}'
 * @param {Object} replacements - Object with replacement values { count: 5, provider: 'OpenAI' }
 * @returns {string} - Label with placeholders replaced
 *
 * @example
 * replacePlaceholders('MCP: Online ({count} tools active)', { count: 5 })
 * // Returns: 'MCP: Online (5 tools active)'
 */
export function replacePlaceholders(label, replacements = {}) {
  if (!label || typeof label !== 'string') return label;

  let result = label;
  Object.keys(replacements).forEach((key) => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), replacements[key]);
  });

  return result;
}

/**
 * Helper function for pluralization
 *
 * @param {number} count - Number to check for plural
 * @param {string} singular - Singular form of the word
 * @param {string} plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns {string} - Correct plural form
 *
 * @example
 * pluralize(1, 'tool') // Returns: '1 tool'
 * pluralize(5, 'tool') // Returns: '5 tools'
 * pluralize(1, 'aircraft', 'aircraft') // Returns: '1 aircraft'
 */
export function pluralize(count, singular, plural = null) {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? `${count} ${singular}` : `${count} ${pluralForm}`;
}

export default Labels;
