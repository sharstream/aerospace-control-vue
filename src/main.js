import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Create app instance
const app = createApp(App)

// Create and use Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Mount app
app.mount('#app')
