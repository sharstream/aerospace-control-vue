AI Chat UI Migration: UIGen Elegance to Aerospace Control

     Executive Summary

     Transform the current fixed bottom-right AI chat panel into an elegant dual-panel layout inspired by UIGen's React implementation. The
     new design features:
     - Bot chat on left (35% default), Real data visualization on right (65%)
     - Enhanced message rendering with multiple part types (text, reasoning, tool results)
     - Modern design system with CSS design tokens (OKLCH color space)
     - Resizable panels with persistent state
     - Embedded flight data visualization in the right preview panel

     Approach: Adopt UIGen's polished UI patterns while maintaining aerospace dark theme, Vue 3 architecture, and existing MCP integration.

     ---
     Technology Stack

     New Dependencies

     # UI Component Library
     npm install radix-vue

     # Styling
     npm install -D tailwindcss postcss autoprefixer
     npm install clsx tailwind-merge class-variance-authority

     # Markdown & Syntax Highlighting
     npm install marked highlight.js

     # Utilities
     npm install dompurify  # XSS protection for markdown

     Vue Approach

     - New components: Composition API with <script setup>
     - Existing components: Keep Options API (gradual migration)
     - Use composables for shared logic (useChatState, usePanelResize)

     ---
     Component Architecture

     New File Structure

     src/
     ├── assets/styles/
     │   ├── tokens/
     │   │   ├── colors.css          # OKLCH color system
     │   │   ├── spacing.css         # Spacing scale
     │   │   ├── typography.css      # Font styles
     │   │   └── shadows.css         # Shadow tokens
     │   └── tokens.css              # Token aggregator
     │
     ├── modules/ai-chat/
     │   ├── AIChatModule.vue        # [MODIFY] Dual-panel container
     │   │
     │   ├── components/
     │   │   ├── chat/
     │   │   │   ├── ChatInterface.vue      # Left panel wrapper
     │   │   │   ├── ChatHeader.vue         # Commander Atlas header
     │   │   │   ├── MessageList.vue        # Scrollable message area
     │   │   │   ├── MessageItem.vue        # Single message router
     │   │   │   └── MessageInput.vue       # Input field + send button
     │   │   │
     │   │   ├── message-parts/
     │   │   │   ├── TextMessagePart.vue            # Markdown text
     │   │   │   ├── ReasoningMessagePart.vue       # Collapsible reasoning
     │   │   │   ├── ToolInvocationPart.vue         # Tool call badge
     │   │   │   ├── ToolResultPart.vue             # Tool response
     │   │   │   └── SourceMessagePart.vue          # Citations
     │   │   │
     │   │   ├── preview/
     │   │   │   ├── DataPreviewPanel.vue           # Right panel wrapper
     │   │   │   ├── FlightDataPreview.vue          # Real-time flight cards
     │   │   │   ├── WeatherAnalysisPreview.vue     # Weather hazards
     │   │   │   ├── RouteOptimizationPreview.vue   # Route comparison
     │   │   │   └── SystemStatusPreview.vue        # System health
     │   │   │
     │   │   ├── ResizableHandle.vue        # Draggable divider
     │   │   └── MarkdownRenderer.vue       # Markdown parser
     │   │
     │   └── composables/
     │       ├── useChatState.js        # Message state management
     │       ├── usePanelResize.js      # Panel sizing logic
     │       └── useMessageParser.js    # Tool result → message parts
     │
     └── shared/utils/
         ├── cn.js                      # Class merging utility
         └── messageTransformers.js     # Message structure adapters

     Component Hierarchy

     AIChatModule.vue (Dual-panel container)
     ├─ ChatInterface.vue (Left 35%)
     │  ├─ ChatHeader.vue
     │  ├─ RadixVue.ScrollArea
     │  │  └─ MessageList.vue
     │  │     └─ MessageItem.vue (v-for)
     │  │        ├─ TextMessagePart.vue
     │  │        ├─ ReasoningMessagePart.vue
     │  │        ├─ ToolInvocationPart.vue
     │  │        └─ ToolResultPart.vue
     │  └─ MessageInput.vue
     │
     ├─ ResizableHandle.vue (Draggable divider)
     │
     └─ DataPreviewPanel.vue (Right 65%)
        ├─ FlightDataPreview.vue
        ├─ WeatherAnalysisPreview.vue
        ├─ RouteOptimizationPreview.vue
        └─ SystemStatusPreview.vue

     ---
     Implementation Plan

     Phase 1: Foundation Setup (Days 1-2)

     1.1 Install Dependencies
     cd /Users/davidperez/workspaces/aerospace-control-vue
     npm install radix-vue clsx tailwind-merge class-variance-authority marked highlight.js dompurify
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init -p

     1.2 Configure Tailwind
     Create tailwind.config.js:
     export default {
       prefix: 'tw-',  // Avoid conflicts with existing CSS
       content: ['./index.html', './src/**/*.{vue,js}'],
       theme: {
         extend: {
           colors: {
             'aerospace-blue': {
               500: '#4a9dd7',  // Preserve existing brand color
               // Add OKLCH variants
             }
           }
         }
       }
     }

     1.3 Create Design Token System
     Create src/assets/styles/tokens/colors.css:
     :root {
       /* Aerospace Theme - OKLCH */
       --color-primary: oklch(0.65 0.15 240);      /* #4a9dd7 */
       --color-success: oklch(0.70 0.18 150);      /* #4ade80 */
       --color-error: oklch(0.60 0.22 25);         /* #ef4444 */

       --color-bg-primary: oklch(0.12 0.01 240);   /* Dark base */
       --color-surface: oklch(0.16 0.01 240);      /* Elevated cards */
       --color-border: oklch(0.25 0.02 240 / 0.2); /* Subtle borders */

       /* Text hierarchy */
       --color-text-primary: oklch(0.90 0 0);
       --color-text-secondary: oklch(0.60 0 0);
       --color-text-tertiary: oklch(0.40 0 0);
     }

     1.4 Create Utility Functions
     Create src/shared/utils/cn.js:
     import { clsx } from 'clsx';
     import { twMerge } from 'tailwind-merge';

     export function cn(...inputs) {
       return twMerge(clsx(inputs));
     }

     Deliverables:
     - ✅ All dependencies installed
     - ✅ Tailwind configured with aerospace theme
     - ✅ Design token files created
     - ✅ Utility functions ready

     ---
     Phase 2: Dual-Panel Layout (Days 3-4)

     2.1 Create ResizableHandle Component
     Create src/modules/ai-chat/components/ResizableHandle.vue:
     - Handle mouse/touch drag events
     - Update panel widths reactively
     - Visual hover/active states
     - Snap to preset sizes (25%, 35%, 50%)

     2.2 Create usePanelResize Composable
     Create src/modules/ai-chat/composables/usePanelResize.js:
     export function usePanelResize(containerRef) {
       const leftWidth = ref(35);  // percentage
       const rightWidth = computed(() => 100 - leftWidth.value);

       const startResize = (e) => {
         // Drag logic with constraints (min 25%, max 75%)
       };

       // Persist to localStorage
       watchEffect(() => {
         localStorage.setItem('chat-panel-width', leftWidth.value);
       });

       return { leftWidth, rightWidth, startResize };
     }

     2.3 Transform AIChatModule.vue
     Modify /Users/davidperez/workspaces/aerospace-control-vue/src/modules/ai-chat/AIChatModule.vue:
     <template>
       <div class="ai-panel-dual" :class="{ visible }">
         <div class="panel-container">
           <!-- Left Panel: Chat -->
           <div
             class="panel-left"
             :style="{ width: `${leftWidth}%` }"
           >
             <ChatInterface />
           </div>

           <!-- Resizable Handle -->
           <ResizableHandle @resize="handleResize" />

           <!-- Right Panel: Data Preview -->
           <div
             class="panel-right"
             :style="{ width: `${rightWidth}%` }"
           >
             <DataPreviewPanel />
           </div>
         </div>
       </div>
     </template>

     <script setup>
     import { usePanelResize } from './composables/usePanelResize';
     import ChatInterface from './components/chat/ChatInterface.vue';
     import DataPreviewPanel from './components/preview/DataPreviewPanel.vue';
     import ResizableHandle from './components/ResizableHandle.vue';

     const { leftWidth, rightWidth, handleResize } = usePanelResize();
     </script>

     <style scoped>
     .ai-panel-dual {
       position: fixed;
       bottom: 160px;
       right: 20px;
       width: 85vw;
       max-width: 1400px;
       height: 80vh;
       max-height: 800px;
       /* Preserve glassmorphism */
       backdrop-filter: blur(16px);
       background: rgba(26, 26, 26, 0.95);
       border-radius: 16px;
       box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
     }

     .panel-container {
       display: flex;
       height: 100%;
       overflow: hidden;
     }
     </style>

     Deliverables:
     - ✅ ResizableHandle component working
     - ✅ usePanelResize composable with persistence
     - ✅ AIChatModule.vue restructured to dual-panel
     - ✅ Panel sizing responsive and smooth

     ---
     Phase 3: Enhanced Message Components (Days 5-7)

     3.1 Enhanced Message Structure
     Update message data structure:
     // Old structure (keep for backward compatibility)
     { title: String, content: String, type: String, time: String }

     // New structure
     {
       id: String,
       role: 'user' | 'assistant' | 'system',
       timestamp: Date,
       parts: [
         { type: 'text', content: String },
         { type: 'reasoning', content: String },
         { type: 'tool-invocation', content: { name, params, status } },
         { type: 'tool-result', content: { data, previewType } }
       ]
     }

     3.2 Create ChatInterface Component
     Create src/modules/ai-chat/components/chat/ChatInterface.vue:
     <template>
       <div class="chat-interface">
         <ChatHeader />

         <ScrollArea ref="scrollAreaRef" class="message-area">
           <MessageList :messages="messages" :isLoading="isLoading" />
         </ScrollArea>

         <MessageInput
           v-model="input"
           @submit="handleSubmit"
           :disabled="isLoading"
         />
       </div>
     </template>

     <script setup>
     import { ref, watch } from 'vue';
     import { ScrollArea } from 'radix-vue';
     import ChatHeader from './ChatHeader.vue';
     import MessageList from './MessageList.vue';
     import MessageInput from './MessageInput.vue';

     // Auto-scroll to bottom
     watch(messages, () => {
       nextTick(() => {
         const viewport = scrollAreaRef.value?.$el.querySelector('[data-radix-scroll-area-viewport]');
         if (viewport) viewport.scrollTop = viewport.scrollHeight;
       });
     });
     </script>

     3.3 Create MessageItem Component
     Create src/modules/ai-chat/components/chat/MessageItem.vue:
     <template>
       <div
         class="message-item"
         :class="[message.role, { 'has-preview': hasPreviewPart }]"
       >
         <!-- Avatar -->
         <div class="message-avatar">
           <BotIcon v-if="message.role === 'assistant'" />
           <UserIcon v-else />
         </div>

         <!-- Message Content -->
         <div class="message-bubble">
           <component
             v-for="(part, idx) in message.parts"
             :key="idx"
             :is="getPartComponent(part.type)"
             :part="part"
             @show-preview="handleShowPreview"
           />
         </div>
       </div>
     </template>

     <script setup>
     import { computed } from 'vue';
     import TextMessagePart from '../message-parts/TextMessagePart.vue';
     import ReasoningMessagePart from '../message-parts/ReasoningMessagePart.vue';
     import ToolInvocationPart from '../message-parts/ToolInvocationPart.vue';
     import ToolResultPart from '../message-parts/ToolResultPart.vue';

     const getPartComponent = (type) => {
       const components = {
         'text': TextMessagePart,
         'reasoning': ReasoningMessagePart,
         'tool-invocation': ToolInvocationPart,
         'tool-result': ToolResultPart,
       };
       return components[type] || TextMessagePart;
     };

     const hasPreviewPart = computed(() =>
       props.message.parts.some(p => p.type === 'tool-result')
     );
     </script>

     3.4 Create Message Part Components

     Create src/modules/ai-chat/components/message-parts/TextMessagePart.vue:
     <template>
       <div class="text-message-part">
         <MarkdownRenderer :content="part.content" />
       </div>
     </template>

     Create src/modules/ai-chat/components/message-parts/ToolResultPart.vue:
     <template>
       <div class="tool-result-part">
         <div class="result-header">
           <CheckCircleIcon class="success-icon" />
           <span>{{ part.content.toolName }} completed</span>
           <button @click="showPreview" class="preview-btn">
             View Details →
           </button>
         </div>
         <div class="result-summary">
           {{ part.content.summary }}
         </div>
       </div>
     </template>

     <script setup>
     const emit = defineEmits(['show-preview']);

     const showPreview = () => {
       emit('show-preview', {
         type: part.content.previewType,  // 'flight-data', 'weather', 'route', 'system'
         data: part.content.data
       });
     };
     </script>

     3.5 Create MarkdownRenderer Component
     Create src/modules/ai-chat/components/MarkdownRenderer.vue:
     <template>
       <div class="markdown-content" v-html="sanitizedHtml" />
     </template>

     <script setup>
     import { computed } from 'vue';
     import { marked } from 'marked';
     import DOMPurify from 'dompurify';

     const props = defineProps({ content: String });

     const sanitizedHtml = computed(() => {
       const html = marked(props.content || '');
       return DOMPurify.sanitize(html);
     });
     </script>

     <style scoped>
     .markdown-content {
       /* Prose styling similar to Tailwind's @tailwindcss/typography */
       line-height: 1.6;
       color: var(--color-text-primary);
     }

     .markdown-content code {
       background: rgba(255, 255, 255, 0.1);
       padding: 2px 6px;
       border-radius: 4px;
       font-family: 'Courier New', monospace;
     }

     .markdown-content pre {
       background: rgba(0, 0, 0, 0.3);
       padding: 16px;
       border-radius: 8px;
       overflow-x: auto;
     }
     </style>

     Deliverables:
     - ✅ ChatInterface with RadixVue ScrollArea
     - ✅ MessageItem with dynamic part rendering
     - ✅ All message part components
     - ✅ MarkdownRenderer with XSS protection
     - ✅ Smooth auto-scrolling

     ---
     Phase 4: Right Panel Data Previews (Days 8-10)

     4.1 Create DataPreviewPanel Container
     Create src/modules/ai-chat/components/preview/DataPreviewPanel.vue:
     <template>
       <div class="data-preview-panel">
         <div class="preview-header">
           <h3>{{ previewTitle }}</h3>
           <button @click="closePreview" class="close-btn">×</button>
         </div>

         <div class="preview-content">
           <component
             :is="currentPreviewComponent"
             :data="previewData"
             v-if="previewData"
           />
           <div v-else class="empty-state">
             <AirplaneIcon />
             <p>Select a message with data to preview</p>
           </div>
         </div>
       </div>
     </template>

     <script setup>
     import { computed, inject } from 'vue';
     import FlightDataPreview from './FlightDataPreview.vue';
     import WeatherAnalysisPreview from './WeatherAnalysisPreview.vue';
     import RouteOptimizationPreview from './RouteOptimizationPreview.vue';

     const chatPreview = inject('chatPreview');

     const currentPreviewComponent = computed(() => {
       const components = {
         'flight-data': FlightDataPreview,
         'weather': WeatherAnalysisPreview,
         'route': RouteOptimizationPreview,
       };
       return components[chatPreview.type.value];
     });
     </script>

     4.2 Create FlightDataPreview Component
     Create src/modules/ai-chat/components/preview/FlightDataPreview.vue:
     <template>
       <div class="flight-data-preview">
         <!-- Flight Status Card -->
         <div class="status-card">
           <div class="flight-header">
             <span class="callsign">{{ data.flight.name }}</span>
             <span class="status-badge" :class="data.flight.statusClass">
               {{ data.flight.status }}
             </span>
           </div>

           <div class="route-info">
             <span>{{ data.flight.from }}</span>
             <ArrowRightIcon />
             <span>{{ data.flight.to }}</span>
           </div>

           <div class="metrics-grid">
             <div class="metric">
               <label>Altitude</label>
               <value>{{ data.flight.altitude }}</value>
             </div>
             <div class="metric">
               <label>Velocity</label>
               <value>{{ data.flight.velocity }}</value>
             </div>
             <div class="metric">
               <label>Heading</label>
               <value>{{ data.flight.heading }}</value>
             </div>
           </div>
         </div>

         <!-- Mini Map (Optional - Leaflet integration) -->
         <div class="mini-map">
           <!-- Embed small Leaflet map showing flight path -->
         </div>

         <!-- System Health -->
         <div class="systems-status" v-if="data.systems">
           <h4>Systems Health</h4>
           <div class="system-item" v-for="(status, system) in data.systems" :key="system">
             <span>{{ system }}</span>
             <HealthIndicator :status="status" />
           </div>
         </div>
       </div>
     </template>

     <script setup>
     const props = defineProps({
       data: Object  // Receives flight object from tool result
     });
     </script>

     4.3 Create WeatherAnalysisPreview & RouteOptimizationPreview
     Similar structure showing weather hazards and route comparisons respectively.

     4.4 Connect Preview to Messages
     Update src/modules/ai-chat/AIChatModule.vue:
     <script setup>
     import { provide, ref } from 'vue';

     const previewData = ref(null);
     const previewType = ref(null);

     // Provide to all child components
     provide('chatPreview', {
       data: previewData,
       type: previewType,
       setPreview: (type, data) => {
         previewType.value = type;
         previewData.value = data;
       }
     });

     const handleShowPreview = ({ type, data }) => {
       previewData.value = data;
       previewType.value = type;
     };
     </script>

     Deliverables:
     - ✅ DataPreviewPanel with empty state
     - ✅ FlightDataPreview showing real flight data
     - ✅ WeatherAnalysisPreview and RouteOptimizationPreview
     - ✅ Preview context provider working
     - ✅ Message-to-preview communication

     ---
     Phase 5: Integration & MCP Updates (Days 11-12)

     5.1 Update MCP Message Parsing
     Modify src/services/mcp-client.js:
     // Add method to parse tool results into enhanced message structure
     parseToolResultToMessage(toolName, result) {
       return {
         id: generateId(),
         role: 'assistant',
         timestamp: new Date(),
         parts: [
           {
             type: 'tool-invocation',
             content: {
               name: toolName,
               params: result.params,
               status: 'completed'
             }
           },
           {
             type: 'tool-result',
             content: {
               toolName,
               summary: this.generateSummary(toolName, result),
               previewType: this.detectPreviewType(toolName),
               data: result.data
             }
           },
           {
             type: 'text',
             content: this.formatToolResultText(toolName, result)
           }
         ]
       };
     }

     detectPreviewType(toolName) {
       const mapping = {
         'analyze_fuel_consumption': 'flight-data',
         'analyze_pressure': 'flight-data',
         'predict_trajectory': 'flight-data',
         'get_weather': 'weather',
         'optimize_route': 'route',
         'system_status': 'system'
       };
       return mapping[toolName] || 'flight-data';
     }

     5.2 Update AIChatModule Message Handlers
     Modify existing message handling to use new structure:
     // In AIChatModule.vue methods
     async sendMessageWithMCP() {
       // ... existing code ...

       const result = await this.mcpClient.executeTool(toolName, params);

       // Use new parser
       const enhancedMessage = this.mcpClient.parseToolResultToMessage(toolName, result);
       this.messages.push(enhancedMessage);

       // Trigger preview update
       const previewPart = enhancedMessage.parts.find(p => p.type === 'tool-result');
       if (previewPart) {
         this.handleShowPreview({
           type: previewPart.content.previewType,
           data: previewPart.content.data
         });
       }
     }

     5.3 Maintain Backward Compatibility
     Add message adapter for old structure:
     // src/shared/utils/messageTransformers.js
     export function adaptOldMessageToNew(oldMessage) {
       return {
         id: generateId(),
         role: oldMessage.title === 'You' ? 'user' : 'assistant',
         timestamp: new Date(oldMessage.time),
         parts: [
           {
             type: 'text',
             content: oldMessage.content
           }
         ]
       };
     }

     Deliverables:
     - ✅ MCP client updated to generate enhanced messages
     - ✅ Tool result → preview data mapping working
     - ✅ Existing functionality preserved
     - ✅ Backward compatibility for old messages

     ---
     Phase 6: Polish & Testing (Days 13-14)

     6.1 Styling Polish
     - Smooth transitions for panel resizing
     - Loading states with skeleton screens
     - Hover effects on interactive elements
     - Focus states for accessibility

     6.2 Responsive Design
     - Breakpoints for mobile/tablet/desktop
     - Mobile: Tabbed layout (Chat | Preview)
     - Tablet: Collapsible panels
     - Desktop: Full dual-panel

     6.3 Performance Optimization
     - Virtualize message list for 1000+ messages
     - Lazy load preview components
     - Debounce resize operations
     - Memoize computed values

     6.4 Accessibility
     - Keyboard navigation for panel resizing
     - ARIA labels on all interactive elements
     - Screen reader announcements for new messages
     - Focus management in modal states

     Deliverables:
     - ✅ Smooth animations and transitions
     - ✅ Responsive layout working on all devices
     - ✅ Performance benchmarks met (60fps resizing, <100ms message render)
     - ✅ WCAG 2.1 AA compliance

     ---
     Critical Files to Modify

     High Priority (Core Functionality)

     1. /Users/davidperez/workspaces/aerospace-control-vue/src/modules/ai-chat/AIChatModule.vue
       - Transform from single panel to dual-panel container
       - Add resizable layout logic
       - Integrate new components
     2. /Users/davidperez/workspaces/aerospace-control-vue/package.json
       - Add all new dependencies (Radix Vue, Tailwind, markdown libraries)
     3. /Users/davidperez/workspaces/aerospace-control-vue/src/services/mcp-client.js
       - Enhance response parsing for new message structure
       - Add preview data extraction methods

     Medium Priority (Styling & Tokens)

     4. /Users/davidperez/workspaces/aerospace-control-vue/src/assets/styles/main.css
       - Import design tokens
       - Add Tailwind directives
     5. /Users/davidperez/workspaces/aerospace-control-vue/tailwind.config.js (new)
       - Configure Tailwind with aerospace theme

     Low Priority (Integration Points)

     6. /Users/davidperez/workspaces/aerospace-control-vue/src/App.vue
       - Adjust AI panel positioning for larger dual-panel layout
       - Update responsive breakpoints
     7. /Users/davidperez/workspaces/aerospace-control-vue/vite.config.js
       - Ensure PostCSS processes Tailwind correctly

     ---
     Verification Strategy

     End-to-End Testing

     1. Visual Verification
       - Chat panel appears in dual-panel layout
       - Bot messages render on left with markdown support
       - Tool results trigger preview updates on right
       - Panel resizing works smoothly
     2. Functional Testing
       - Send message → Bot responds with tool invocation
       - Tool result displays in right panel with real flight data
       - Quick action buttons (Identify Bottlenecks, Suggest Reroute) work
       - MCP connection status displays correctly
     3. Data Integration
       - Flight data from OpenSky API appears in preview panel
       - Weather hazards visualized correctly
       - Route optimization shows comparison view
       - Real-time updates reflected in preview
     4. Responsive Testing
       - Desktop (>1200px): Full dual-panel
       - Tablet (768px-1200px): Collapsible panels
       - Mobile (<768px): Tabbed layout
     5. Performance Testing
       - Message list with 500 messages renders without lag
       - Panel resizing maintains 60fps
       - Preview updates in <50ms

     Manual Test Cases

     Test 1: Send "Show me flight AA 567"
     Expected:
     - Message appears in left panel
     - FlightDataPreview shows AA 567 details in right panel
     - Includes altitude, velocity, heading, route

     Test 2: Click "Identify Bottlenecks"
     Expected:
     - Bot responds with bottleneck analysis
     - List of affected flights
     - Preview panel shows first bottlenecked flight

     Test 3: Resize panel divider
     Expected:
     - Smooth dragging motion
     - Panels resize proportionally
     - Width persists after page refresh (localStorage)

     Test 4: Send long message with code block
     Expected:
     - Markdown renders with syntax highlighting
     - Code block has copy button
     - Scrollbar appears if content overflows

     ---
     Risk Mitigation

     Technical Risks
     ┌────────────────────────────────────────┬────────┬─────────────────────────────────────────────┐
     │                  Risk                  │ Impact │                 Mitigation                  │
     ├────────────────────────────────────────┼────────┼─────────────────────────────────────────────┤
     │ Tailwind conflicts with existing CSS   │ Medium │ Use tw- prefix, gradual migration           │
     ├────────────────────────────────────────┼────────┼─────────────────────────────────────────────┤
     │ Radix Vue browser compatibility        │ Low    │ Check caniuse.com, add polyfills if needed  │
     ├────────────────────────────────────────┼────────┼─────────────────────────────────────────────┤
     │ Performance with large message history │ Medium │ Implement virtual scrolling (10vh viewport) │
     ├────────────────────────────────────────┼────────┼─────────────────────────────────────────────┤
     │ Markdown XSS vulnerabilities           │ High   │ Use DOMPurify for sanitization              │
     └────────────────────────────────────────┴────────┴─────────────────────────────────────────────┘
     Integration Risks
     ┌───────────────────────────────────────────┬────────┬────────────────────────────────────────┐
     │                   Risk                    │ Impact │               Mitigation               │
     ├───────────────────────────────────────────┼────────┼────────────────────────────────────────┤
     │ Breaking existing MCP integration         │ High   │ Adapter layer, backward compatibility  │
     ├───────────────────────────────────────────┼────────┼────────────────────────────────────────┤
     │ Preview data extraction fails             │ Medium │ Fallback to text-only display          │
     ├───────────────────────────────────────────┼────────┼────────────────────────────────────────┤
     │ Panel positioning breaks with nav changes │ Low    │ Use CSS calc() for dynamic positioning │
     └───────────────────────────────────────────┴────────┴────────────────────────────────────────┘
     ---
     Success Criteria

     ✅ Functional
     - Dual-panel layout works on desktop, tablet, mobile
     - All existing chat functionality preserved
     - Real flight data displays in right panel
     - MCP integration seamless

     ✅ Visual
     - Matches UIGen's elegance and polish
     - Aerospace dark theme maintained
     - Smooth transitions and animations
     - Consistent design language

     ✅ Performance
     - <100ms message render time
     - 60fps panel resizing
     - <50ms preview updates
     - Handles 1000+ message history

     ✅ Accessibility
     - WCAG 2.1 AA compliant
     - Keyboard navigable
     - Screen reader compatible
     - Focus indicators visible

     ---
     Timeline Summary

     - Days 1-2: Foundation setup (dependencies, Tailwind, tokens)
     - Days 3-4: Dual-panel layout (ResizableHandle, panel structure)
     - Days 5-7: Enhanced message components (MessageItem, part components, markdown)
     - Days 8-10: Right panel previews (FlightData, Weather, Route previews)
     - Days 11-12: MCP integration updates (message parsing, preview triggers)
     - Days 13-14: Polish & testing (responsive, performance, accessibility)

     Total: 14 days / ~2-3 weeks

     ---
     Next Steps After Approval

     1. Create feature branch: git checkout -b feature/dual-panel-ai-chat
     2. Install dependencies
     3. Create file structure (folders and placeholder files)
     4. Begin Phase 1: Foundation Setup
     5. Commit incrementally after each phase
     6. Request code review before final merge

     ---
     Ready for implementation once approved!