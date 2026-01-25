<template>
  <div
    class="ai-panel-dual"
    :class="{ visible }"
  >
    <button
      class="close-fab"
      @click="$emit('close')"
      title="Close AI Assistant"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>

    <div
      ref="panelContainer"
      class="panel-container"
    >
      <!-- Left Panel: Chat Interface -->
      <div
        class="panel-left"
        :style="{ width: `${leftWidth}%` }"
      >
        <ChatInterface
          :messages="messages"
          :mcp-connected="mcpConnected"
          :mcp-status-text="mcpStatusText"
          :is-loading="isLoading"
          @action="handleAction"
          @send-message="handleSendMessage"
          @show-preview="handleShowPreview"
        />
      </div>

      <!-- Resizable Handle -->
      <ResizableHandle
        :is-dragging="isDragging"
        @resize="startResize"
        @snap="handleSnap"
      />

      <!-- Right Panel: Data Preview -->
      <div
        class="panel-right"
        :style="{ width: `${rightWidth}%` }"
      >
        <DataPreviewPanel
          :preview-type="previewType"
          :preview-data="previewData"
          @clear="clearPreview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import { usePanelResize } from './composables/usePanelResize';
import ChatInterface from './components/chat/ChatInterface.vue';
import DataPreviewPanel from './components/preview/DataPreviewPanel.vue';
import ResizableHandle from './components/ResizableHandle.vue';
import { MCPClient } from '@/services/mcp-client';
import { AgentMessageBusClient } from '@/services/agent-message-bus';
import {
  generateOptimizedRoute,
  calculateFlightMetrics,
  getSystemContext
} from '@shared/utils/calculations';
import {
  createTextMessage,
  createToolResultMessage,
  adaptOldMessageToNew
} from '@shared/utils/messageTransformers';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  flights: {
    type: Array,
    required: true
  },
  weatherHazards: {
    type: Array,
    default: () => []
  },
  airlines: {
    type: Object,
    default: () => ({})
  },
  flightsTableCollapsed: {
    type: Boolean,
    default: true
  },
  bottomNavCollapsed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// Panel resize management
const panelContainer = ref(null);
const { leftWidth, rightWidth, isDragging, startResize } = usePanelResize(panelContainer);

// Chat state
const messages = ref([]);
const conversationHistory = ref([]);
const isLoading = ref(false);

// Preview state
const previewType = ref(null);
const previewData = ref(null);

// MCP state
const mcpClient = ref(null);
const messageBus = ref(null);
const mcpConnected = ref(false);
const mcpToolCount = ref(0);
const injectedTools = ref([]);
const injectedSkills = ref([]);

const mcpStatusText = computed(() => {
  if (!mcpConnected.value) {
    return 'MCP: Offline (using simulated responses)';
  }

  if (injectedTools.value.length > 0) {
    return `MCP: Online (${injectedTools.value.length}/${mcpToolCount.value} tools active)`;
  }
  return `MCP: Online (${mcpToolCount.value} tools available)`;
});

const bottomPosition = computed(() => {
  let base = 160;
  if (props.bottomNavCollapsed) {
    base = 90;
  }
  if (!props.flightsTableCollapsed) {
    base += 360;
  }
  return `${base}px`;
});

// Handle snap-to-size from keyboard navigation
const handleSnap = (adjustment) => {
  if (typeof adjustment === 'number') {
    if (adjustment > 0 && adjustment <= 100) {
      // Absolute value - snap to this percentage
      leftWidth.value = adjustment;
    } else {
      // Relative adjustment - add/subtract
      const newWidth = Math.max(25, Math.min(75, leftWidth.value + adjustment));
      leftWidth.value = newWidth;
    }
  }
};

// Add message to chat (supports both old and new formats)
const addMessage = (titleOrMessage, content = null, type = '') => {
  // If passed as new format object
  if (typeof titleOrMessage === 'object' && titleOrMessage.parts) {
    messages.value.push(titleOrMessage);
    return;
  }

  // Convert old format to new format
  const role = titleOrMessage === 'You' ? 'user' : 'assistant';
  const newMessage = createTextMessage(role, content || '');
  messages.value.push(newMessage);
};

// Clear preview panel
const clearPreview = () => {
  previewType.value = null;
  previewData.value = null;
};

// Handle preview from message parts
const handleShowPreview = (preview) => {
  previewType.value = preview.type;
  previewData.value = preview.data;
};

// Handle quick action buttons
const handleAction = (action) => {
  switch (action) {
    case 'identify-bottlenecks':
      identifyBottlenecks();
      break;
    case 'suggest-reroute':
      suggestReroute();
      break;
    default:
      break;
  }
};

// Handle message send
const handleSendMessage = async (message) => {
  // Add user message
  const userMessage = createTextMessage('user', message);
  addMessage(userMessage);

  conversationHistory.value.push({
    role: 'user',
    content: message
  });

  isLoading.value = true;

  try {
    if (mcpConnected.value && mcpClient.value) {
      await sendMessageWithMCP(message);
    } else {
      await sendMessageSimulated(message);
    }
  } finally {
    isLoading.value = false;
  }
};

// Initialize MCP client
const initializeMCPClient = async () => {
  const sessionId = localStorage.getItem('ai_session_id');
  if (!sessionId) {
    console.log('No active AI session - MCP features disabled');
    return;
  }

  try {
    mcpClient.value = new MCPClient(sessionId);
    const result = await mcpClient.value.connect();

    if (result.success) {
      mcpConnected.value = true;
      mcpToolCount.value = result.toolCount || 0;

      messageBus.value = new AgentMessageBusClient('chat-agent', ['general']);
      await messageBus.value.connect();

      messageBus.value.subscribe('collaboration_request', (data) => {
        addMessage(
          'Multi-Agent Alert',
          `Received collaboration request for ${data.capability}`,
          'alert'
        );
      });
    }
  } catch (error) {
    console.error('MCP initialization failed:', error);
    mcpConnected.value = false;
  }
};

// Send message with MCP
const sendMessageWithMCP = async (query) => {
  try {
    const toolsPayload = await mcpClient.value.requestTools(conversationHistory.value);
    injectedTools.value = toolsPayload.tools || [];
    injectedSkills.value = toolsPayload.skills || [];

    const toolExecution = determineToolExecution(query.toLowerCase());

    if (toolExecution) {
      const result = await mcpClient.value.executeTool(
        toolExecution.toolName,
        toolExecution.params
      );

      displayToolResult(toolExecution.toolName, result.result);
    } else {
      provideGeneralResponse();
    }

    conversationHistory.value.push({
      role: 'assistant',
      content: messages.value[0].content
    });
  } catch (error) {
    console.error('MCP message processing failed:', error);
    addMessage('Error', `Failed to process request: ${error.message}`, 'alert');
  }
};

// Determine tool execution based on query
const determineToolExecution = (query) => {
  if (query.includes('fuel') || query.includes('consumption')) {
    const flight = props.flights[0];
    if (flight) {
      return {
        toolName: 'analyze_fuel_consumption',
        params: {
          flight_id: flight.id,
          current_fuel_level: 5000,
          fuel_capacity: 8000,
          distance_traveled: 500,
          distance_remaining: 300,
          current_altitude: flight.altitude,
          airspeed: flight.speed || 450
        }
      };
    }
  }

  if (query.includes('status') || query.includes('systems')) {
    return {
      toolName: 'get_aircraft_status',
      params: {
        flight_id: 'sample-flight',
        systems_data: {
          fuel: { percentage: 65 },
          pressure: { normal: true },
          electrical: { voltage: 28 },
          hydraulics: { pressure: 3000 }
        }
      }
    };
  }

  return null;
};

// Display tool result
const displayToolResult = (toolName, result) => {
  let title = 'Analysis Result';
  let content = '';
  let type = 'success';

  switch (toolName) {
    case 'analyze_fuel_consumption':
      title = 'Fuel Analysis';
      type = result.fuel_status === 'CRITICAL' ? 'alert' : 'success';
      content = `Status: ${result.fuel_status}\n`;
      content += `Remaining: ${result.fuel_remaining} kg (${result.fuel_percentage}%)\n`;
      content += `Predicted range: ${result.predicted_range} km\n`;
      content += `Can reach destination: ${result.can_reach_destination ? 'Yes' : 'No'}`;

      // Set preview data
      previewType.value = 'flight-data';
      previewData.value = {
        callsign: result.flight_id || 'Unknown',
        altitude: `${result.current_altitude || 0}`,
        speed: '450',
        heading: '180',
        fuelStatus: result.fuel_status,
        fuelRemaining: result.fuel_remaining
      };
      break;

    case 'get_aircraft_status':
      title = 'Aircraft Systems Status';
      type = result.overall_status === 'CRITICAL' ? 'alert' : 'success';
      content = `Overall: ${result.overall_status}\n`;
      content += `Systems checked: ${result.systems_checked.join(', ')}`;

      previewType.value = 'system';
      previewData.value = result;
      break;

    default:
      content = JSON.stringify(result, null, 2);
      previewData.value = result;
      break;
  }

  addMessage(title, content, type);
};

// Provide general response
const provideGeneralResponse = () => {
  const skillCategories = [...new Set(injectedSkills.value.map((s) => s.category))];

  let response = 'I can help you with:\n\n';

  if (skillCategories.includes('fuel')) {
    response += '⛽ Fuel consumption analysis and range prediction\n';
  }
  if (skillCategories.includes('pressure')) {
    response += '📊 Cabin pressure monitoring and anomaly detection\n';
  }
  if (skillCategories.includes('trajectory')) {
    response += '🛫 Trajectory prediction and route optimization\n';
  }

  response += '\nAsk me about fuel, pressure, trajectory, or system status for detailed analysis.';

  addMessage('Commander Atlas', response, 'success');
};

// Simulated responses
const sendMessageSimulated = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('weather') || lowerQuery.includes('storm')) {
        provideWeatherInsight();
      } else if (lowerQuery.includes('bottleneck') || lowerQuery.includes('delay')) {
        identifyBottlenecks();
      } else if (lowerQuery.includes('optimize') || lowerQuery.includes('route')) {
        suggestReroute();
      } else if (lowerQuery.includes('status') || lowerQuery.includes('overview')) {
        provideSystemOverview();
      } else {
        const message = createTextMessage(
          'assistant',
          'Based on current airspace conditions and historical data, I recommend reviewing the suggested optimizations. Try asking about bottlenecks, route optimization, or weather conditions.'
        );
        addMessage(message);
      }
      resolve();
    }, 1000);
  });
};

// Action handlers
const identifyBottlenecks = () => {
  const bottlenecks = props.flights.filter((f) => f.bottleneck);

  if (bottlenecks.length === 0) {
    addMessage(
      'Bottleneck Analysis',
      'No critical bottlenecks detected. All flights are operating within normal parameters.',
      'success'
    );
    return;
  }

  const bottleneckDetails = bottlenecks
    .map((f) => {
      const airline = props.airlines[f.airline];
      return `${f.name} (${airline?.name || f.airline}) on route ${f.from} → ${f.to}`;
    })
    .join(', ');

  addMessage(
    'Bottleneck Analysis',
    `⚠️ Identified ${bottlenecks.length} bottleneck flight${
      bottlenecks.length > 1 ? 's' : ''
    } requiring immediate attention:\n\n${bottleneckDetails}\n\nRecommendation: Consider rerouting these flights to avoid congestion and weather hazards.`,
    'alert'
  );

  // Set preview to first bottleneck flight
  if (bottlenecks.length > 0) {
    const flight = bottlenecks[0];
    previewType.value = 'flight-data';
    previewData.value = {
      callsign: flight.name,
      altitude: `${flight.altitude}`,
      speed: `${flight.speed || 450}`,
      heading: `${flight.heading || 0}`
    };
  }
};

const suggestReroute = () => {
  if (props.flights.length === 0) {
    addMessage('Route Optimization', 'No active flights to optimize.', '');
    return;
  }

  const flightsToOptimize = props.flights
    .filter((f) => f.bottleneck || f.statusClass === 'delayed')
    .slice(0, 3);

  if (flightsToOptimize.length === 0) {
    addMessage(
      'Route Optimization',
      '✅ All flights are on optimal routes. No rerouting necessary at this time.',
      'success'
    );
    return;
  }

  let optimizationReport = `Analyzing ${flightsToOptimize.length} flight${
    flightsToOptimize.length > 1 ? 's' : ''
  } for optimization:\n\n`;

  flightsToOptimize.forEach((flight) => {
    const start = flight.path[0];
    const end = flight.path[flight.path.length - 1];
    const airline = props.airlines[flight.airline];

    const routeAnalysis = generateOptimizedRoute(start, end, props.weatherHazards);
    const metrics = calculateFlightMetrics(routeAnalysis, routeAnalysis.directDistance);

    optimizationReport += `📍 ${flight.name} (${airline?.name || flight.airline})\n`;
    optimizationReport += `   Route: ${flight.from} → ${flight.to}\n`;

    if (routeAnalysis.weatherAvoidance) {
      optimizationReport += `   ⚠️ ${routeAnalysis.hazardsAvoided} weather hazard${
        routeAnalysis.hazardsAvoided > 1 ? 's' : ''
      } detected on direct path\n`;
      optimizationReport += `   📏 Additional distance: +${routeAnalysis.additionalDistance.toFixed(
        0
      )} km\n`;
      optimizationReport += `   ⏱️ Time difference: +${metrics.timeDifference.toFixed(0)} min\n`;
      optimizationReport += `   ⛽ Fuel savings: ${metrics.fuelSavings.toFixed(
        0
      )} kg (${metrics.fuelSavingsPercent.toFixed(1)}% by avoiding turbulence)\n`;
      optimizationReport += `   ✅ Recommended: Use optimized route with ${routeAnalysis.path.length} waypoints\n\n`;
    } else {
      optimizationReport += '   ✅ Direct route is optimal - no weather hazards detected\n\n';
    }
  });

  addMessage('Route Optimization Report', optimizationReport, 'success');

  // Set preview to route optimization
  previewType.value = 'route';
  previewData.value = {
    flights: flightsToOptimize.map((f) => f.name)
  };
};

const provideWeatherInsight = () => {
  if (props.weatherHazards.length === 0) {
    addMessage(
      'Weather Analysis',
      '☀️ Clear skies across all major flight corridors. No significant weather hazards detected.',
      'success'
    );
    return;
  }

  const severeHazards = props.weatherHazards.filter((h) => h.severity === 'high').length;
  const moderateHazards = props.weatherHazards.length - severeHazards;

  let weatherReport = 'Current weather conditions:\n\n';
  weatherReport += `🌩️ ${severeHazards} severe weather zone${severeHazards !== 1 ? 's' : ''}\n`;
  weatherReport += `⚠️ ${moderateHazards} moderate weather zone${moderateHazards !== 1 ? 's' : ''}\n\n`;

  const affectedFlights = props.flights.filter((f) => f.bottleneck).length;
  weatherReport += `📊 ${affectedFlights} flight${affectedFlights !== 1 ? 's' : ''} potentially affected\n\n`;
  weatherReport +=
    'Recommendation: Monitor weather patterns and consider rerouting affected flights for passenger safety and fuel efficiency.';

  addMessage('Weather Analysis', weatherReport, 'alert');

  previewType.value = 'weather';
  previewData.value = {
    severe: severeHazards,
    moderate: moderateHazards,
    affected: affectedFlights
  };
};

const provideSystemOverview = () => {
  const context = getSystemContext(props.flights, props.airlines);

  let overview = 'System Status Overview:\n\n';
  overview += `✈️ Total Flights: ${context.totalFlights}\n`;
  overview += `✅ On-Time: ${context.onTimeFlights} (${context.onTimePercentage}%)\n`;
  overview += `⏰ Delayed: ${context.delayedFlights}\n`;
  overview += `⚠️ Bottlenecks: ${context.bottleneckFlights}\n`;
  overview += `🏢 Active Airlines: ${context.activeAirlines}\n`;

  if (context.bottleneckFlights > 0) {
    overview += `\n⚠️ Action Required: ${context.bottleneckFlights} flight${
      context.bottleneckFlights !== 1 ? 's' : ''
    } experiencing congestion.`;
  } else {
    overview += '\n✅ All systems operating normally.';
  }

  addMessage(
    'System Overview',
    overview,
    context.bottleneckFlights > 0 ? 'alert' : 'success'
  );
};

// Lifecycle hooks
onMounted(() => {
  initializeMCPClient();
});

onBeforeUnmount(() => {
  if (mcpClient.value) {
    mcpClient.value.disconnect();
  }
  if (messageBus.value) {
    messageBus.value.disconnect();
  }
});
</script>

<style scoped>
.ai-panel-dual {
  position: fixed;
  bottom: v-bind(bottomPosition);
  right: 20px;
  width: 85vw;
  max-width: 1400px;
  height: 80vh;
  max-height: 800px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: var(--backdrop-blur-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl), 0 0 0 1px var(--color-primary-alpha-10);
  display: flex;
  flex-direction: column;
  z-index: 999;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.ai-panel-dual.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.close-fab {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: var(--color-white-alpha-10);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1000;
  color: var(--color-text-primary);
}

.close-fab:hover {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
  transform: scale(1.1);
}

.close-fab svg {
  width: 20px;
  height: 20px;
}

.panel-container {
  display: flex;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-2xl);
}

.panel-left,
.panel-right {
  height: 100%;
  overflow: hidden;
  transition: width 0.1s ease;
}

.panel-left {
  border-right: 1px solid var(--color-border);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .ai-panel-dual {
    width: 90vw;
    height: 75vh;
  }
}

@media (max-width: 768px) {
  .ai-panel-dual {
    width: 95vw;
    height: 70vh;
    right: 10px;
  }

  .panel-container {
    flex-direction: column;
  }

  .panel-left,
  .panel-right {
    width: 100% !important;
    height: 50%;
  }
}
</style>
