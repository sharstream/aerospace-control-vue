<template>
  <div
    class="ai-panel"
    :class="{ visible }"
  >
    <div class="ai-header">
      <div class="ai-title">
        <h2>Commander Atlas</h2>
        <p>Aviation Systems Expert | Airfare Engineer | AI Co-Pilot</p>
      </div>
      <button
        class="ai-close-btn"
        title="Close"
        @click="$emit('close')"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>

    <div class="ai-actions">
      <button
        class="ai-btn"
        @click="identifyBottlenecks"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        Identify Bottlenecks
      </button>

      <button
        class="ai-btn"
        @click="suggestReroute"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
        Suggest Reroute
      </button>
    </div>

    <div
      ref="messagesContainer"
      class="ai-messages"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="ai-message"
        :class="message.type"
      >
        <div class="ai-message-icon">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div class="ai-message-content">
          <div class="ai-message-title">{{ message.title }}</div>
          <div class="ai-message-text">{{ message.content }}</div>
          <div class="ai-message-time">{{ message.time }}</div>
        </div>
      </div>
    </div>

    <div class="ai-input">
      <input
        v-model="userInput"
        type="text"
        placeholder="Ask about flight status, route optimization, or system monitoring..."
        @keypress.enter="sendMessage"
      />
      <button
        class="ai-send-btn"
        title="Send message"
        @click="sendMessage"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { generateOptimizedRoute, calculateFlightMetrics, getSystemContext } from '@shared/utils/calculations';

export default {
  name: 'AIChatModule',
  props: {
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
  },
  emits: ['close'],
  data() {
    return {
      messages: [],
      userInput: '',
      messagesContainer: null
    };
  },
  computed: {
    bottomPosition() {
      // Base position when bottom nav is shown
      let base = 90;

      // Adjust for bottom nav collapse
      if (this.bottomNavCollapsed) {
        base = 20;
      }

      // Move up when flights table is open
      if (!this.flightsTableCollapsed) {
        base += 360;
      }

      return `${base}px`;
    }
  },
  methods: {
    addMessage(title, content, type = '') {
      this.messages.unshift({
        title,
        content,
        type,
        time: new Date().toLocaleTimeString()
      });
    },

    sendMessage() {
      if (!this.userInput.trim()) return;

      const query = this.userInput.toLowerCase();
      this.addMessage('You', this.userInput, '');
      this.userInput = '';

      // Simulate AI response with contextual answers
      setTimeout(() => {
        if (query.includes('weather') || query.includes('storm')) {
          this.provideWeatherInsight();
        } else if (query.includes('bottleneck') || query.includes('delay')) {
          this.identifyBottlenecks();
        } else if (query.includes('optimize') || query.includes('route')) {
          this.suggestReroute();
        } else if (query.includes('status') || query.includes('overview')) {
          this.provideSystemOverview();
        } else {
          this.addMessage(
            'Commander Atlas',
            'Based on current airspace conditions and historical data, I recommend reviewing the suggested optimizations. Try asking about bottlenecks, route optimization, or weather conditions.',
            'success'
          );
        }
      }, 1000);
    },

    identifyBottlenecks() {
      const bottlenecks = this.flights.filter(f => f.bottleneck);

      if (bottlenecks.length === 0) {
        this.addMessage(
          'Bottleneck Analysis',
          'No critical bottlenecks detected. All flights are operating within normal parameters.',
          'success'
        );
        return;
      }

      const bottleneckDetails = bottlenecks.map((f) => {
        const airline = this.airlines[f.airline];
        return `${f.name} (${airline?.name || f.airline}) on route ${f.from} → ${f.to}`;
      }).join(', ');

      this.addMessage(
        'Bottleneck Analysis',
        `⚠️ Identified ${bottlenecks.length} bottleneck flight${bottlenecks.length > 1 ? 's' : ''} requiring immediate attention:\n\n${bottleneckDetails}\n\nRecommendation: Consider rerouting these flights to avoid congestion and weather hazards.`,
        'alert'
      );
    },

    suggestReroute() {
      if (this.flights.length === 0) {
        this.addMessage('Route Optimization', 'No active flights to optimize.', '');
        return;
      }

      // Find flights that need rerouting (bottlenecks or delayed flights)
      const flightsToOptimize = this.flights.filter(f => f.bottleneck || f.statusClass === 'delayed').slice(0, 3);

      if (flightsToOptimize.length === 0) {
        this.addMessage(
          'Route Optimization',
          '✅ All flights are on optimal routes. No rerouting necessary at this time.',
          'success'
        );
        return;
      }

      // Analyze each flight
      let optimizationReport = `Analyzing ${flightsToOptimize.length} flight${flightsToOptimize.length > 1 ? 's' : ''} for optimization:\n\n`;

      flightsToOptimize.forEach((flight) => {
        const start = flight.path[0];
        const end = flight.path[flight.path.length - 1];
        const airline = this.airlines[flight.airline];

        // Generate optimized route avoiding weather hazards
        const routeAnalysis = generateOptimizedRoute(start, end, this.weatherHazards);
        const metrics = calculateFlightMetrics(routeAnalysis, routeAnalysis.directDistance);

        optimizationReport += `📍 ${flight.name} (${airline?.name || flight.airline})\n`;
        optimizationReport += `   Route: ${flight.from} → ${flight.to}\n`;

        if (routeAnalysis.weatherAvoidance) {
          optimizationReport += `   ⚠️ ${routeAnalysis.hazardsAvoided} weather hazard${routeAnalysis.hazardsAvoided > 1 ? 's' : ''} detected on direct path\n`;
          optimizationReport += `   📏 Additional distance: +${routeAnalysis.additionalDistance.toFixed(0)} km\n`;
          optimizationReport += `   ⏱️ Time difference: +${metrics.timeDifference.toFixed(0)} min\n`;
          optimizationReport += `   ⛽ Fuel savings: ${metrics.fuelSavings.toFixed(0)} kg (${metrics.fuelSavingsPercent.toFixed(1)}% by avoiding turbulence)\n`;
          optimizationReport += `   ✅ Recommended: Use optimized route with ${routeAnalysis.path.length} waypoints\n\n`;
        } else {
          optimizationReport += '   ✅ Direct route is optimal - no weather hazards detected\n';
          optimizationReport += `   📏 Distance: ${routeAnalysis.distance.toFixed(0)} km\n`;
          optimizationReport += `   ⏱️ Estimated time: ${metrics.time.toFixed(0)} min\n`;
          optimizationReport += `   ⛽ Estimated fuel: ${metrics.fuel.toFixed(0)} kg\n\n`;
        }
      });

      optimizationReport += '\n💡 Tip: Weather-avoidance routes save fuel by reducing turbulence and wind resistance.';

      this.addMessage(
        'Route Optimization Report',
        optimizationReport,
        'success'
      );
    },

    provideWeatherInsight() {
      if (this.weatherHazards.length === 0) {
        this.addMessage(
          'Weather Analysis',
          '☀️ Clear skies across all major flight corridors. No significant weather hazards detected.',
          'success'
        );
        return;
      }

      const severeHazards = this.weatherHazards.filter(h => h.severity === 'high').length;
      const moderateHazards = this.weatherHazards.length - severeHazards;

      let weatherReport = 'Current weather conditions:\n\n';
      weatherReport += `🌩️ ${severeHazards} severe weather zone${severeHazards !== 1 ? 's' : ''}\n`;
      weatherReport += `⚠️ ${moderateHazards} moderate weather zone${moderateHazards !== 1 ? 's' : ''}\n\n`;

      // Count affected flights
      const affectedFlights = this.flights.filter(f => f.bottleneck).length;
      weatherReport += `📊 ${affectedFlights} flight${affectedFlights !== 1 ? 's' : ''} potentially affected\n\n`;
      weatherReport += 'Recommendation: Monitor weather patterns and consider rerouting affected flights for passenger safety and fuel efficiency.';

      this.addMessage('Weather Analysis', weatherReport, 'alert');
    },

    provideSystemOverview() {
      const context = getSystemContext(this.flights, this.airlines);

      let overview = 'System Status Overview:\n\n';
      overview += `✈️ Total Flights: ${context.totalFlights}\n`;
      overview += `✅ On-Time: ${context.onTimeFlights} (${context.onTimePercentage}%)\n`;
      overview += `⏰ Delayed: ${context.delayedFlights}\n`;
      overview += `⚠️ Bottlenecks: ${context.bottleneckFlights}\n`;
      overview += `🏢 Active Airlines: ${context.activeAirlines}\n`;
      overview += `👥 Total Passengers: ${context.totalPassengers.toLocaleString()}\n`;
      overview += `📏 Avg Altitude: ${context.avgAltitude.toLocaleString()} ft\n`;
      overview += `🔥 Busiest Route: ${context.busiestRoute}\n\n`;

      if (context.bottleneckFlights > 0) {
        overview += `⚠️ Action Required: ${context.bottleneckFlights} flight${context.bottleneckFlights !== 1 ? 's' : ''} experiencing congestion.`;
      } else {
        overview += '✅ All systems operating normally.';
      }

      this.addMessage('System Overview', overview, context.bottleneckFlights > 0 ? 'alert' : 'success');
    }
  }
};
</script>

<style scoped>
.ai-panel {
  position: fixed;
  bottom: v-bind(bottomPosition);
  right: 100px;
  width: 420px;
  max-height: 600px;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(74, 157, 215, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 999;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-panel.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.ai-header {
  padding: 20px;
  border-bottom: 1px solid #3a3a3a;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, rgba(74, 123, 167, 0.15) 0%, rgba(74, 157, 215, 0.1) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-title h2 {
  font-size: 18px;
  color: #fff;
  margin: 0 0 4px 0;
}

.ai-title p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.ai-close-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.ai-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.ai-close-btn svg {
  width: 20px;
  height: 20px;
  color: #e0e0e0;
}

.ai-actions {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  border-bottom: 1px solid #3a3a3a;
}

.ai-btn {
  padding: 12px;
  background: rgba(74, 157, 215, 0.1);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 8px;
  color: #4a9dd7;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.ai-btn:hover {
  background: rgba(74, 157, 215, 0.2);
  border-color: #4a9dd7;
}

.ai-btn svg {
  width: 18px;
  height: 18px;
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column-reverse;
  gap: 12px;
}

.ai-message {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #4a9dd7;
}

.ai-message.alert {
  border-left-color: #ef4444;
}

.ai-message.success {
  border-left-color: #4ade80;
}

.ai-message-icon {
  flex-shrink: 0;
}

.ai-message-icon svg {
  width: 20px;
  height: 20px;
  color: #4a9dd7;
}

.ai-message-title {
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  font-size: 14px;
}

.ai-message-text {
  color: #e0e0e0;
  font-size: 13px;
  line-height: 1.5;
}

.ai-message-time {
  font-size: 11px;
  color: #666;
  margin-top: 8px;
}

.ai-input {
  padding: 24px 20px;
  border-top: 2px solid rgba(74, 157, 215, 0.3);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  gap: 14px;
  align-items: center;
  border-radius: 0 0 16px 16px;
}

.ai-input input {
  flex: 1;
  padding: 14px 18px;
  background: linear-gradient(180deg, rgba(26, 26, 26, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
  border: 1px solid rgba(74, 157, 215, 0.3);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
}

.ai-input input:focus {
  outline: none;
  border-color: #4a9dd7;
  box-shadow: 0 0 0 3px rgba(74, 157, 215, 0.1);
}

.ai-send-btn {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.ai-send-btn:hover {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  transform: translateY(-2px) scale(1.05);
}

.ai-send-btn svg {
  width: 24px;
  height: 24px;
}
</style>
