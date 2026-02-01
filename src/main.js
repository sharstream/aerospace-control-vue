import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Import Radix Colors for professional UI
import '@radix-ui/colors/blue.css';
import '@radix-ui/colors/blue-dark.css';
import '@radix-ui/colors/sky.css';
import '@radix-ui/colors/sky-dark.css';
import '@radix-ui/colors/cyan.css';
import '@radix-ui/colors/cyan-dark.css';
import '@radix-ui/colors/green.css';
import '@radix-ui/colors/green-dark.css';
import '@radix-ui/colors/amber.css';
import '@radix-ui/colors/amber-dark.css';
import '@radix-ui/colors/red.css';
import '@radix-ui/colors/red-dark.css';

// Import global configuration constants
import { GEORGIA_BBOX, ATLANTA_CENTER, BBOX_AREA } from './config/constants';

// Import centralized labels (following ma-unified pattern)
import { Labels, replacePlaceholders, pluralize } from './config/labels';

// Make configuration available globally
window.SKYSENT_CONFIG = {
    GEORGIA_BBOX,
    ATLANTA_CENTER,
    BBOX_AREA
};

// Create app instance
const app = createApp(App);

// Provide configuration to all components
app.provide('GEORGIA_BBOX', GEORGIA_BBOX);
app.provide('ATLANTA_CENTER', ATLANTA_CENTER);
app.provide('BBOX_AREA', BBOX_AREA);

// Inject labels globally (following ma-unified pattern: MAPS.app.config.globalProperties.$Labels)
// Now accessible in all components via this.$Labels
app.config.globalProperties.$Labels = Labels;
app.config.globalProperties.$replacePlaceholders = replacePlaceholders;
app.config.globalProperties.$pluralize = pluralize;

// Create and use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Mount app
app.mount('#app');
