# Alerting System Enhancement Plan
**Gemini Pro Chatbot + FastMCP + Animated Controls**

## Executive Summary

This document outlines the integration of an intelligent alerting system for the Aerospace Control application, combining:

- **Gemini Pro MCP Integration** - Google's Gemini Pro model as the AI backend via MCP
- **Enhanced Alert Management** - Proactive monitoring with AI-driven notifications
- **Animated Safety Controls** - Red switches with Framer Motion physics for critical alerts
- **NIST Compliance** - Following cybersecurity and aviation safety standards

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Aerospace Control Frontend                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────┐         ┌──────────────────────┐        │
│  │  Alert Dashboard  │◄────────┤  Gemini Pro Chatbot  │        │
│  │  - Active Alerts  │         │  - Natural Language  │        │
│  │  - Red Switches   │         │  - Context Analysis  │        │
│  │  - Priority Queue │         │  - Alert Routing     │        │
│  └─────────┬─────────┘         └──────────┬───────────┘        │
│            │                               │                     │
│            │         ┌────────────────────┴────────┐           │
│            │         │  MCP Client (Enhanced)      │           │
│            │         │  - Alert Tools              │           │
│            │         │  - Monitoring Skills        │           │
│            └─────────┤  - Real-time Subscriptions  │           │
│                      └──────────┬──────────────────┘           │
└─────────────────────────────────┼──────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SkySentinel Backend (FastAPI)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────┐         ┌──────────────────────┐        │
│  │  FastMCP Server   │◄────────┤  Gemini Pro Adapter  │        │
│  │  - Alert Tools    │         │  - API Integration   │        │
│  │  - Progressive    │         │  - Token Management  │        │
│  │    Disclosure     │         │  - Context Window    │        │
│  └─────────┬─────────┘         └──────────┬───────────┘        │
│            │                               │                     │
│            ▼                               ▼                     │
│  ┌─────────────────────────────────────────────────┐           │
│  │        Alert Monitoring Engine                  │           │
│  │  - Flight Safety Monitoring                     │           │
│  │  - Cabin Pressure Alerts                        │           │
│  │  - Fuel Anomaly Detection                       │           │
│  │  - Weather Hazard Warnings                      │           │
│  │  - System Health Monitoring                     │           │
│  │  - Trajectory Deviation Alerts                  │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Gemini Pro MCP Integration

### Why Gemini Pro?

1. **Multimodal Capabilities** - Can analyze text, data, and future visual inputs
2. **Large Context Window** - 1M tokens for comprehensive flight data analysis
3. **Fast Inference** - Low latency for real-time alerting
4. **Cost-Effective** - Competitive pricing for high-volume monitoring
5. **Google Cloud Integration** - Native GCP deployment options

### MCP Tools for Alerting

#### Core Alert Tools

```python
# Backend: src/mcp_server/alert_tools.py

from fastmcp import FastMCP
from typing import Dict, Any, List

mcp = FastMCP("aerospace-alert-system")

@mcp.tool()
async def create_alert(
    alert_type: str,
    severity: str,  # "critical", "high", "medium", "low"
    flight_id: str,
    message: str,
    data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Creates a new alert in the system.

    Alert types:
    - cabin_pressure: Pressure anomaly detected
    - fuel_critical: Fuel below safety threshold
    - weather_hazard: Severe weather in flight path
    - trajectory_deviation: Off-course alert
    - system_failure: Aircraft system malfunction
    - communication_loss: Lost contact with aircraft
    """
    alert_id = generate_alert_id()

    alert = {
        "id": alert_id,
        "type": alert_type,
        "severity": severity,
        "flight_id": flight_id,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow(),
        "status": "active",
        "acknowledged": False
    }

    # Store in database
    await db.alerts.insert_one(alert)

    # Broadcast to frontend via WebSocket
    await alert_manager.broadcast_alert(alert)

    # Trigger automated responses if critical
    if severity == "critical":
        await trigger_emergency_protocol(alert)

    return alert


@mcp.tool()
async def acknowledge_alert(
    alert_id: str,
    operator_id: str,
    notes: str = None
) -> Dict[str, Any]:
    """Acknowledges an alert and marks it as handled."""
    alert = await db.alerts.find_one({"id": alert_id})

    if not alert:
        raise ValueError(f"Alert {alert_id} not found")

    update = {
        "acknowledged": True,
        "acknowledged_by": operator_id,
        "acknowledged_at": datetime.utcnow(),
        "notes": notes
    }

    await db.alerts.update_one({"id": alert_id}, {"$set": update})

    return {"success": True, "alert_id": alert_id}


@mcp.tool()
async def get_active_alerts(
    severity_filter: List[str] = None,
    flight_id: str = None
) -> List[Dict[str, Any]]:
    """Retrieves all active alerts with optional filters."""
    query = {"status": "active", "acknowledged": False}

    if severity_filter:
        query["severity"] = {"$in": severity_filter}

    if flight_id:
        query["flight_id"] = flight_id

    alerts = await db.alerts.find(query).sort("timestamp", -1).to_list(100)

    return alerts


@mcp.tool()
async def analyze_alert_patterns(
    time_window_hours: int = 24
) -> Dict[str, Any]:
    """
    Analyzes alert patterns to identify systemic issues.
    Uses Gemini Pro to detect trends and correlations.
    """
    cutoff = datetime.utcnow() - timedelta(hours=time_window_hours)

    alerts = await db.alerts.find({
        "timestamp": {"$gte": cutoff}
    }).to_list(1000)

    # Use Gemini Pro to analyze patterns
    analysis_prompt = f"""
    Analyze these aerospace alerts for patterns:

    {json.dumps(alerts, indent=2)}

    Identify:
    1. Recurring issues (same type/aircraft)
    2. Cascading failures (related alerts)
    3. Time-based patterns (alerts during specific conditions)
    4. Risk factors requiring immediate attention
    5. Recommended preventive actions
    """

    analysis = await gemini_client.generate_content(analysis_prompt)

    return {
        "time_window": time_window_hours,
        "total_alerts": len(alerts),
        "analysis": analysis.text,
        "patterns_detected": extract_patterns(analysis.text)
    }
```

#### Alert Monitoring Skills

```python
# Backend: src/skills/alert_monitoring.py

alert_monitoring_skill = Skill(
    skill_id='alert_monitoring',
    name='Aerospace Alert Monitoring',
    description='Proactive monitoring and intelligent alerting for aerospace operations',
    full_instructions='''
    AEROSPACE ALERT MONITORING SYSTEM

    You are Commander Atlas, an AI copilot specializing in aerospace alert management.

    ## Core Responsibilities

    1. **Continuous Monitoring**
       - Monitor all active flights for anomalies
       - Track cabin pressure, fuel levels, trajectory
       - Watch for weather hazards and system failures
       - Detect communication losses

    2. **Alert Classification**
       - CRITICAL: Immediate safety threat (cabin pressure, fuel critical)
       - HIGH: Requires urgent attention (weather hazard, trajectory deviation)
       - MEDIUM: Monitor closely (minor system issues, fuel low)
       - LOW: Informational (routine maintenance alerts)

    3. **Response Protocols**
       - CRITICAL alerts trigger red switch activation (requires operator acknowledgment)
       - HIGH alerts generate immediate notifications with recommended actions
       - MEDIUM alerts queue for operator review
       - LOW alerts log for reference

    4. **Natural Language Interface**
       - Answer questions like "What are the current critical alerts?"
       - Provide context: "Explain this cabin pressure alert"
       - Suggest actions: "What should I do about flight AA567's fuel alert?"
       - Summarize trends: "Show me alert patterns from today"

    ## Alert Decision Matrix

    | Condition | Threshold | Severity | Action |
    |-----------|-----------|----------|--------|
    | Cabin Pressure Drop | >2 PSI/min | CRITICAL | Red switch + Emergency protocol |
    | Fuel Below Reserve | <30 min | CRITICAL | Red switch + Reroute |
    | Severe Weather in Path | Category 4+ | HIGH | Suggest reroute |
    | Trajectory Deviation | >10nm off course | HIGH | Alert + correction suggestion |
    | System Malfunction | Non-critical systems | MEDIUM | Log + maintenance flag |
    | Communication Delay | >2 min no response | MEDIUM | Retry + backup channels |

    ## Communication Style

    - Be **clear and concise** in emergencies
    - Use **aviation terminology** correctly
    - Provide **actionable recommendations**
    - Include **relevant data** (altitude, position, time)
    - Maintain **calm, professional tone**

    ## Example Interactions

    Operator: "What's the status?"
    Atlas: "Currently monitoring 12 flights. 1 HIGH alert: Flight AA567 approaching
    severe weather cell at 39.5°N, 104.8°W. Recommend reroute via waypoint DENVER."

    Operator: "Acknowledge alert for AA567"
    Atlas: "Alert AA567-WEATHER-001 acknowledged. Notifying flight crew of suggested
    reroute. Estimated delay: 8 minutes. Fuel sufficient for alternate route."
    ''',
    category='monitoring',
    context_tokens=850
)
```

### Gemini Pro Configuration

```python
# Backend: src/services/gemini_client.py

import google.generativeai as genai
from fastmcp import FastMCP

class GeminiProClient:
    """Client for Google Gemini Pro API with MCP integration."""

    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

        # Configure model with safety settings for aerospace context
        self.model = genai.GenerativeModel(
            'gemini-pro',
            generation_config={
                "temperature": 0.3,  # Lower temperature for factual accuracy
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 2048,
            },
            safety_settings={
                "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",  # Allow aviation safety discussions
                "HARM_CATEGORY_HARASSMENT": "BLOCK_MEDIUM_AND_ABOVE",
            }
        )

    async def analyze_alert_context(
        self,
        alert_data: Dict[str, Any],
        flight_context: Dict[str, Any]
    ) -> str:
        """
        Uses Gemini Pro to provide contextual analysis of alerts.
        """
        prompt = f"""
        AEROSPACE ALERT ANALYSIS

        Alert Details:
        - Type: {alert_data['type']}
        - Severity: {alert_data['severity']}
        - Flight: {alert_data['flight_id']}
        - Message: {alert_data['message']}

        Flight Context:
        - Position: {flight_context['position']}
        - Altitude: {flight_context['altitude']} ft
        - Speed: {flight_context['velocity']} kt
        - Heading: {flight_context['heading']}°
        - Weather: {flight_context.get('weather', 'N/A')}

        Provide:
        1. Root cause analysis
        2. Immediate recommended actions
        3. Risk assessment (1-10 scale)
        4. Related systems to monitor
        5. Expected resolution time

        Format as JSON with keys: analysis, recommendations, risk_score, monitors, eta
        """

        response = await self.model.generate_content_async(prompt)
        return response.text

    async def chat_with_context(
        self,
        message: str,
        conversation_history: List[Dict],
        active_alerts: List[Dict]
    ) -> str:
        """
        Handles conversational queries about alerts with full context.
        """
        # Build context-aware prompt
        context = f"""
        You are Commander Atlas, aerospace alert monitoring AI.

        ACTIVE ALERTS ({len(active_alerts)}):
        {json.dumps(active_alerts, indent=2)}

        CONVERSATION HISTORY:
        {json.dumps(conversation_history[-5:], indent=2)}

        OPERATOR QUERY: {message}

        Respond professionally with actionable information.
        """

        response = await self.model.generate_content_async(context)
        return response.text
```

---

## Part 2: Animated Red Switches (Framer Motion)

### Design Philosophy

**Red switches** are critical safety controls requiring:
- **High visibility** - Unmistakable in UI
- **Deliberate interaction** - Prevent accidental activation
- **Physical feedback** - Spring physics simulating real switches
- **Accessibility** - WCAG AA compliant, keyboard navigable

### Implementation with Motion One (Vue)

```bash
# Install Motion One for Vue
npm install motion
```

#### RedAlertSwitch Component

```vue
<!-- src/components/alerts/RedAlertSwitch.vue -->
<template>
  <div class="red-alert-container">
    <div class="alert-info">
      <div class="alert-header">
        <span class="alert-icon">⚠️</span>
        <h3 class="alert-title">{{ alert.message }}</h3>
      </div>
      <p class="alert-description">{{ alert.data.description }}</p>
      <div class="alert-meta">
        <span class="alert-flight">Flight: {{ alert.flight_id }}</span>
        <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
      </div>
    </div>

    <button
      ref="switchRef"
      class="red-switch"
      :class="{ active: isAcknowledged, animating: isAnimating }"
      :aria-label="`Acknowledge critical alert for ${alert.flight_id}`"
      :aria-pressed="isAcknowledged"
      role="switch"
      @click="handleToggle"
      @mouseenter="handleHover(true)"
      @mouseleave="handleHover(false)"
    >
      <div class="switch-track">
        <div
          ref="sliderRef"
          class="switch-slider"
        >
          <svg
            class="slider-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path v-if="!isAcknowledged" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            <path v-else d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>
      <span class="switch-label">
        {{ isAcknowledged ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE' }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { animate, spring } from 'motion';
import { useToast } from '@/composables/useToast';

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['acknowledge']);

const switchRef = ref(null);
const sliderRef = ref(null);
const isAcknowledged = ref(false);
const isAnimating = ref(false);
const { showSuccess, showError } = useToast();

// Spring physics configuration for satisfying toggle feel
const springConfig = {
  stiffness: 300,
  damping: 20,
  mass: 0.8
};

const handleToggle = async () => {
  if (isAnimating.value) return;

  isAnimating.value = true;

  try {
    // Animate toggle with spring physics
    if (!isAcknowledged.value) {
      // Acknowledge animation: slide right with overshoot
      await animate(
        sliderRef.value,
        { x: [0, 52] },
        {
          easing: spring(springConfig),
          duration: 0.6
        }
      ).finished;

      // Scale pulse on acknowledgment
      await animate(
        switchRef.value,
        { scale: [1, 1.05, 1] },
        { duration: 0.3 }
      ).finished;

      isAcknowledged.value = true;

      // Emit acknowledgment event
      emit('acknowledge', props.alert.id);

      showSuccess(
        `Alert ${props.alert.id} acknowledged`,
        'Alert Acknowledged'
      );
    } else {
      // Slide back left (if re-enabling needed)
      await animate(
        sliderRef.value,
        { x: [52, 0] },
        {
          easing: spring(springConfig),
          duration: 0.6
        }
      ).finished;

      isAcknowledged.value = false;
    }
  } catch (error) {
    console.error('Toggle animation error:', error);
    showError('Failed to acknowledge alert', 'Error');
  } finally {
    isAnimating.value = false;
  }
};

const handleHover = (isHovering) => {
  if (isAnimating.value || isAcknowledged.value) return;

  // Subtle hover animation: slight slide and glow
  animate(
    sliderRef.value,
    { x: isHovering ? 4 : 0 },
    { duration: 0.2, easing: 'ease-out' }
  );

  animate(
    switchRef.value,
    { boxShadow: isHovering ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 0 10px rgba(239, 68, 68, 0.3)' },
    { duration: 0.2 }
  );
};

// Auto-reset slider position on mount
onMounted(() => {
  if (sliderRef.value) {
    sliderRef.value.style.transform = 'translateX(0px)';
  }
});

// Watch for alert status changes
watch(() => props.alert.acknowledged, (newVal) => {
  if (newVal && !isAcknowledged.value) {
    isAcknowledged.value = true;
    if (sliderRef.value) {
      animate(sliderRef.value, { x: 52 }, { duration: 0 });
    }
  }
});

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};
</script>

<style scoped>
.red-alert-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 16px;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
  }
  50% {
    border-color: rgba(239, 68, 68, 0.5);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  }
}

.alert-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon {
  font-size: 32px;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-4px) rotate(-5deg); }
  75% { transform: translateX(4px) rotate(5deg); }
}

.alert-title {
  font-size: 20px;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-description {
  font-size: 14px;
  color: #e0e0e0;
  margin: 0;
  line-height: 1.6;
}

.alert-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

/* Red Switch Styling */
.red-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(20, 20, 20, 0.9);
  border: 3px solid #ef4444;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  min-width: 160px;
}

.red-switch:hover:not(.active) {
  background: rgba(239, 68, 68, 0.1);
  border-color: #f87171;
  transform: translateY(-2px);
}

.red-switch:active:not(.active) {
  transform: translateY(0);
}

.red-switch.active {
  background: rgba(74, 222, 128, 0.1);
  border-color: #4ade80;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.4);
  cursor: default;
}

.switch-track {
  position: relative;
  width: 80px;
  height: 40px;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  border: 2px solid #ef4444;
  overflow: visible;
}

.red-switch.active .switch-track {
  background: rgba(74, 222, 128, 0.2);
  border-color: #4ade80;
}

.switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(239, 68, 68, 0.5);
  will-change: transform;
}

.red-switch.active .switch-slider {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(74, 222, 128, 0.5);
}

.slider-icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.switch-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ef4444;
  text-align: center;
}

.red-switch.active .switch-label {
  color: #4ade80;
}

/* Focus styles for accessibility */
.red-switch:focus {
  outline: 3px solid #60a5fa;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .red-switch {
    border-width: 4px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .red-alert-container {
    animation: none;
  }

  .alert-icon {
    animation: none;
  }

  .red-switch:hover {
    transform: none;
  }
}
</style>
```

#### Alert Dashboard Integration

```vue
<!-- src/modules/alerts/AlertDashboard.vue -->
<template>
  <div class="alert-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Alert Management</h1>
      <div class="dashboard-stats">
        <div class="stat-card critical">
          <span class="stat-value">{{ criticalAlerts.length }}</span>
          <span class="stat-label">Critical</span>
        </div>
        <div class="stat-card high">
          <span class="stat-value">{{ highAlerts.length }}</span>
          <span class="stat-label">High Priority</span>
        </div>
        <div class="stat-card medium">
          <span class="stat-value">{{ mediumAlerts.length }}</span>
          <span class="stat-label">Medium</span>
        </div>
      </div>
    </div>

    <div class="alerts-section">
      <h2 class="section-title">Critical Alerts</h2>
      <div class="alerts-list">
        <RedAlertSwitch
          v-for="alert in criticalAlerts"
          :key="alert.id"
          :alert="alert"
          @acknowledge="handleAcknowledge"
        />
        <div v-if="criticalAlerts.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <p>No critical alerts</p>
        </div>
      </div>
    </div>

    <!-- High Priority Alerts -->
    <div class="alerts-section">
      <h2 class="section-title">High Priority</h2>
      <div class="alerts-list compact">
        <AlertCard
          v-for="alert in highAlerts"
          :key="alert.id"
          :alert="alert"
          @acknowledge="handleAcknowledge"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import RedAlertSwitch from '@/components/alerts/RedAlertSwitch.vue';
import AlertCard from '@/components/alerts/AlertCard.vue';
import { MCPClient } from '@/services/mcp-client';

const alerts = ref([]);
const mcpClient = ref(null);

const criticalAlerts = computed(() =>
  alerts.value.filter(a => a.severity === 'critical' && !a.acknowledged)
);

const highAlerts = computed(() =>
  alerts.value.filter(a => a.severity === 'high' && !a.acknowledged)
);

const mediumAlerts = computed(() =>
  alerts.value.filter(a => a.severity === 'medium' && !a.acknowledged)
);

const loadAlerts = async () => {
  if (!mcpClient.value) return;

  try {
    const result = await mcpClient.value.executeTool('get_active_alerts', {});
    alerts.value = result.data;
  } catch (error) {
    console.error('Failed to load alerts:', error);
  }
};

const handleAcknowledge = async (alertId) => {
  try {
    await mcpClient.value.executeTool('acknowledge_alert', {
      alert_id: alertId,
      operator_id: 'current_user',  // Get from auth context
      notes: `Acknowledged via dashboard at ${new Date().toISOString()}`
    });

    // Remove from active alerts
    alerts.value = alerts.value.filter(a => a.id !== alertId);
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
  }
};

onMounted(async () => {
  // Initialize MCP client
  const sessionId = localStorage.getItem('ai_session_id');
  if (sessionId) {
    mcpClient.value = new MCPClient(sessionId);
    await mcpClient.value.connect();
    await loadAlerts();

    // Subscribe to real-time alert updates
    mcpClient.value.on('alert_created', (alert) => {
      alerts.value.unshift(alert);
    });

    mcpClient.value.on('alert_updated', (updatedAlert) => {
      const index = alerts.value.findIndex(a => a.id === updatedAlert.id);
      if (index !== -1) {
        alerts.value[index] = updatedAlert;
      }
    });
  }
});

onBeforeUnmount(() => {
  if (mcpClient.value) {
    mcpClient.value.disconnect();
  }
});
</script>

<style scoped>
.alert-dashboard {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #e0e0e0;
  margin: 0;
}

.dashboard-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: #1f1f1f;
  border-radius: 12px;
  border: 2px solid;
  min-width: 100px;
}

.stat-card.critical {
  border-color: #ef4444;
}

.stat-card.high {
  border-color: #f97316;
}

.stat-card.medium {
  border-color: #eab308;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: inherit;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
}

.alerts-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0 0 20px 0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #1f1f1f;
  border: 2px dashed #3a3a3a;
  border-radius: 16px;
  color: #888;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #4ade80;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}
</style>
```

---

## Part 3: NIST Compliance Considerations

### Relevant NIST Standards

#### 1. **NIST SP 800-53** (Security and Privacy Controls)

**Applicable Controls for Alerting System:**

| Control ID | Control Name | Implementation |
|------------|--------------|----------------|
| AU-2 | Audit Events | Log all alert creations, acknowledgments, and dismissals |
| AU-6 | Audit Review, Analysis, and Reporting | Pattern analysis using Gemini Pro |
| IR-4 | Incident Handling | Automated alert routing and response protocols |
| IR-5 | Incident Monitoring | Real-time monitoring with WebSocket subscriptions |
| SI-4 | System Monitoring | Continuous monitoring of flight systems |
| SC-5 | Denial of Service Protection | Rate limiting on alert creation |

**Implementation Example:**

```python
# Backend: src/security/audit_logging.py

from datetime import datetime
import json

class AuditLogger:
    """NIST 800-53 compliant audit logging."""

    async def log_alert_event(
        self,
        event_type: str,  # "created", "acknowledged", "dismissed"
        alert_id: str,
        user_id: str,
        metadata: Dict[str, Any]
    ):
        audit_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": f"alert.{event_type}",
            "alert_id": alert_id,
            "user_id": user_id,
            "ip_address": metadata.get('ip'),
            "user_agent": metadata.get('user_agent'),
            "session_id": metadata.get('session_id'),
            "details": metadata.get('details'),
            "compliance": "NIST-800-53-AU-2"
        }

        # Store in secure audit database
        await db.audit_logs.insert_one(audit_entry)

        # Stream to SIEM if configured
        if siem_enabled:
            await send_to_siem(audit_entry)
```

#### 2. **NIST Cybersecurity Framework**

**Framework Functions Applied:**

- **IDENTIFY** - Asset management of critical flight systems
- **PROTECT** - Access controls on alert acknowledgment (operator authentication)
- **DETECT** - Anomaly detection using Gemini Pro pattern analysis
- **RESPOND** - Automated response protocols for critical alerts
- **RECOVER** - System restoration procedures post-incident

#### 3. **Aviation-Specific Standards**

While NIST focuses on cybersecurity, consider these aviation standards:

- **DO-178C** - Software safety for airborne systems
- **ARP4761** - Safety assessment for civil aircraft
- **DO-326A** - Airworthiness security methods

**Key Requirements:**
- **Redundancy**: Dual-channel alerting (UI + audio)
- **Fail-Safe**: System defaults to "alert mode" on failure
- **Audit Trail**: Immutable logs of all safety-critical actions
- **Latency**: Sub-second alert delivery for critical events

### Compliance Implementation Checklist

```markdown
## NIST Compliance Checklist

### Data Security
- [ ] API keys encrypted at rest (AES-256-GCM)
- [ ] TLS 1.3 for all API communications
- [ ] Session tokens with HMAC signatures
- [ ] Regular security audits of dependencies

### Access Control
- [ ] Role-based access control (RBAC) for alert management
- [ ] Multi-factor authentication for critical operations
- [ ] Session timeouts and automatic logout
- [ ] Operator identity verification before acknowledgment

### Audit & Monitoring
- [ ] Comprehensive audit logging (AU-2)
- [ ] Log retention policy (90 days minimum)
- [ ] Automated log analysis for anomalies (AU-6)
- [ ] Real-time SIEM integration

### Incident Response
- [ ] Documented response procedures (IR-4)
- [ ] Automated escalation pathways
- [ ] Communication protocols
- [ ] Post-incident review process

### System Monitoring
- [ ] 24/7 system health monitoring (SI-4)
- [ ] Alerting on monitoring system failures
- [ ] Redundant monitoring channels
- [ ] Performance metrics tracking
```

---

## Part 4: Integration Roadmap

### Phase 1: Gemini Pro MCP Setup (Week 1)

**Tasks:**

1. **Backend Setup**
   ```bash
   cd skysentinel-backend
   pip install google-generativeai fastmcp
   ```

2. **Configure Gemini Pro Provider**
   ```python
   # Add to src/services/ai_providers.py
   PROVIDERS['google'] = {
       'name': 'Google Gemini',
       'models': ['gemini-pro', 'gemini-pro-vision'],
       'client_class': GeminiProClient
   }
   ```

3. **Create Alert Tools**
   - Implement `create_alert`
   - Implement `acknowledge_alert`
   - Implement `get_active_alerts`
   - Implement `analyze_alert_patterns`

4. **Register Alert Monitoring Skill**
   ```python
   skill_registry.register(alert_monitoring_skill)
   ```

**Deliverables:**
- ✅ Gemini Pro API integration working
- ✅ 4 alert tools registered with FastMCP
- ✅ Alert monitoring skill available
- ✅ Basic alert CRUD operations functional

### Phase 2: Animated Red Switches (Week 2)

**Tasks:**

1. **Install Motion One**
   ```bash
   npm install motion
   ```

2. **Create RedAlertSwitch Component**
   - Implement spring physics animations
   - Add hover and active states
   - Accessibility features (ARIA, keyboard nav)

3. **Build Alert Dashboard**
   - Critical alerts section with red switches
   - High/medium priority sections
   - Real-time WebSocket subscriptions

4. **Connect to MCP Backend**
   - MCP client methods for alerts
   - WebSocket event handlers
   - Error handling and fallbacks

**Deliverables:**
- ✅ RedAlertSwitch component with animations
- ✅ Alert Dashboard module
- ✅ Real-time alert updates working
- ✅ WCAG AA compliant

### Phase 3: Gemini Chatbot Interface (Week 3)

**Tasks:**

1. **Enhance AI Chat Module**
   - Update for Gemini Pro provider
   - Add alert-specific quick actions
   - Contextual alert queries

2. **Natural Language Alert Interface**
   ```
   User: "What are the current critical alerts?"
   Gemini: "There is 1 critical alert: Flight AA567 cabin pressure
            dropping at 2.5 PSI/min. Current altitude 35,000 ft.
            Recommend immediate descent to 10,000 ft."
   ```

3. **Alert Context Integration**
   - Inject alert data into conversation context
   - Pattern analysis on request
   - Proactive alert suggestions

**Deliverables:**
- ✅ Gemini Pro conversational interface
- ✅ Alert-aware chat responses
- ✅ Quick action buttons for common queries
- ✅ Integrated with dual-panel layout

### Phase 4: NIST Compliance & Testing (Week 4)

**Tasks:**

1. **Implement Audit Logging**
   - NIST 800-53 AU-2 compliant logs
   - Immutable audit trail
   - SIEM integration prep

2. **Security Hardening**
   - Encrypted communications audit
   - Access control enforcement
   - Session management review

3. **Comprehensive Testing**
   - Unit tests for alert tools
   - Integration tests for MCP flow
   - E2E tests for critical alert scenarios
   - Performance testing (latency < 1s for critical alerts)

4. **Documentation**
   - Operator manual for alert management
   - Incident response procedures
   - Compliance evidence documentation

**Deliverables:**
- ✅ Audit logging operational
- ✅ Security audit passed
- ✅ Test coverage >80%
- ✅ Compliance documentation complete

---

## Part 5: Gemini Pro Chatbot Examples

### Example 1: Alert Status Query

```
Operator: "What's the alert status?"

Gemini Pro (via MCP):
"Currently monitoring 12 active flights with the following alerts:

🔴 CRITICAL (1)
- Flight AA567: Cabin pressure anomaly
  - Pressure dropping 2.5 PSI/min
  - Current: 10.2 PSI (threshold: 11.3 PSI)
  - Position: 39.5°N, 104.8°W
  - Action: Red switch requires acknowledgment

🟠 HIGH (2)
- Flight UA123: Severe weather in path
  - Category 4 storm at waypoint DENVER
  - ETA to hazard: 18 minutes
  - Action: Reroute suggested via alternate waypoint

- Flight DL456: Trajectory deviation
  - 12nm off planned route
  - Current heading: 245° (planned: 260°)
  - Action: Verify autopilot settings

Recommended: Acknowledge AA567 critical alert immediately."
```

### Example 2: Alert Explanation

```
Operator: "Explain the cabin pressure alert for AA567"

Gemini Pro:
"CABIN PRESSURE ALERT ANALYSIS

Root Cause:
The cabin pressure drop of 2.5 PSI/min indicates a potential:
1. Cabin seal breach (most likely)
2. Pressurization system malfunction
3. Outflow valve stuck open

Immediate Risk:
- Hypoxia risk above 10,000 ft
- Current altitude: 35,000 ft (HIGH RISK)
- Time to critical pressure: ~4 minutes

Recommended Actions:
1. IMMEDIATE: Descend to 10,000 ft
2. URGENT: Deploy oxygen masks
3. URGENT: Notify ATC of emergency descent
4. Monitor: Pressure stabilization during descent
5. Consider: Emergency landing at nearest suitable airport

Related Systems to Monitor:
- Oxygen system status
- Outflow valve position
- Cabin temperature
- Passenger oxygen mask deployment

Expected Resolution:
- Emergency descent: 6-8 minutes
- Pressure stabilization: 2-3 minutes after reaching 10,000 ft
- Diversion ETA: 25-30 minutes to nearest airport

Risk Score: 9/10 (CRITICAL)"
```

### Example 3: Pattern Analysis

```
Operator: "Analyze alert patterns from today"

Gemini Pro:
"ALERT PATTERN ANALYSIS (Last 24 Hours)

Overview:
- Total Alerts: 47
- Critical: 3
- High: 12
- Medium: 23
- Low: 9

Patterns Detected:

1. FUEL ANOMALY CLUSTER (High Confidence)
   - 5 fuel-related alerts between 14:00-16:00 UTC
   - All flights: AA series (AA123, AA456, AA567, AA789, AA890)
   - Correlation: Same fuel supplier (Denver hub)
   - Risk: Potential contaminated fuel batch
   - Recommendation: Ground AA fleet, inspect fuel supply

2. WEATHER-RELATED SPIKE (Medium Confidence)
   - 8 weather alerts 18:00-20:00 UTC
   - Location: Central US (Kansas, Oklahoma)
   - Cause: Severe thunderstorm system
   - Recommendation: Reroute all Central US flights for next 4 hours

3. TRAJECTORY DEVIATIONS (Low Confidence)
   - 4 trajectory alerts across different airlines
   - No geographic correlation
   - Likely cause: ATC-directed course changes
   - Recommendation: Monitor but no action needed

Systemic Issues Requiring Attention:
⚠️ HIGH PRIORITY: Fuel supply contamination investigation
- Impact: 5 flights, potential safety risk
- Action: Immediate fuel supplier audit
- Estimated impact: 2-4 hour ground delay for AA fleet

Preventive Actions Recommended:
1. Enhanced fuel quality monitoring
2. Pre-flight fuel sample testing for AA flights
3. Backup fuel supplier identification
4. Crew briefing on fuel contamination symptoms

Next Analysis: Scheduled in 6 hours or on-demand"
```

---

## Part 6: Performance & Scalability

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Alert Creation Latency | < 500ms | Backend to frontend |
| Alert Display Latency | < 100ms | Frontend render |
| Gemini API Response | < 2s | Query to response |
| Red Switch Animation | 60 FPS | Smooth physics |
| WebSocket Latency | < 50ms | Real-time updates |
| Dashboard Load Time | < 1s | Initial page load |

### Scalability Considerations

```python
# Backend: Scaling strategy for high-volume alerting

from fastapi import FastAPI
from redis import asyncio as aioredis

app = FastAPI()

# Redis pub/sub for distributed alerting
redis_client = aioredis.from_url("redis://localhost:6379")

@app.post("/alerts/create")
async def create_alert_scaled(alert_data: AlertCreate):
    # Create alert in database
    alert_id = await db.alerts.insert_one(alert_data.dict())

    # Publish to Redis for distributed workers
    await redis_client.publish(
        "alerts_channel",
        json.dumps({"id": alert_id, "data": alert_data.dict()})
    )

    return {"id": alert_id, "status": "created"}

# Background worker for Gemini analysis
@app.on_event("startup")
async def start_alert_processor():
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("alerts_channel")

    async for message in pubsub.listen():
        if message["type"] == "message":
            alert = json.loads(message["data"])

            # Async Gemini analysis
            if alert["data"]["severity"] == "critical":
                asyncio.create_task(
                    analyze_alert_with_gemini(alert["id"], alert["data"])
                )
```

### Caching Strategy

```python
# Backend: Cache Gemini responses for similar queries

from functools import lru_cache
import hashlib

class GeminiCache:
    def __init__(self):
        self.cache = {}
        self.ttl = 300  # 5 minutes

    def cache_key(self, prompt: str, context: Dict) -> str:
        # Generate cache key from prompt + context hash
        content = f"{prompt}{json.dumps(context, sort_keys=True)}"
        return hashlib.sha256(content.encode()).hexdigest()

    async def get_or_generate(
        self,
        prompt: str,
        context: Dict,
        gemini_client: GeminiProClient
    ) -> str:
        key = self.cache_key(prompt, context)

        # Check cache
        if key in self.cache:
            cached_time, response = self.cache[key]
            if time.time() - cached_time < self.ttl:
                return response

        # Generate new response
        response = await gemini_client.generate_content(prompt, context)

        # Cache result
        self.cache[key] = (time.time(), response)

        return response
```

---

## Part 7: Testing Strategy

### Unit Tests

```python
# tests/test_alert_tools.py

import pytest
from src.mcp_server.alert_tools import create_alert, acknowledge_alert

@pytest.mark.asyncio
async def test_create_critical_alert():
    alert = await create_alert(
        alert_type="cabin_pressure",
        severity="critical",
        flight_id="AA567",
        message="Cabin pressure dropping",
        data={
            "rate": 2.5,
            "current_pressure": 10.2,
            "threshold": 11.3
        }
    )

    assert alert["severity"] == "critical"
    assert alert["status"] == "active"
    assert alert["acknowledged"] == False

@pytest.mark.asyncio
async def test_acknowledge_alert():
    # Create alert first
    alert = await create_alert(...)

    # Acknowledge it
    result = await acknowledge_alert(
        alert_id=alert["id"],
        operator_id="test_operator"
    )

    assert result["success"] == True

    # Verify acknowledgment
    updated_alert = await db.alerts.find_one({"id": alert["id"]})
    assert updated_alert["acknowledged"] == True
```

### Integration Tests

```javascript
// tests/integration/alert-flow.test.js

describe('Alert Flow Integration', () => {
  it('should create alert, display red switch, and acknowledge', async () => {
    // 1. Backend creates critical alert
    const alertResponse = await fetch('/api/v1/mcp/tools/execute', {
      method: 'POST',
      body: JSON.stringify({
        tool: 'create_alert',
        params: {
          alert_type: 'cabin_pressure',
          severity: 'critical',
          flight_id: 'TEST123',
          message: 'Test alert',
          data: {}
        }
      })
    });

    const alert = await alertResponse.json();

    // 2. Frontend receives alert via WebSocket
    await waitForElement('[data-alert-id="' + alert.id + '"]');

    // 3. Red switch is displayed
    const redSwitch = document.querySelector('.red-switch');
    expect(redSwitch).toBeDefined();

    // 4. Operator clicks red switch
    await redSwitch.click();

    // 5. Animation completes
    await waitForAnimation(redSwitch, 600);

    // 6. Alert acknowledged in backend
    const acknowledgedAlert = await fetch(`/api/v1/alerts/${alert.id}`);
    const data = await acknowledgedAlert.json();

    expect(data.acknowledged).toBe(true);
  });
});
```

### E2E Tests with Playwright

```javascript
// e2e/alert-management.spec.js

const { test, expect } = require('@playwright/test');

test('Critical alert acknowledgment flow', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('http://localhost:5173/alerts');

  // Wait for critical alert to appear
  await page.waitForSelector('.red-alert-container');

  // Verify red switch is present
  const redSwitch = page.locator('.red-switch');
  await expect(redSwitch).toBeVisible();

  // Check switch is in unacknowledged state
  await expect(redSwitch).not.toHaveClass(/active/);

  // Click red switch
  await redSwitch.click();

  // Wait for animation
  await page.waitForTimeout(700);

  // Verify switch is now acknowledged
  await expect(redSwitch).toHaveClass(/active/);

  // Verify toast notification
  const toast = page.locator('.toast-notification');
  await expect(toast).toContainText('Alert Acknowledged');

  // Verify alert removed from critical list
  await expect(page.locator('.red-alert-container')).toHaveCount(0);
});
```

---

## Success Criteria

### Functional Requirements
- ✅ Gemini Pro successfully processes alert queries with <2s latency
- ✅ Red switches animate with spring physics at 60 FPS
- ✅ Critical alerts trigger red switch UI within 500ms
- ✅ Alert acknowledgment persists across sessions
- ✅ Real-time alert updates via WebSocket
- ✅ Pattern analysis identifies systemic issues

### Non-Functional Requirements
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ NIST 800-53 audit logging implemented
- ✅ 99.9% uptime for alert system
- ✅ Handles 1000+ concurrent alerts without degradation
- ✅ Mobile-responsive design
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Security Requirements
- ✅ API keys encrypted with AES-256-GCM
- ✅ TLS 1.3 for all communications
- ✅ Role-based access control
- ✅ Immutable audit trail
- ✅ Session management with automatic timeout
- ✅ Input validation and sanitization

---

## Next Steps

1. **Review & Approve Plan** - Stakeholder sign-off on architecture
2. **Environment Setup** - Provision Gemini Pro API keys, Redis, PostgreSQL
3. **Sprint Planning** - Break down phases into 2-week sprints
4. **Development Kickoff** - Begin Phase 1 (Gemini MCP Setup)
5. **Regular Reviews** - Weekly demo of completed features
6. **Security Audit** - Mid-point security review (Week 2)
7. **User Acceptance Testing** - Operator feedback on red switch UX
8. **Compliance Review** - NIST checklist verification
9. **Production Deployment** - Gradual rollout with canary testing
10. **Post-Launch Monitoring** - 30-day intensive monitoring period

---

## Resources & References

### Gemini Pro Documentation
- [Google AI Gemini API](https://ai.google.dev/docs)
- [Gemini Pro API Reference](https://ai.google.dev/api/rest)
- [Gemini Safety Settings](https://ai.google.dev/docs/safety_setting_gemini)

### Framer Motion / Motion One
- [Motion One Documentation](https://motion.dev/)
- [Spring Animations Guide](https://motion.dev/docs/spring)
- [Vue Integration](https://motion.dev/docs/vue)

### NIST Standards
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### FastMCP
- [FastMCP Documentation](https://gofastmcp.com)
- [Progressive Tool Disclosure](https://gofastmcp.com/concepts/progressive-disclosure)

### Aviation Standards
- [DO-178C Software Considerations](https://www.rtca.org/content/standards-guidance-materials)
- [ARP4761 Safety Assessment](https://www.sae.org/standards/content/arp4761/)

---

**Document Version:** 1.0
**Last Updated:** January 11, 2026
**Status:** 📋 Ready for Implementation
**Contact:** Aerospace Control Development Team
