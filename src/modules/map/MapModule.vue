<template>
  <div
    ref="mapContainer"
    class="map-container"
  ></div>
</template>

<script>
import L from 'leaflet';
import { airlines } from '@shared/data';
import { calculateBearing } from '@shared/utils/calculations';

export default {
  name: 'MapModule',
  props: {
    flights: {
      type: Array,
      required: true
    },
    weatherHazards: {
      type: Array,
      default: () => []
    }
  },
  emits: ['flight-click'],
  data() {
    return {
      map: null,
      flightMarkers: {},
      flightPaths: {},
      weatherCircles: [],
      resizeHandler: null
    };
  },
  watch: {
    flights: {
      handler() {
        this.updateFlightPositions();
      },
      deep: true
    }
  },
  mounted() {
    this.initializeMap();
    this.renderFlights();
    this.renderWeather();
  },
  beforeUnmount() {
    // Clean up event listeners
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initializeMap() {
      // Initialize Leaflet map
      this.map = L.map(this.$refs.mapContainer, {
        center: [40, -40],
        zoom: 3,
        zoomControl: false,
        attributionControl: true
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Add zoom control to top right
      L.control.zoom({ position: 'topright' }).addTo(this.map);

      // Fix zoom bug: invalidate map size on zoom events
      this.map.on('zoomstart', () => {
        this.map.invalidateSize();
      });

      this.map.on('zoomend', () => {
        this.map.invalidateSize();
      });

      // Also handle window resize
      this.resizeHandler = () => {
        if (this.map) {
          this.map.invalidateSize();
        }
      };
      window.addEventListener('resize', this.resizeHandler);
    },

    renderFlights() {
      this.flights.forEach((flight) => {
        // Create flight path
        const pathLine = L.polyline(flight.path, {
          color: airlines[flight.airline]?.color || '#4a9dd7',
          weight: 2,
          opacity: 0.6,
          dashArray: flight.bottleneck ? '10, 10' : null
        }).addTo(this.map);

        this.flightPaths[flight.name] = pathLine;

        // Create flight marker with popup
        const airline = airlines[flight.airline];
        const markerIcon = L.divIcon({
          className: 'plane-icon',
          html: `<div class="plane-marker ${flight.bottleneck ? 'bottleneck' : ''}"
                      style="background: ${airline?.color || '#4a9dd7'}">
                   ✈️
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const popupContent = `
          <div class="flight-popup">
            <div class="popup-header" style="background: ${airline?.color || '#4a9dd7'}">
              <span class="popup-logo">${airline?.logo}</span>
              <span class="popup-flight-number">${flight.name}</span>
            </div>
            <div class="popup-content">
              <div class="popup-route">
                <span class="popup-airport">${flight.from}</span>
                <span class="popup-arrow">→</span>
                <span class="popup-airport">${flight.to}</span>
              </div>
              <div class="popup-details">
                <div class="popup-detail">
                  <span class="popup-label">Status:</span>
                  <span class="popup-value status-${flight.statusClass}">${flight.status}</span>
                </div>
                <div class="popup-detail">
                  <span class="popup-label">Aircraft:</span>
                  <span class="popup-value">${flight.aircraft}</span>
                </div>
                <div class="popup-detail">
                  <span class="popup-label">Altitude:</span>
                  <span class="popup-value">${flight.altitude}</span>
                </div>
                <div class="popup-detail">
                  <span class="popup-label">Passengers:</span>
                  <span class="popup-value">${flight.passengers}</span>
                </div>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker(flight.path[0], { icon: markerIcon })
          .addTo(this.map)
          .bindPopup(popupContent, {
            className: 'flight-popup-container',
            maxWidth: 300,
            closeButton: true
          })
          .on('click', () => this.$emit('flight-click', flight));

        this.flightMarkers[flight.name] = marker;
      });
    },

    updateFlightPositions() {
      this.flights.forEach((flight) => {
        const marker = this.flightMarkers[flight.name];
        if (!marker) return;

        // Calculate current position
        const lat = flight.path[0][0] + (flight.path[1][0] - flight.path[0][0]) * flight.progress;
        const lng = flight.path[0][1] + (flight.path[1][1] - flight.path[0][1]) * flight.progress;

        // Calculate bearing
        const nextProgress = Math.min(flight.progress + 0.01, 1.0);
        const nextLat = flight.path[0][0] + (flight.path[1][0] - flight.path[0][0]) * nextProgress;
        const nextLng = flight.path[0][1] + (flight.path[1][1] - flight.path[0][1]) * nextProgress;
        const bearing = calculateBearing(lat, lng, nextLat, nextLng);

        // Update marker position and rotation
        marker.setLatLng([lat, lng]);
        const iconElement = marker.getElement();
        if (iconElement) {
          const planeMarker = iconElement.querySelector('.plane-marker');
          if (planeMarker) {
            planeMarker.style.transform = `rotate(${bearing}deg)`;
          }
        }
      });
    },

    renderWeather() {
      this.weatherHazards.forEach((hazard) => {
        const circle = L.circle(hazard.center, {
          color: hazard.severity === 'high' ? '#ef4444' : '#f59e0b',
          fillColor: hazard.severity === 'high' ? '#dc2626' : '#d97706',
          fillOpacity: 0.2,
          radius: hazard.radius * 1000,
          weight: 2
        }).addTo(this.map);

        this.weatherCircles.push(circle);
      });
    }
  }
};
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

:deep(.plane-marker) {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

:deep(.plane-marker.bottleneck) {
  background: #ef4444 !important;
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

/* Flight Popup Styles */
:deep(.flight-popup-container .leaflet-popup-content-wrapper) {
  padding: 0;
  border-radius: 12px;
  background: #1a1a1a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

:deep(.flight-popup-container .leaflet-popup-content) {
  margin: 0;
  width: 100% !important;
}

:deep(.flight-popup) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #fff;
  min-width: 280px;
}

:deep(.popup-header) {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px 12px 0 0;
  font-weight: 700;
  font-size: 16px;
}

:deep(.popup-logo) {
  font-size: 24px;
}

:deep(.popup-flight-number) {
  color: #fff;
  font-weight: 700;
}

:deep(.popup-content) {
  padding: 16px;
}

:deep(.popup-route) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #3a3a3a;
}

:deep(.popup-airport) {
  font-size: 18px;
  font-weight: 700;
  color: #4a9dd7;
}

:deep(.popup-arrow) {
  font-size: 20px;
  color: #666;
}

:deep(.popup-details) {
  display: grid;
  gap: 12px;
}

:deep(.popup-detail) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.popup-label) {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.popup-value) {
  font-size: 14px;
  color: #e0e0e0;
  font-weight: 600;
}

:deep(.popup-value.status-on-time) {
  color: #4ade80;
}

:deep(.popup-value.status-delayed) {
  color: #f59e0b;
}

:deep(.popup-value.status-boarding) {
  color: #3b82f6;
}

:deep(.flight-popup-container .leaflet-popup-tip) {
  background: #1a1a1a;
}
</style>
