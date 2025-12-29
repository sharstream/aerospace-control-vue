import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Import global configuration constants
import { GEORGIA_BBOX, ATLANTA_CENTER, BBOX_AREA } from './config/constants';

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

// Create and use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Mount app
app.mount('#app');
