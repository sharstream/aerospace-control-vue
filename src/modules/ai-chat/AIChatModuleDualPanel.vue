<template>
  <div
    class="ai-panel-dual"
    :class="{ visible }"
  >
    <button
      class="close-fab"
      title="Close AI Assistant"
      @click="$emit('close')"
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
          :mcpConnected="mcpConnected"
          :mcpStatusText="mcpStatusText"
          :isLoading="isLoading"
          @action="handleAction"
          @send-message="handleSendMessage"
          @show-preview="handleShowPreview"
        />
      </div>

      <!-- Resizable Handle -->
      <ResizableHandle
        :isDragging="isDragging"
        @resize="startResize"
        @snap="handleSnap"
      />

      <!-- Right Panel: Data Preview -->
      <div
        class="panel-right"
        :style="{ width: `${rightWidth}%` }"
      >
        <DataPreviewPanel
          :previewType="previewType"
          :previewData="previewData"
          @clear="clearPreview"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import {
    generateOptimizedRoute,
    calculateFlightMetrics,
    getSystemContext
} from '@shared/utils/calculations';
import {
    createTextMessage,
    createToolResultMessage
} from '@shared/utils/messageTransformers';
import {
    extractPreviewFromToolResult,
    mapFlightToPreview,
    mapHazardsToWeather,
    mapRouteOptimizationToPreview,
    mapSystemContextToPreview
} from '@shared/utils/previewDataMappers';
import { usePanelResize } from './composables/usePanelResize';
import ChatInterface from './components/chat/ChatInterface.vue';
import DataPreviewPanel from './components/preview/DataPreviewPanel.vue';
import ResizableHandle from './components/ResizableHandle.vue';
import { MCPClient } from '@/services/mcp-client';
import { AgentMessageBusClient } from '@/services/agent-message-bus';

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

defineEmits(['close']);

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
const addMessage = (titleOrMessage, content = null, _type = '') => {
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

// Display tool result with enhanced message format
const displayToolResult = (toolName, result) => {
    // Extract preview data using mapper
    const preview = extractPreviewFromToolResult(toolName, result, {
        flightContext: props.flights[0],
        flights: props.flights,
        airlineData: props.airlines
    });

    // Set preview panel data
    if (preview.type) {
        previewType.value = preview.type;
        previewData.value = preview.data;
    }

    // Generate human-readable summary
    let summaryText = '';
    let status = 'completed';

    switch (toolName) {
        case 'analyze_fuel_consumption':
            summaryText = `Fuel Status: ${result.fuel_status}\n`;
            summaryText += `Remaining: ${result.fuel_remaining} kg (${result.fuel_percentage}%)\n`;
            summaryText += `Predicted Range: ${result.predicted_range} km\n`;
            summaryText += `Can Reach Destination: ${result.can_reach_destination ? 'Yes ✅' : 'No ⚠️'}`;
            status = result.fuel_status === 'CRITICAL' ? 'warning' : 'completed';
            break;

        case 'get_aircraft_status':
            summaryText = `Overall Status: ${result.overall_status}\n`;
            summaryText += `Systems Checked: ${result.systems_checked.join(', ')}\n`;
            if (result.alerts && result.alerts.length > 0) {
                summaryText += `\nActive Alerts: ${result.alerts.length}`;
            }
            status = result.overall_status === 'CRITICAL' ? 'warning' : 'completed';
            break;

        case 'optimize_route':
            summaryText = 'Route optimization completed. ';
            if (result.fuelSaved) {
                summaryText += `Estimated fuel savings: ${result.fuelSaved} kg. `;
            }
            if (result.timeSaved) {
                summaryText += `Time savings: ${result.timeSaved} minutes.`;
            }
            break;

        case 'analyze_weather': {
            const severe = result.severe || 0;
            const moderate = result.moderate || 0;
            summaryText = 'Weather Analysis Complete\n';
            summaryText += `Severe Hazards: ${severe}\n`;
            summaryText += `Moderate Hazards: ${moderate}\n`;
            summaryText += `Affected Flights: ${result.affected || 0}`;
            status = severe > 0 ? 'warning' : 'completed';
            break;
        }

        default:
            summaryText = JSON.stringify(result, null, 2);
            break;
    }

    // Create enhanced message with tool result part
    const message = createToolResultMessage(
        toolName,
        result,
        summaryText,
        status,
        preview.type,
        preview.data
    );

    addMessage(message);
};

// Provide general response
const provideGeneralResponse = () => {
    const skillCategories = [...new Set(injectedSkills.value.map(s => s.category))];

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
const sendMessageSimulated = query => new Promise((resolve) => {
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

// Action handlers
const identifyBottlenecks = () => {
    const bottlenecks = props.flights.filter(f => f.bottleneck);

    if (bottlenecks.length === 0) {
        const message = createTextMessage(
            'assistant',
            'No critical bottlenecks detected. All flights are operating within normal parameters. ✅'
        );
        addMessage(message);
        return;
    }

    const bottleneckDetails = bottlenecks
        .map((f) => {
            const airline = props.airlines[f.airline];
            return `- **${f.name}** (${airline?.name || f.airline}) on route ${f.from} → ${f.to}`;
        })
        .join('\n');

    const analysisText = `⚠️ Identified ${bottlenecks.length} bottleneck flight${
        bottlenecks.length > 1 ? 's' : ''
    } requiring immediate attention:\n\n${bottleneckDetails}\n\n**Recommendation:** Consider rerouting these flights to avoid congestion and weather hazards.`;

    // Create enhanced message
    const message = createTextMessage('assistant', analysisText);
    addMessage(message);

    // Set preview to first bottleneck flight with full data
    if (bottlenecks.length > 0) {
        const flight = bottlenecks[0];
        const airline = props.airlines[flight.airline];

        previewType.value = 'flight-data';
        previewData.value = mapFlightToPreview(flight, airline);
    }
};

const suggestReroute = () => {
    if (props.flights.length === 0) {
        const message = createTextMessage('assistant', 'No active flights to optimize.');
        addMessage(message);
        return;
    }

    const flightsToOptimize = props.flights
        .filter(f => f.bottleneck || f.statusClass === 'delayed')
        .slice(0, 3);

    if (flightsToOptimize.length === 0) {
        const message = createTextMessage(
            'assistant',
            '✅ All flights are on optimal routes. No rerouting necessary at this time.'
        );
        addMessage(message);
        return;
    }

    let optimizationReport = `Analyzing ${flightsToOptimize.length} flight${
        flightsToOptimize.length > 1 ? 's' : ''
    } for optimization:\n\n`;

    const routes = [];
    let totalTimeSaved = 0;
    let totalFuelSaved = 0;
    let totalCostSaved = 0;

    flightsToOptimize.forEach((flight) => {
        const start = flight.path[0];
        const end = flight.path[flight.path.length - 1];
        const airline = props.airlines[flight.airline];

        const routeAnalysis = generateOptimizedRoute(start, end, props.weatherHazards);
        const metrics = calculateFlightMetrics(routeAnalysis, routeAnalysis.directDistance);

        optimizationReport += `📍 **${flight.name}** (${airline?.name || flight.airline})\n`;
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

            // Accumulate savings
            totalTimeSaved += Math.abs(metrics.timeDifference);
            totalFuelSaved += metrics.fuelSavings;
            totalCostSaved += metrics.fuelSavings * 0.8; // Approximate cost per kg

            // Build route data for preview
            routes.push(
                {
                    type: 'direct',
                    name: `Direct ${flight.from}-${flight.to}`,
                    from: flight.from,
                    to: flight.to,
                    distance: routeAnalysis.directDistance,
                    time: routeAnalysis.directDistance / 800 * 60, // Approximate time
                    fuel: routeAnalysis.directDistance * 2.5,
                    waypoints: 0,
                    recommended: false
                },
                {
                    type: 'optimized',
                    name: `Optimized ${flight.from}-${flight.to}`,
                    from: flight.from,
                    to: flight.to,
                    distance: routeAnalysis.optimizedDistance,
                    time: routeAnalysis.optimizedDistance / 800 * 60,
                    fuel: routeAnalysis.optimizedDistance * 2.5 - metrics.fuelSavings,
                    waypoints: routeAnalysis.path.length - 2,
                    hazardsAvoided: routeAnalysis.hazardsAvoided,
                    advantages: [
                        'Avoids severe weather zones',
                        `Reduces fuel consumption by ${metrics.fuelSavingsPercent.toFixed(1)}%`,
                        'Maintains optimal altitude'
                    ],
                    recommended: true
                }
            );
        } else {
            optimizationReport += '   ✅ Direct route is optimal - no weather hazards detected\n\n';
        }
    });

    // Create enhanced message
    const message = createTextMessage('assistant', optimizationReport);
    addMessage(message);

    // Set preview with full route optimization data
    if (routes.length > 0) {
        previewType.value = 'route';
        previewData.value = mapRouteOptimizationToPreview(
            {
                from: flightsToOptimize[0].from,
                to: flightsToOptimize[0].to,
                directDistance: routes[0]?.distance,
                optimizedDistance: routes[1]?.distance,
                timeSaved: totalTimeSaved,
                fuelSaved: totalFuelSaved,
                costSaved: totalCostSaved,
                hazardsAvoided: routes[1]?.hazardsAvoided || 0,
                directRoute: routes[0],
                optimizedRoute: routes[1],
                recommendations: [
                    'Use optimized route for improved fuel efficiency',
                    'Monitor weather updates during flight',
                    'Maintain communication with air traffic control'
                ]
            },
            flightsToOptimize
        );
    }
};

const provideWeatherInsight = () => {
    if (props.weatherHazards.length === 0) {
        const message = createTextMessage(
            'assistant',
            '☀️ Clear skies across all major flight corridors. No significant weather hazards detected.'
        );
        addMessage(message);
        return;
    }

    const severeHazards = props.weatherHazards.filter(h => h.severity === 'high').length;
    const moderateHazards = props.weatherHazards.length - severeHazards;

    let weatherReport = '## Current Weather Conditions\n\n';
    weatherReport += `🌩️ **${severeHazards}** severe weather zone${severeHazards !== 1 ? 's' : ''}\n`;
    weatherReport += `⚠️ **${moderateHazards}** moderate weather zone${moderateHazards !== 1 ? 's' : ''}\n\n`;

    const affectedFlights = props.flights.filter(f => f.bottleneck).length;
    weatherReport += `📊 **${affectedFlights}** flight${affectedFlights !== 1 ? 's' : ''} potentially affected\n\n`;
    weatherReport
        += '**Recommendation:** Monitor weather patterns and consider rerouting affected flights for passenger safety and fuel efficiency.';

    // Create enhanced message
    const message = createTextMessage('assistant', weatherReport);
    addMessage(message);

    // Set preview with full weather hazard data
    previewType.value = 'weather';
    previewData.value = mapHazardsToWeather(props.weatherHazards, {
        affectedFlights,
        forecast: 'Conditions expected to improve within 2-3 hours',
        recommendations: [
            'Continue monitoring weather patterns',
            'Maintain safe altitude above weather systems',
            'Ensure adequate fuel reserves for potential rerouting',
            'Coordinate with air traffic control for updates'
        ]
    });
};

const provideSystemOverview = () => {
    const context = getSystemContext(props.flights, props.airlines);

    let overview = '## System Status Overview\n\n';
    overview += `✈️ **Total Flights:** ${context.totalFlights}\n`;
    overview += `✅ **On-Time:** ${context.onTimeFlights} (${context.onTimePercentage}%)\n`;
    overview += `⏰ **Delayed:** ${context.delayedFlights}\n`;
    overview += `⚠️ **Bottlenecks:** ${context.bottleneckFlights}\n`;
    overview += `🏢 **Active Airlines:** ${context.activeAirlines}\n`;

    if (context.bottleneckFlights > 0) {
        overview += `\n⚠️ **Action Required:** ${context.bottleneckFlights} flight${
            context.bottleneckFlights !== 1 ? 's' : ''
        } experiencing congestion.`;
    } else {
        overview += '\n✅ **All systems operating normally.**';
    }

    // Create enhanced message
    const message = createTextMessage('assistant', overview);
    addMessage(message);

    // Set preview with full system status data
    previewType.value = 'system';
    previewData.value = mapSystemContextToPreview(context);
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
