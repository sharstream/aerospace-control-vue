# Label Centralization Guide

## Overview

All UI labels have been centralized in `/src/config/labels.js` following the pattern from the ma-unified project (`ext/MapsV2/desktop/main.js`). Labels are now accessible throughout the application via `this.$Labels`.

## Pattern from ma-unified

In ma-unified, labels are injected globally like this:

```javascript
// ext/MapsV2/desktop/main.js (line 93)
MAPS.app.config.globalProperties.$Labels = MASystem.Labels;
```

We've implemented the same pattern:

```javascript
// src/main.js
import { Labels, replacePlaceholders, pluralize } from './config/labels';
app.config.globalProperties.$Labels = Labels;
app.config.globalProperties.$replacePlaceholders = replacePlaceholders;
app.config.globalProperties.$pluralize = pluralize;
```

## How to Use $Labels

### Options API (Standard Template)

In component templates:

```vue
<template>
  <div>
    <!-- Static label -->
    <h2>{{ $Labels.aiAssistant.title }}</h2>

    <!-- Dynamic label with placeholder -->
    <span>{{ $replacePlaceholders($Labels.commanderAtlas.mcpStatus.online, { count: toolCount }) }}</span>

    <!-- Computed label -->
    <p>{{ providerLabel }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toolCount: 5,
      provider: 'OpenAI'
    };
  },
  computed: {
    providerLabel() {
      // Replace placeholder in label
      return this.$replacePlaceholders(this.$Labels.aiAssistant.apiKey.label, {
        provider: this.provider
      });
    }
  }
};
</script>
```

### Composition API

```vue
<script setup>
import { getCurrentInstance, computed } from 'vue';

// Get the global properties
const { $Labels, $replacePlaceholders } = getCurrentInstance().appContext.config.globalProperties;

const toolCount = ref(5);

const statusLabel = computed(() => {
  return $replacePlaceholders($Labels.commanderAtlas.mcpStatus.online, {
    count: toolCount.value
  });
});
</script>

<template>
  <div>
    <h2>{{ $Labels.aiAssistant.title }}</h2>
    <span>{{ statusLabel }}</span>
  </div>
</template>
```

### In JavaScript Methods

```javascript
export default {
  methods: {
    showSuccessMessage() {
      // Access labels in methods
      const message = this.$replacePlaceholders(
        this.$Labels.aiAssistant.testResults.successPrefix,
        { provider: this.activeProvider }
      );
      alert(message);
    },

    displayToolCount() {
      // Use pluralize helper
      const label = this.$pluralize(this.toolCount, 'tool');
      console.log(label); // "1 tool" or "5 tools"
    }
  }
};
```

## Example Component Updates

### Before: AIAssistantSettings.vue

```vue
<template>
  <h2 class="card-title">AI Assistant</h2>
  <span class="toggle-text">{{ sessionEnabled ? 'Enabled' : 'Disabled' }}</span>
  <p class="section-description">Integrate with ChatGPT, Claude, and Gemini for intelligent aerospace monitoring</p>
  <span class="provider-name">{{ provider.name }}</span>
</template>

<script>
export default {
  data() {
    return {
      providers: [
        { id: 'openai', name: 'OpenAI', icon: '🤖' },
        { id: 'anthropic', name: 'Anthropic Claude', icon: '🧠' },
        { id: 'google', name: 'Google Gemini', icon: '✨' }
      ]
    };
  }
};
</script>
```

### After: AIAssistantSettings.vue

```vue
<template>
  <h2 class="card-title">{{ $Labels.aiAssistant.title }}</h2>
  <span class="toggle-text">{{ sessionEnabled ? $Labels.aiAssistant.enabled : $Labels.aiAssistant.disabled }}</span>
  <p class="section-description">{{ $Labels.aiAssistant.description }}</p>
  <span class="provider-name">{{ $Labels.aiAssistant.providers[provider.id] }}</span>
</template>

<script>
export default {
  data() {
    return {
      providers: [
        { id: 'openai', icon: '🤖' },
        { id: 'anthropic', icon: '🧠' },
        { id: 'google', icon: '✨' }
      ]
    };
  }
};
</script>
```

### Before: Commander Atlas

```vue
<template>
  <h2>Commander Atlas</h2>
  <p>Aviation Systems Expert | Airfare Engineer | AI Co-Pilot</p>
  <p class="mcp-status">MCP: Online ({{ injectedTools.length }} tools active)</p>
  <button>Identify Bottlenecks</button>
  <input placeholder="Ask about flight status, route optimization, or system monitoring..." />
</template>
```

### After: Commander Atlas

```vue
<template>
  <h2>{{ $Labels.commanderAtlas.title }}</h2>
  <p>{{ $Labels.commanderAtlas.subtitle }}</p>
  <p class="mcp-status">{{ mcpStatusText }}</p>
  <button>{{ $Labels.commanderAtlas.actions.identifyBottlenecks }}</button>
  <input :placeholder="$Labels.commanderAtlas.input.placeholder" />
</template>

<script>
export default {
  computed: {
    mcpStatusText() {
      if (!this.mcpConnected) {
        return this.$Labels.commanderAtlas.mcpStatus.offline;
      }
      return this.$replacePlaceholders(
        this.$Labels.commanderAtlas.mcpStatus.online,
        { count: this.injectedTools.length }
      );
    }
  }
};
</script>
```

## Helper Functions

### replacePlaceholders(label, replacements)

Replaces `{placeholder}` tokens in label strings:

```javascript
// Example 1: Simple replacement
this.$replacePlaceholders('MCP: Online ({count} tools active)', { count: 5 });
// Returns: 'MCP: Online (5 tools active)'

// Example 2: Multiple placeholders
this.$replacePlaceholders(
  'Successfully connected to {provider}',
  { provider: 'OpenAI' }
);
// Returns: 'Successfully connected to OpenAI'

// Example 3: Complex replacement
this.$replacePlaceholders(
  'Failed to create AI session: {error}',
  { error: error.message }
);
// Returns: 'Failed to create AI session: Network timeout'
```

### pluralize(count, singular, plural)

Handles pluralization:

```javascript
// Example 1: Default plural (adds 's')
this.$pluralize(1, 'tool');  // Returns: '1 tool'
this.$pluralize(5, 'tool');  // Returns: '5 tools'

// Example 2: Custom plural
this.$pluralize(1, 'aircraft', 'aircraft');  // Returns: '1 aircraft'
this.$pluralize(5, 'aircraft', 'aircraft');  // Returns: '5 aircraft'

// Example 3: Irregular plural
this.$pluralize(1, 'child', 'children');  // Returns: '1 child'
this.$pluralize(5, 'child', 'children');  // Returns: '5 children'
```

## Label Structure

Labels are organized by module in `/src/config/labels.js`:

```
Labels
├── aiAssistant
│   ├── title
│   ├── enabled / disabled
│   ├── description
│   ├── providers { openai, anthropic, google }
│   ├── apiKey { label, placeholder, description }
│   ├── buttons { saveConfiguration, testConnection, testing }
│   ├── testResults { successPrefix, failurePrefix }
│   ├── session { sessionIdLabel, mcpStatusLabel, ... }
│   ├── features { intro, flightAnalysis, systemDiagnosis, ... }
│   └── validation { apiKeyRequired, sessionCreationFailed, ... }
├── commanderAtlas
│   ├── title
│   ├── subtitle
│   ├── mcpStatus { online, onlineWithTotal, offline, ... }
│   ├── actions { identifyBottlenecks, suggestReroute }
│   ├── input { placeholder }
│   ├── messages { bottleneckAnalysis, routeOptimization, ... }
│   ├── responses { noBottlenecks, bottlenecksDetected, ... }
│   └── skillHelp { intro, fuel, pressure, trajectory, ... }
├── dataSource
│   ├── title
│   ├── description
│   ├── backendStatus { label, operational, rateLimited, ... }
│   └── realTimeData { label, description, autoRefresh }
├── rateLimit
│   ├── title
│   ├── credits { label, healthy, approaching, low, critical }
│   ├── countdown { title, label, description }
│   └── noData
├── settings
│   ├── title
│   ├── subtitle
│   └── usageMetrics { title, description, metrics, timeSpent, export, confirmClear }
└── common
    ├── actions { save, cancel, close, delete, ... }
    ├── status { success, error, warning, ... }
    └── time { seconds, minutes, hours, ... }
```

## Benefits

1. **Centralized Management**: All labels in one place
2. **Easy Localization**: Ready for i18n implementation
3. **Consistency**: Ensures consistent terminology across the app
4. **Type Safety**: Can add TypeScript types for label paths
5. **Dynamic Injection**: Labels can be updated at runtime
6. **Testability**: Easy to mock labels in tests

## Migration Checklist

For each component:

1. ✅ Identify all hardcoded strings in template and script
2. ✅ Check if label exists in `src/config/labels.js`
   - If yes: Use existing label
   - If no: Add new label to appropriate section
3. ✅ Replace hardcoded strings with `$Labels` references
4. ✅ Use `$replacePlaceholders()` for dynamic values
5. ✅ Use `$pluralize()` for count-dependent labels
6. ✅ Test component to ensure labels display correctly

## Components to Update

Based on the codebase analysis:

- ✅ `src/main.js` - Labels injected globally
- ⏳ `src/modules/settings/components/AIAssistantSettings.vue`
- ⏳ `src/modules/ai-chat/AIChatModule.vue`
- ⏳ `src/components/settings/DataSourceConfiguration.vue`
- ⏳ `src/components/settings/RateLimitStatusCard.vue`
- ⏳ `src/components/settings/BackendStatusCard.vue`
- ⏳ `src/components/settings/DataSourceToggle.vue`
- ⏳ `src/modules/settings/SettingsModule.vue`

## Future Enhancements

### 1. Add TypeScript Support

```typescript
// src/config/labels.d.ts
export interface Labels {
  aiAssistant: {
    title: string;
    enabled: string;
    // ... more types
  };
  // ... more interfaces
}
```

### 2. Add i18n Support

```javascript
// Future: src/config/labels-en.js, labels-es.js, labels-fr.js
import { Labels as LabelsEN } from './labels-en';
import { Labels as LabelsES } from './labels-es';

const currentLocale = localStorage.getItem('locale') || 'en';
export const Labels = currentLocale === 'es' ? LabelsES : LabelsEN;
```

### 3. Runtime Label Updates

```javascript
// Can update labels at runtime for A/B testing or feature flags
this.$Labels.commanderAtlas.title = 'Flight Commander';
```

## Questions?

For questions or issues with label centralization:
1. Check this guide first
2. Review the ma-unified pattern: `ext/MapsV2/desktop/main.js:93`
3. Examine the labels structure in `src/config/labels.js`
4. Look at example component updates above
