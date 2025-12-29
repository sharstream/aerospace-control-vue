<template>
  <div class="map-module">
    <div
      ref="mapContainer"
      class="map-container"
    ></div>
  </div>
</template>

<script>
import {
  Map,
  TileLayer,
  Marker,
  Circle,
  DivIcon,
  Control
} from 'leaflet';
import { airlines } from '@shared/data';
import { calculateBearing } from '@shared/utils/calculations';
import { getAircraftImage, getAircraftFamily } from '@shared/utils/aircraft-images';
import { GEORGIA_BBOX, ATLANTA_CENTER } from '@/config/constants';
import { TrajectoryRenderer } from './TrajectoryRenderer';
import { TrajectoryTracker } from '@/services/aircraft-tracker';

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
    },
    selectedFlight: {
      type: Object,
      default: null
    }
  },
  emits: ['flight-click', 'tracking-started', 'tracking-stopped'],
  data() {
    return {
      map: null,
      flightMarkers: {},
      flightPaths: {},
      weatherCircles: [],
      resizeHandler: null,
      trajectoryRenderer: null,
      aircraftTracker: null,
      trackedAircraft: new Set()
    };
  },
  watch: {
    flights: {
      handler(newFlights, oldFlights) {
        // Determine if this is a structural change (add/remove) or just position updates
        const isStructuralChange = !oldFlights
          || newFlights.length !== oldFlights.length
          || this.hasAircraftListChanged(newFlights, oldFlights);

        if (isStructuralChange) {
          // Full sync for add/remove operations
          this.$nextTick(() => {
            if (this.map && newFlights) {
              this.syncFlights(newFlights);
            }
          });
        } else {
          // Just update positions (lightweight)
          this.updateAllPositions(newFlights);
        }
      },
      deep: false
    }
  },
  mounted() {
    this.initializeMap();
    this.syncFlights(this.flights); // Initial render using sync
    this.renderWeather();
  },
  beforeUnmount() {
    // Clean up tracking
    if (this.aircraftTracker) {
      this.aircraftTracker.stopAllTracking();
    }

    // Clean up trajectory renderer
    if (this.trajectoryRenderer) {
      this.trajectoryRenderer.destroy();
    }

    // Clean up event listeners
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    // Clean up map
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initializeMap() {
      // Initialize Leaflet map centered on Atlanta Airport (from global config)
      this.map = new Map(this.$refs.mapContainer, {
        center: ATLANTA_CENTER,
        zoom: 7,
        zoomControl: false,
        attributionControl: true
      });

      // Add OpenStreetMap tiles
      new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Fit map to Georgia state bounding box (24.9 sq deg - same as backend)
      this.map.fitBounds([GEORGIA_BBOX.southWest, GEORGIA_BBOX.northEast], {
        padding: [20, 20] // Add 20px padding on all sides
      });

      // Add zoom control to top right
      new Control.Zoom({ position: 'topright' }).addTo(this.map);

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

      // Initialize trajectory renderer
      this.trajectoryRenderer = new TrajectoryRenderer(this.map, {
        weight: 3,
        opacity: 0.7,
        useCanvas: true
      });

      // Initialize aircraft tracker with trajectory update callback
      this.aircraftTracker = new TrajectoryTracker({
        pollInterval: 45000, // 45 seconds
        maxPoints: 1000,
        onUpdate: this.handleTrajectoryUpdate
      });
    },

    /**
     * Handle trajectory updates from aircraft tracker
     * @param {string} icao24 - Aircraft ICAO24 address
     * @param {Object} _waypoint - New waypoint data (unused)
     * @param {Array} trajectory - Full trajectory array
     */
    handleTrajectoryUpdate(icao24, _waypoint, trajectory) {
      // Render/update trajectory on map (OpenSky-style solid red line)
      this.trajectoryRenderer.renderTrajectory(icao24, trajectory);
    },

    /**
     * Start tracking selected aircraft
     * @param {Object} flight - Flight object with icao24
     */
    async startTrackingAircraft(flight) {
      if (!flight.icao24) {
        return;
      }

      if (this.trackedAircraft.has(flight.icao24)) {
        return;
      }

      try {
        await this.aircraftTracker.startTracking(flight.icao24);
        this.trackedAircraft.add(flight.icao24);

        // Highlight the trajectory
        this.trajectoryRenderer.highlightTrajectory(flight.icao24, true);

        this.$emit('tracking-started', flight);

        // Force Vue to detect the Set change
        this.$forceUpdate();
      } catch (error) {
        console.error(`MapModule: Failed to start tracking ${flight.icao24}:`, error);
      }
    },

    /**
     * Stop tracking aircraft
     * @param {string} icao24 - Aircraft ICAO24 address
     */
    stopTrackingAircraft(icao24) {
      if (!this.trackedAircraft.has(icao24)) {
        return;
      }

      this.aircraftTracker.stopTracking(icao24);
      this.trajectoryRenderer.removeTrajectory(icao24);
      this.trackedAircraft.delete(icao24);

      this.$emit('tracking-stopped', icao24);

      // Force Vue to detect the Set change
      this.$forceUpdate();
    },

    /**
     * Clear all tracked aircraft and trajectories
     */
    clearAllTracking() {
      this.aircraftTracker.stopAllTracking();
      this.trajectoryRenderer.clearAllTrajectories();
      this.trackedAircraft.clear();
    },

    /**
     * Check if the aircraft list has structurally changed (not just position updates)
     * @param {Array} newFlights - New flights array
     * @param {Array} oldFlights - Old flights array
     * @returns {boolean} True if aircraft were added/removed
     */
    hasAircraftListChanged(newFlights, oldFlights) {
      if (!newFlights || !oldFlights) return true;

      const newIcao24s = new Set(newFlights.map(f => f.icao24).filter(Boolean));
      const oldIcao24s = new Set(oldFlights.map(f => f.icao24).filter(Boolean));

      // Check if sets are equal
      if (newIcao24s.size !== oldIcao24s.size) return true;

      for (const icao of newIcao24s) {
        if (!oldIcao24s.has(icao)) return true;
      }

      return false;
    },

    /**
     * Update all aircraft positions (lightweight, no marker creation/removal)
     * @param {Array} flights - Current flights array
     */
    updateAllPositions(flights) {
      if (!this.map) return;

      flights.forEach((flight) => {
        if (!flight.icao24) return;
        this.updateAircraftMarker(flight);
      });
    },

    /**
     * Sync flight markers with current flights array
     * Adds new aircraft, updates existing, removes stale
     * @param {Array} flights - Current flights array
     */
    syncFlights(flights) {
      if (!this.map) {
        return; // Map not initialized yet
      }

      // Create Set of current icao24s for fast lookup
      const currentIcao24s = new Set(flights.map(f => f.icao24).filter(Boolean));

      // Remove stale markers (aircraft no longer in flights array)
      Object.keys(this.flightMarkers).forEach((icao24) => {
        if (!currentIcao24s.has(icao24)) {
          this.removeAircraftMarker(icao24);
        }
      });

      // Add or update markers for each flight
      flights.forEach((flight) => {
        if (!flight.icao24) {
          console.warn('Flight missing icao24:', flight);
          return;
        }

        const existingMarker = this.flightMarkers[flight.icao24];

        if (existingMarker) {
          // Update existing marker position
          this.updateAircraftMarker(flight);
        } else {
          // Create new marker
          this.createAircraftMarker(flight);
        }
      });
    },

    /**
     * Create a new aircraft marker and path
     * @param {Object} flight - Flight object
     */
    createAircraftMarker(flight) {
      if (!flight.icao24) return;

      // Flight paths removed - only showing aircraft markers

      // Create flight marker with popup using SVG aircraft icon
      const airline = airlines[flight.airline];
      const isTracked = this.trajectoryRenderer.hasTrajectory(flight.icao24);
      const markerIcon = new DivIcon({
        className: `aircraft-marker-container${isTracked ? ' tracked' : ''}`,
        html: this.createAircraftIcon(airline?.color || '#4a9dd7', flight.bottleneck),
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Enhanced popup with OpenSky-style spatial data and aircraft image
      const aircraftType = flight.aircraft || 'Unknown';
      const aircraftImage = getAircraftImage(aircraftType);
      const aircraftFamily = getAircraftFamily(aircraftType);

      const popupContent = `
        <div class="flight-popup enhanced">
          <div class="popup-header" style="background: ${airline?.color || '#4a9dd7'}">
            <span class="popup-logo">${airline?.logo}</span>
            <div class="popup-header-info">
              <span class="popup-flight-number">${flight.name}</span>
              <span class="popup-icao24">${flight.icao24 || 'N/A'}</span>
            </div>
          </div>

          <!-- Aircraft Image -->
          <div class="popup-aircraft-image">
            <img src="${aircraftImage}" alt="${aircraftFamily}" />
            <div class="aircraft-type-label">${aircraftFamily}</div>
          </div>

          <div class="popup-content">
            <div class="popup-route">
              <span class="popup-airport">${flight.from}</span>
              <span class="popup-arrow">→</span>
              <span class="popup-airport">${flight.to}</span>
            </div>

            <!-- SPATIAL Section -->
            <div class="popup-section">
              <div class="section-header">SPATIAL</div>
              <div class="section-grid">
                <div class="data-row">
                  <span class="label">Groundspeed:</span>
                  <span class="value">${flight.velocity || 'N/A'}</span>
                </div>
                <div class="data-row">
                  <span class="label">Altitude:</span>
                  <span class="value">${flight.altitude || 'N/A'}</span>
                </div>
                <div class="data-row">
                  <span class="label">Vert. Rate:</span>
                  <span class="value">${flight.vertical_rate || 'N/A'}</span>
                </div>
                <div class="data-row">
                  <span class="label">Track:</span>
                  <span class="value">${flight.heading || 'N/A'}</span>
                </div>
              </div>
            </div>

            <!-- SIGNAL Section -->
            <div class="popup-section">
              <div class="section-header">SIGNAL</div>
              <div class="section-grid">
                <div class="data-row">
                  <span class="label">Source:</span>
                  <span class="value">ADS-B</span>
                </div>
                <div class="data-row">
                  <span class="label">Category:</span>
                  <span class="value">${flight.category || 'N/A'}</span>
                </div>
              </div>
            </div>

            <!-- STATUS Section -->
            <div class="popup-section">
              <div class="section-header">STATUS</div>
              <div class="section-grid">
                <div class="data-row">
                  <span class="label">Flight:</span>
                  <span class="value status-${flight.statusClass}">${flight.status}</span>
                </div>
                <div class="data-row">
                  <span class="label">Aircraft:</span>
                  <span class="value">${flight.aircraft || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      const marker = new Marker(flight.path[0], { icon: markerIcon })
        .addTo(this.map)
        .bindPopup(popupContent, {
          className: 'flight-popup-container',
          maxWidth: 350,
          minWidth: 320,
          closeButton: true
        })
        .on('click', () => {
          // Start tracking this aircraft (shows red trajectory line)
          this.startTrackingAircraft(flight);
          // Popup opens automatically - no navigation to dashboard
        });

      this.flightMarkers[flight.icao24] = marker;
    },

    /**
     * Update existing aircraft marker position
     * @param {Object} flight - Flight object
     */
    updateAircraftMarker(flight) {
      if (!flight?.icao24 || !flight?.path || flight.path.length < 2) return;

      const marker = this.flightMarkers[flight.icao24];
      if (!marker) return; // Marker doesn't exist yet, skip

      try {
        // Calculate current position
        const lat = flight.path[0][0] + (flight.path[1][0] - flight.path[0][0]) * (flight.progress || 0);
        const lng = flight.path[0][1] + (flight.path[1][1] - flight.path[0][1]) * (flight.progress || 0);

        // Calculate bearing
        const nextProgress = Math.min((flight.progress || 0) + 0.01, 1.0);
        const nextLat = flight.path[0][0] + (flight.path[1][0] - flight.path[0][0]) * nextProgress;
        const nextLng = flight.path[0][1] + (flight.path[1][1] - flight.path[0][1]) * nextProgress;
        const bearing = calculateBearing(lat, lng, nextLat, nextLng);

        // Update marker position and rotation
        marker.setLatLng([lat, lng]);
        const iconElement = marker.getElement();
        if (iconElement) {
          const aircraftIcon = iconElement.querySelector('.aircraft-icon svg');
          if (aircraftIcon) {
            aircraftIcon.style.transform = `rotate(${bearing}deg)`;
          }
        }
      } catch (error) {
        // Silently catch errors during position updates to prevent crashes
        console.warn(`Failed to update marker for ${flight.icao24}:`, error);
      }
    },

    /**
     * Remove aircraft marker
     * @param {string} icao24 - Aircraft ICAO24 address
     */
    removeAircraftMarker(icao24) {
      const marker = this.flightMarkers[icao24];

      if (marker) {
        marker.remove();
        delete this.flightMarkers[icao24];
      }
    },

    renderWeather() {
      this.weatherHazards.forEach((hazard) => {
        const circle = new Circle(hazard.center, {
          color: hazard.severity === 'high' ? '#ef4444' : '#f59e0b',
          fillColor: hazard.severity === 'high' ? '#dc2626' : '#d97706',
          fillOpacity: 0.2,
          radius: hazard.radius * 1000,
          weight: 2
        }).addTo(this.map);

        this.weatherCircles.push(circle);
      });
    },

    /**
     * Pan map to aircraft location and zoom in
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} zoom - Zoom level (default 11)
     */
    panToAircraft(lat, lng, zoom = 11) {
      if (this.map) {
        this.map.setView([lat, lng], zoom, {
          animate: true,
          duration: 1.0
        });
      }
    },

    /**
     * Create SVG aircraft icon with airline colors
     * @param {string} color - Aircraft color (airline color)
     * @param {boolean} isBottleneck - Whether aircraft has bottleneck
     * @returns {string} SVG HTML string
     */
    createAircraftIcon(color, isBottleneck = false) {
      const pulseClass = isBottleneck ? 'bottleneck' : '';
      return `
        <div class="aircraft-icon ${pulseClass}">
          <svg viewBox="0 0 48 48" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">
            <!-- Airplane body -->
            <path fill="${color}" stroke="#000" stroke-width="1" d="M24 4 L28 20 L40 22 L40 26 L28 24 L26 38 L30 40 L30 42 L24 40 L18 42 L18 40 L22 38 L20 24 L8 26 L8 22 L20 20 Z"/>
            <!-- Cockpit window -->
            <circle cx="24" cy="12" r="2" fill="rgba(255,255,255,0.4)" stroke="#000" stroke-width="0.5"/>
            <!-- Wing details -->
            <line x1="20" y1="20" x2="28" y2="20" stroke="#000" stroke-width="0.5" opacity="0.3"/>
            <!-- Tail stabilizer -->
            <path fill="${color}" stroke="#000" stroke-width="0.5" d="M22 38 L24 42 L26 38 Z" opacity="0.8"/>
          </svg>
        </div>
      `;
    }
  }
};
</script>

<style scoped>
.map-module {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Aircraft SVG Icon Styles */
:deep(.aircraft-icon) {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

:deep(.aircraft-icon.bottleneck) {
  animation: pulse-red 2s infinite;
}

:deep(.aircraft-marker-container) {
  background: transparent !important;
  border: none !important;
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

:deep(.popup-header-info) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

:deep(.popup-flight-number) {
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}

:deep(.popup-icao24) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Aircraft Image Section */
:deep(.popup-aircraft-image) {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
  background: #0a0a0a;
}

:deep(.popup-aircraft-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

:deep(.aircraft-type-label) {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
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

/* Enhanced Popup Sections */
:deep(.popup-section) {
  margin-top: 16px;
  border-top: 1px solid #2a2a2a;
  padding-top: 12px;
}

:deep(.section-header) {
  font-size: 10px;
  font-weight: 700;
  color: #4a9dd7;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

:deep(.section-grid) {
  display: grid;
  gap: 8px;
}

:deep(.data-row) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

:deep(.data-row .label) {
  color: #888;
  font-weight: 600;
}

:deep(.data-row .value) {
  color: #e0e0e0;
  font-weight: 600;
  text-align: right;
}

/* Trajectory Path Styles - OpenSky-style solid red line */
:deep(.trajectory-path) {
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.trajectory-path:hover) {
  filter: brightness(1.2);
}

/* Tracked Aircraft Circular Highlight (OpenSky-style) */
:deep(.aircraft-marker-container.tracked) {
  position: relative;
}

:deep(.aircraft-marker-container.tracked::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 69, 87, 0.3) 0%, rgba(200, 69, 87, 0.1) 50%, transparent 70%);
  border: 2px solid rgba(200, 69, 87, 0.6);
  animation: pulse-tracked 2s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes pulse-tracked {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.5;
  }
}

/* Trajectory Tooltip Styles */
:deep(.trajectory-tooltip) {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid #4a9dd7;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:deep(.trajectory-tooltip::before) {
  border-top-color: #4a9dd7;
}
</style>
