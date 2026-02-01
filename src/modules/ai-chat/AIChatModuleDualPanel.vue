<template>
    <Motion
        tag="div"
        class="ai-panel-dual"
        :class="{ visible, dragging: isPanelDragging, resizing: isResizing }"
        :style="{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`
        }"
        :initial="{ opacity: 0, y: 20, scale: 0.95 }"
        :animate="visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }"
        :transition="{ type: 'spring', stiffness: 300, damping: 30 }"
    >
        <!-- Draggable Header -->
        <div
            class="panel-header"
            @mousedown="startDrag"
        >
            <div class="header-content">
                <svg
                    class="header-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <h2 class="header-title">Commander Atlas</h2>
            </div>
            <Motion
                tag="button"
                class="close-fab"
                title="Close AI Assistant"
                :whileHover="{ scale: 1.1, rotate: 90 }"
                :whileTap="{ scale: 0.95 }"
                :transition="{ type: 'spring', stiffness: 400, damping: 15 }"
                @click.stop="$emit('close')"
            >
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </Motion>
        </div>

        <!-- Resize Handles -->
        <div
            class="resize-handle resize-n"
            :style="{ cursor: getCursorForDirection('n') }"
            @mousedown.stop="startPanelResize('n', $event)"
        />
        <div
            class="resize-handle resize-s"
            :style="{ cursor: getCursorForDirection('s') }"
            @mousedown.stop="startPanelResize('s', $event)"
        />
        <div
            class="resize-handle resize-e"
            :style="{ cursor: getCursorForDirection('e') }"
            @mousedown.stop="startPanelResize('e', $event)"
        />
        <div
            class="resize-handle resize-w"
            :style="{ cursor: getCursorForDirection('w') }"
            @mousedown.stop="startPanelResize('w', $event)"
        />
        <div
            class="resize-handle resize-ne"
            :style="{ cursor: getCursorForDirection('ne') }"
            @mousedown.stop="startPanelResize('ne', $event)"
        />
        <div
            class="resize-handle resize-nw"
            :style="{ cursor: getCursorForDirection('nw') }"
            @mousedown.stop="startPanelResize('nw', $event)"
        />
        <div
            class="resize-handle resize-se"
            :style="{ cursor: getCursorForDirection('se') }"
            @mousedown.stop="startPanelResize('se', $event)"
        />
        <div
            class="resize-handle resize-sw"
            :style="{ cursor: getCursorForDirection('sw') }"
            @mousedown.stop="startPanelResize('sw', $event)"
        />

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
    </Motion>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import { Motion } from 'motion-v';
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
import { useDraggable } from './composables/useDraggable';
import { useResizable } from './composables/useResizable';
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
    },
    trackedAircraft: {
        type: Array,
        default: () => []
    },
    selectedFlight: {
        type: Object,
        default: null
    }
});

defineEmits(['close']);

// Panel resize management
const panelContainer = ref(null);
const { leftWidth, rightWidth, isDragging, startResize } = usePanelResize(panelContainer);

// Draggable and resizable functionality
const { position, isDragging: isPanelDragging, startDrag, resetPosition } = useDraggable('ai-chat-panel-position');
const {
    dimensions,
    isResizing,
    resizeDirection,
    startResize: startPanelResize,
    resetDimensions,
    getCursorForDirection
} = useResizable('ai-chat-panel-dimensions', {
    width: 1400,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    maxWidth: window.innerWidth - 100,
    maxHeight: window.innerHeight - 100
});

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
    // Get tracked aircraft with priority: selectedFlight > first tracked aircraft > first flight
    const trackedFlight = props.selectedFlight ||
                          (props.trackedAircraft && props.trackedAircraft.length > 0
                              ? props.flights.find(f => f.icao24 === props.trackedAircraft[0])
                              : null) ||
                          props.flights[0];

    if (!trackedFlight) {
        console.warn('No tracked aircraft available for tool execution');
        return null;
    }

    if (query.includes('fuel') || query.includes('consumption')) {
        return {
            toolName: 'analyze_fuel_consumption',
            params: {
                flight_id: trackedFlight.id || trackedFlight.icao24 || 'unknown',
                current_fuel_level: 5000,
                fuel_capacity: 8000,
                distance_traveled: 500,
                distance_remaining: 300,
                current_altitude: Number(trackedFlight.altitude) || 35000,
                airspeed: Number(trackedFlight.speed) || 450
            }
        };
    }

    if (query.includes('pressure') || query.includes('cabin')) {
        return {
            toolName: 'detect_pressure_anomaly',
            params: {
                cabin_pressure: 11.3,
                current_altitude: Number(trackedFlight.altitude) || 35000,
                rate_of_change: 0.1
            }
        };
    }

    if (query.includes('trajectory') || query.includes('path')) {
        // Use flight data if available, fallback to defaults
        const position = trackedFlight.path && trackedFlight.path.length > 0
            ? {
                lat: Number(trackedFlight.path[0][0]) || trackedFlight.lat || 33.7490,
                lon: Number(trackedFlight.path[0][1]) || trackedFlight.lon || -84.3880,
                altitude: Number(trackedFlight.altitude) || 35000
              }
            : {
                lat: Number(trackedFlight.lat) || 33.7490,
                lon: Number(trackedFlight.lon) || -84.3880,
                altitude: Number(trackedFlight.altitude) || 35000
              };

        return {
            toolName: 'predict_trajectory',
            params: {
                current_position: position,
                velocity: {
                    groundspeed: Number(trackedFlight.speed) || 450,
                    vertical_rate: Number(trackedFlight.verticalRate) || 0
                },
                heading: Number(trackedFlight.heading) || 90
            }
        };
    }

    if (query.includes('status') || query.includes('systems')) {
        return {
            toolName: 'get_aircraft_status',
            params: {
                flight_id: trackedFlight.id || trackedFlight.icao24 || 'unknown',
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

        case 'detect_pressure_anomaly':
            summaryText = `Pressure Status: ${result.status}\n`;
            summaryText += `Cabin Pressure: ${result.cabin_pressure_psi} PSI\n`;
            summaryText += `Expected: ${result.expected_pressure_psi} PSI\n`;
            summaryText += `Rate of Change: ${result.rate_of_change} PSI/min\n`;
            summaryText += `Severity: ${result.severity}`;
            if (result.recommendations && result.recommendations.length > 0) {
                summaryText += `\n\nRecommendations:\n${result.recommendations.join('\n')}`;
            }
            status = result.severity === 'EMERGENCY' || result.severity === 'WARNING' ? 'warning' : 'completed';
            break;

        case 'predict_trajectory':
            summaryText = `Groundspeed: ${result.groundspeed_knots} knots\n`;
            summaryText += `Heading: ${result.heading}°\n`;
            summaryText += `Weather Impact: ${result.weather_impact}\n`;
            summaryText += `Prediction Confidence: ${result.prediction_confidence}\n`;
            summaryText += `Predicted Waypoints: ${result.predicted_waypoints ? result.predicted_waypoints.length : 0}`;
            status = 'completed';
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
    background: linear-gradient(
        135deg,
        rgb(15 23 42 / 72%) 0%,
        rgb(30 41 59 / 68%) 50%,
        rgb(15 23 42 / 75%) 100%
    );
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgb(148 163 184 / 15%);
    border-radius: var(--radius-2xl);
    box-shadow:
        0 25px 50px -12px rgb(0 0 0 / 50%),
        0 0 0 1px rgb(148 163 184 / 10%),
        inset 0 1px 0 0 rgb(255 255 255 / 10%);
    display: flex;
    flex-direction: column;
    z-index: 999;
    pointer-events: none;
    overflow: hidden;
    will-change: transform, opacity;
}

.ai-panel-dual.dragging {
    cursor: move;
    user-select: none;
}

.ai-panel-dual.resizing {
    user-select: none;
}

.ai-panel-dual.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
}

.panel-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: rgb(15 23 42 / 50%);
    border-bottom: 1px solid rgb(148 163 184 / 15%);
    cursor: move;
    user-select: none;
    z-index: 1001;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon {
    width: 24px;
    height: 24px;
    color: rgb(96 165 250);
}

.header-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: rgb(226 232 240);
    letter-spacing: -0.01em;
}

.close-fab {
    width: 32px;
    height: 32px;
    background: rgb(255 255 255 / 8%);
    border: 1px solid rgb(148 163 184 / 20%);
    border-radius: var(--radius-lg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(226 232 240 / 90%);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%);
    will-change: transform;
}

.close-fab:hover {
    background: rgb(239 68 68 / 90%);
    color: white;
    border-color: rgb(239 68 68);
}

.close-fab svg {
    width: 18px;
    height: 18px;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    background: transparent;
    z-index: 1000;
}

.resize-handle:hover {
    background: rgb(96 165 250 / 20%);
}

.resize-n,
.resize-s {
    width: 100%;
    height: 6px;
    left: 0;
}

.resize-n {
    top: 0;
}

.resize-s {
    bottom: 0;
}

.resize-e,
.resize-w {
    width: 6px;
    height: 100%;
    top: 0;
}

.resize-e {
    right: 0;
}

.resize-w {
    left: 0;
}

.resize-ne,
.resize-nw,
.resize-se,
.resize-sw {
    width: 16px;
    height: 16px;
}

.resize-ne {
    top: 0;
    right: 0;
}

.resize-nw {
    top: 0;
    left: 0;
}

.resize-se {
    bottom: 0;
    right: 0;
}

.resize-sw {
    bottom: 0;
    left: 0;
}

.panel-container {
    display: flex;
    height: calc(100% - 65px); /* Account for header height */
    overflow: hidden;
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
@media (width <= 1200px) {
    .ai-panel-dual {
        width: 90vw;
        height: 75vh;
    }
}

@media (width <= 768px) {
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
