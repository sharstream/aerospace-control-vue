<template>
  <div class="weather-view active">
    <!-- Weather Header -->
    <div class="weather-header">
      <div class="weather-title-section">
        <div class="weather-title">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
          </svg>
          Meteorological Operations Center
        </div>
        <div class="weather-sync-indicator">
          <div class="weather-sync-dot"></div>
          Live Weather Data
        </div>
      </div>
    </div>

    <!-- Active Weather Alerts -->
    <div class="weather-alerts-grid">
      <div
        v-for="(alert, index) in weatherAlerts"
        :key="index"
        class="weather-alert-card"
        :class="alert.type"
      >
        <div class="alert-header">
          <div class="alert-type">
            <div
              class="alert-icon"
              :class="alert.type"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  v-if="alert.type === 'severe'"
                  d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                />
                <path
                  v-else-if="alert.type === 'warning'"
                  d="M12 2l-5.5 9h11z M11 10h2v4h-2z M11 15h2v2h-2z"
                />
                <path
                  v-else
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
            </div>
          </div>
          <div
            class="alert-badge"
            :class="alert.type"
          >
            {{ alert.type.toUpperCase() }}
          </div>
        </div>
        <div class="alert-title">{{ alert.title }}</div>
        <div class="alert-description">{{ alert.description }}</div>
        <div class="alert-details">
          <div class="alert-detail-item">
            <div class="alert-detail-label">Location</div>
            <div class="alert-detail-value">{{ alert.location }}</div>
          </div>
          <div class="alert-detail-item">
            <div class="alert-detail-label">Valid Until</div>
            <div class="alert-detail-value">{{ alert.validUntil }}</div>
          </div>
          <div class="alert-detail-item">
            <div class="alert-detail-label">Wind Speed</div>
            <div class="alert-detail-value">{{ alert.windSpeed }}</div>
          </div>
          <div class="alert-detail-item">
            <div class="alert-detail-label">Visibility</div>
            <div class="alert-detail-value">{{ alert.visibility }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Affected Flights Section -->
    <div class="affected-flights-section">
      <div class="affected-flights-header">
        <div class="affected-flights-title">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
          </svg>
          Weather-Affected Flights
        </div>
        <div class="affected-count">{{ affectedFlightsList.length }} IMPACTED</div>
      </div>
      <div class="affected-flights-list">
        <div
          v-for="item in affectedFlightsList"
          :key="item.flight.name"
          class="affected-flight-item"
        >
          <div class="affected-flight-info">
            <div
              class="flight-weather-icon"
              :style="{ background: item.airline.color, color: 'white' }"
            >
              {{ item.airline.logo }}
            </div>
            <div class="affected-flight-details">
              <div class="affected-flight-number">{{ item.flight.name }} • {{ item.airline.name }}</div>
              <div class="affected-flight-route">{{ item.flight.from }} → {{ item.flight.to }} • {{ item.flight.departure }}</div>
            </div>
          </div>
          <div class="weather-impact">
            <div
              class="impact-badge"
              :class="item.impact"
            >
              {{ item.impact }} IMPACT
            </div>
            <div class="delay-estimate">+{{ item.delay }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Airport Weather Forecasts -->
    <div class="weather-forecast-section">
      <div
        v-for="forecast in airportForecasts"
        :key="forecast.code"
        class="forecast-card"
      >
        <div class="forecast-location">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {{ forecast.code }} - {{ forecast.city }}
        </div>
        <div class="forecast-current">
          <div class="forecast-temp">{{ forecast.temp }}°F</div>
          <div class="forecast-condition">
            <div class="forecast-icon">{{ forecast.icon }}</div>
            <div class="forecast-description">{{ forecast.condition }}</div>
          </div>
        </div>
        <div class="forecast-details">
          <div class="forecast-detail-item">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5c1.65 0 3 1.35 3 3zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 8 15.5 8H2v2h13.5c1.93 0 3.5-1.57 3.5-3.5zm-.5 4.5H2v2h16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z" />
            </svg>
            <span class="forecast-detail-text">{{ forecast.wind }}</span>
          </div>
          <div class="forecast-detail-item">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <span class="forecast-detail-text">{{ forecast.visibility }}</span>
          </div>
          <div class="forecast-detail-item">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span class="forecast-detail-text">{{ forecast.pressure }} inHg</span>
          </div>
          <div class="forecast-detail-item">
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
            </svg>
            <span class="forecast-detail-text">Updated: {{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { airlines } from '@shared/data';

export default {
  name: 'WeatherModule',
  props: {
    weatherHazards: {
      type: Array,
      required: true
    },
    flights: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      weatherAlerts: [
        {
          type: 'severe',
          title: 'Severe Thunderstorm Warning',
          description: 'Intense thunderstorm activity detected along major flight corridors. Lightning, strong winds, and heavy precipitation expected.',
          location: 'Midwest Region',
          validUntil: '18:45 UTC',
          windSpeed: '65 kt',
          visibility: '0.5 SM'
        },
        {
          type: 'warning',
          title: 'Tropical Storm Advisory',
          description: 'Tropical depression intensifying near coastal routes. Moderate turbulence and crosswinds affecting approach patterns.',
          location: 'Southeast Coast',
          validUntil: '22:00 UTC',
          windSpeed: '45 kt',
          visibility: '2 SM'
        },
        {
          type: 'watch',
          title: 'Winter Storm Watch',
          description: 'Snow and ice accumulation forecast. Possible runway conditions affecting departure clearances.',
          location: 'Northeast Region',
          validUntil: '06:00 UTC +1',
          windSpeed: '25 kt',
          visibility: '1 SM'
        }
      ],
      airportForecasts: [
        {
          code: 'JFK', city: 'New York', temp: 72, condition: 'Thunderstorms', icon: '⛈️', wind: '15 kt NE', visibility: '3 SM', pressure: '29.82'
        },
        {
          code: 'LAX', city: 'Los Angeles', temp: 85, condition: 'Partly Cloudy', icon: '⛅', wind: '8 kt W', visibility: '10 SM', pressure: '30.12'
        },
        {
          code: 'ORD', city: 'Chicago', temp: 68, condition: 'Severe Storms', icon: '🌩️', wind: '25 kt SW', visibility: '2 SM', pressure: '29.65'
        },
        {
          code: 'DFW', city: 'Dallas', temp: 92, condition: 'Clear', icon: '☀️', wind: '12 kt S', visibility: '10 SM', pressure: '30.05'
        }
      ],
      affectedFlightsCache: []
    };
  },
  computed: {
    affectedFlightsList() {
      return this.affectedFlightsCache;
    },
    currentTime() {
      return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  },
  watch: {
    flights: {
      handler() {
        this.updateAffectedFlights();
      },
      immediate: true
    }
  },
  methods: {
    updateAffectedFlights() {
      // Generate stable affected flights list based on flight properties
      this.affectedFlightsCache = this.flights
        .filter((f) => {
          if (f.bottleneck) return true;
          // Use flight name hash as seed for consistent selection
          const hash = f.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          return hash % 10 > 4; // ~60% selection rate
        })
        .slice(0, 5)
        .map((f) => {
          const airline = airlines[f.airline];
          let impact;
          if (f.bottleneck) {
            impact = 'high';
          } else {
            // Use flight name hash for consistent impact
            const hash = f.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            impact = hash % 2 === 0 ? 'medium' : 'low';
          }

          let delay;
          if (impact === 'high') {
            delay = '45-60 min';
          } else if (impact === 'medium') {
            delay = '20-30 min';
          } else {
            delay = '10-15 min';
          }

          return {
            flight: f,
            airline,
            impact,
            delay
          };
        });
    }
  }
};
</script>

<style scoped>
.weather-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  padding-bottom: 90px;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(10, 22, 40, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  backdrop-filter: blur(8px);
  z-index: 800;
}

/* Header */
.weather-header {
  margin-bottom: 32px;
}

.weather-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.weather-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-title svg {
  width: 32px;
  height: 32px;
  color: #4a9dd7;
}

.weather-sync-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #4ade80;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.weather-sync-dot {
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Weather Alerts */
.weather-alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.weather-alert-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.weather-alert-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.05), transparent);
  pointer-events: none;
}

.weather-alert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.weather-alert-card.severe {
  border-left-color: #ef4444;
}

.weather-alert-card.warning {
  border-left-color: #f59e0b;
}

.weather-alert-card.watch {
  border-left-color: #3b82f6;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon.severe {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.alert-icon.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.alert-icon.watch {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.alert-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-badge.severe {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.alert-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.alert-badge.watch {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.alert-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-top: 8px;
  margin-bottom: 8px;
}

.alert-description {
  font-size: 13px;
  color: #b0b0b0;
  line-height: 1.5;
  margin-bottom: 16px;
}

.alert-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.alert-detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.alert-detail-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.alert-detail-value {
  font-size: 13px;
  color: #e0e0e0;
  font-weight: 600;
}

/* Affected Flights */
.affected-flights-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  padding: 24px;
  margin-bottom: 32px;
}

.affected-flights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #3a3a3a;
}

.affected-flights-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.affected-count {
  padding: 6px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
}

.affected-flights-list {
  display: grid;
  gap: 12px;
}

.affected-flight-item {
  background: #252525;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #3a3a3a;
  transition: all 0.2s ease;
}

.affected-flight-item:hover {
  background: #2f2f2f;
  border-color: #4a7ba7;
  transform: translateX(4px);
}

.affected-flight-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.flight-weather-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.affected-flight-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.affected-flight-number {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.affected-flight-route {
  font-size: 12px;
  color: #888;
}

.weather-impact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.impact-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.impact-badge.high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.impact-badge.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.impact-badge.low {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.delay-estimate {
  font-size: 12px;
  font-weight: 600;
  color: #e0e0e0;
}

/* Forecast Section */
.weather-forecast-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.forecast-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border-radius: 12px;
  border: 1px solid #3a3a3a;
  padding: 20px;
  transition: all 0.3s ease;
}

.forecast-card:hover {
  border-color: #4a7ba7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.forecast-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #4a9dd7;
  margin-bottom: 16px;
}

.forecast-location svg {
  flex-shrink: 0;
}

.forecast-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #3a3a3a;
}

.forecast-temp {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.forecast-condition {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.forecast-icon {
  font-size: 32px;
}

.forecast-description {
  font-size: 13px;
  color: #888;
}

.forecast-details {
  display: grid;
  gap: 12px;
}

.forecast-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b0b0b0;
  font-size: 12px;
}

.forecast-detail-item svg {
  width: 16px;
  height: 16px;
  color: #4a9dd7;
  flex-shrink: 0;
}

.forecast-detail-text {
  color: #e0e0e0;
}

@media (max-width: 768px) {
  .weather-title-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .weather-alerts-grid {
    grid-template-columns: 1fr;
  }

  .forecast-current {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .forecast-condition {
    align-items: flex-start;
    flex-direction: row;
    gap: 12px;
  }
}
</style>
