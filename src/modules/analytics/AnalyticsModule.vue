<template>
  <div class="analytics-view active">
    <!-- Header -->
    <div class="analytics-header">
      <h1 class="analytics-title">Flight Analytics</h1>
      <p class="analytics-subtitle">Performance metrics and insights</p>
    </div>

    <!-- KPI Cards Grid -->
    <div class="kpi-grid">
      <!-- Total Flights -->
      <div class="kpi-card">
        <div class="kpi-icon-wrapper">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">TOTAL FLIGHTS</div>
          <div class="kpi-value">{{ flights.length }}</div>
        </div>
      </div>

      <!-- On Time -->
      <div class="kpi-card kpi-success">
        <div class="kpi-icon-wrapper success">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">ON TIME</div>
          <div class="kpi-value success-text">{{ onTimeFlights }}</div>
        </div>
      </div>

      <!-- Delayed -->
      <div class="kpi-card kpi-warning">
        <div class="kpi-icon-wrapper warning">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">DELAYED</div>
          <div class="kpi-value warning-text">{{ delayedFlightsCount }}</div>
        </div>
      </div>

      <!-- Airlines -->
      <div class="kpi-card">
        <div class="kpi-icon-wrapper">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">AIRLINES</div>
          <div class="kpi-value">{{ Object.keys(airlines).length }}</div>
        </div>
      </div>

      <!-- Total Passengers -->
      <div class="kpi-card">
        <div class="kpi-icon-wrapper">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">TOTAL PASSENGERS</div>
          <div class="kpi-value">{{ totalPassengers.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Avg Altitude -->
      <div class="kpi-card">
        <div class="kpi-icon-wrapper">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">AVG ALTITUDE</div>
          <div class="kpi-value">{{ avgAltitude.toLocaleString() }} ft</div>
        </div>
      </div>

      <!-- On-Time Rate -->
      <div class="kpi-card kpi-success">
        <div class="kpi-icon-wrapper success">
          <svg
            class="kpi-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">ON-TIME RATE</div>
          <div class="kpi-value success-text">{{ onTimePercentage }}%</div>
        </div>
      </div>
    </div>

    <!-- Airline Performance Breakdown -->
    <div class="airline-breakdown">
      <h2>Airline Performance Analysis</h2>
      <div class="airline-list">
        <div
          v-for="airline in airlineBreakdown"
          :key="airline.code"
          class="airline-item"
        >
          <div class="airline-info">
            <div
              class="airline-avatar"
              :style="{ background: airline.color }"
            >
              <span class="airline-logo">{{ airline.logo }}</span>
            </div>
            <div class="airline-details">
              <span class="airline-name">{{ airline.name }}</span>
              <span class="airline-code">{{ airline.code }}</span>
            </div>
          </div>
          <div class="airline-metrics">
            <div class="airline-metric">
              <div class="metric-label">Flights</div>
              <div class="metric-value">{{ airline.totalFlights }}</div>
            </div>
            <div class="airline-metric">
              <div class="metric-label">On-Time</div>
              <div class="metric-value success-text">{{ airline.onTime }}</div>
            </div>
            <div class="airline-metric">
              <div class="metric-label">Delayed</div>
              <div class="metric-value warning-text">{{ airline.delayed }}</div>
            </div>
            <div class="airline-metric">
              <div class="metric-label">Passengers</div>
              <div class="metric-value">{{ airline.passengers.toLocaleString() }}</div>
            </div>
            <div class="airline-metric-rate">
              <div class="rate-bar">
                <div
                  class="rate-fill"
                  :style="{ width: airline.onTimeRate + '%', background: airline.onTimeRate >= 80 ? '#4ade80' : airline.onTimeRate >= 60 ? '#f59e0b' : '#ef4444' }"
                ></div>
              </div>
              <span class="rate-text">{{ airline.onTimeRate }}% OTP</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Flights - Aircraft Systems Monitoring -->
    <div class="aircraft-monitoring-section">
      <h2 class="section-title">
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
        </svg>
        Active Flights - Aircraft Systems Monitoring
      </h2>

      <div class="flights-grid">
        <FlightMonitoringCard
          v-for="flight in flights"
          :key="flight.name"
          :flight="flight"
          :airlines="airlines"
          :systemHealth="systemsHealth[flight.name]"
          @toggle-detail="toggleFlightDetail(flight.name)"
        >
          <!-- Expanded Detail Panel -->
          <div
            v-if="expandedFlight === flight.name"
            class="flight-detail-panel"
          >
            <CabinVisualization
              :flight="flight"
              :totalSeats="getCabinSeats(flight)"
              :occupancyRate="getCabinOccupancy(flight)"
            />
            <SystemsMonitoring :systems="getFlightSystems(flight)" />
          </div>
        </FlightMonitoringCard>
      </div>
    </div>

    <!-- Weather Hazards & Outages Section -->
    <ReportSection title="Active Weather Hazards & Outages">
      <template #icon>
        <svg
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95z" />
        </svg>
      </template>
      <WeatherHazardCard
        v-for="(hazard, index) in weatherHazardsData"
        :key="index"
        :hazard="hazard"
        :affectedFlights="hazard.affectedFlights"
        :airlines="airlines"
      />
    </ReportSection>

    <!-- Delay Analysis Section -->
    <ReportSection title="Delay Analysis & Review">
      <template #icon>
        <svg
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      </template>
      <DelayAnalysisTable
        :delayedFlights="delayedFlights"
        :airlines="airlines"
        :airports="airportsData"
        :aircraftModels="aircraftModelsData"
      />
    </ReportSection>
  </div>
</template>

<script>
import { airports } from '@shared/data/airports';
import { aircraftModels } from '@shared/data/aircraft-models';
import { weatherHazards } from '@shared/data/weather-data';
import { calculateDistance } from '@shared/utils/calculations';
import ReportSection from '@/components/common/ReportSection.vue';
import WeatherHazardCard from '@/components/common/WeatherHazardCard.vue';
import DelayAnalysisTable from '@/components/common/DelayAnalysisTable.vue';
import FlightMonitoringCard from './components/FlightMonitoringCard.vue';
import CabinVisualization from './components/CabinVisualization.vue';
import SystemsMonitoring from './components/SystemsMonitoring.vue';

export default {
  name: 'AnalyticsModule',
  components: {
    ReportSection,
    WeatherHazardCard,
    DelayAnalysisTable,
    FlightMonitoringCard,
    CabinVisualization,
    SystemsMonitoring
  },
  props: {
    flights: {
      type: Array,
      required: true
    },
    airlines: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expandedFlight: null,
      airportsData: airports,
      aircraftModelsData: aircraftModels,
      weatherHazardsData: weatherHazards,
      systemsHealthCache: {},
      cabinSeatsCache: {},
      flightSystemsCache: {}
    };
  },
  computed: {
    systemsHealth() {
      return this.systemsHealthCache;
    },
    onTimeFlights() {
      return this.flights.filter(f => f.statusClass === 'on-time').length;
    },
    delayedFlightsCount() {
      return this.flights.filter(f => f.statusClass === 'delayed').length;
    },
    delayedFlights() {
      return this.flights.filter(f => f.statusClass === 'delayed');
    },
    totalPassengers() {
      return this.flights.reduce((sum, f) => sum + f.passengers, 0);
    },
    avgAltitude() {
      const total = this.flights.reduce((sum, f) => {
        const alt = parseInt(f.altitude.replace(/[^\d]/g, ''), 10);
        return sum + alt;
      }, 0);
      return Math.round(total / this.flights.length);
    },
    onTimePercentage() {
      return Math.round((this.onTimeFlights / this.flights.length) * 100);
    },
    airlineBreakdown() {
      return Object.entries(this.airlines).map(([code, airline]) => {
        const airlineFlights = this.flights.filter(f => f.airline === code);
        const onTime = airlineFlights.filter(f => f.statusClass === 'on-time').length;
        const delayed = airlineFlights.filter(f => f.statusClass === 'delayed').length;
        const passengers = airlineFlights.reduce((sum, f) => sum + f.passengers, 0);

        return {
          code,
          ...airline,
          totalFlights: airlineFlights.length,
          onTime,
          delayed,
          passengers,
          onTimeRate: airlineFlights.length > 0 ? Math.round((onTime / airlineFlights.length) * 100) : 0
        };
      }).filter(a => a.totalFlights > 0);
    }
  },
  watch: {
    flights: {
      handler() {
        this.initializeSystemsHealth();
        this.initializeCabinData();
        this.initializeFlightSystems();
      }
    }
  },
  mounted() {
    // Calculate affected flights for each weather hazard
    this.weatherHazardsData = this.weatherHazardsData.map((hazard) => {
      const affected = this.flights.filter((flight) => {
        // Check if flight path intersects this hazard
        const midLat = (flight.path[0][0] + flight.path[1][0]) / 2;
        const midLon = (flight.path[0][1] + flight.path[1][1]) / 2;
        const dist = calculateDistance(midLat, midLon, hazard.center[0], hazard.center[1]);
        return dist <= hazard.radius + 100;
      });

      return {
        ...hazard,
        affectedFlights: affected
      };
    });

    // Initialize stable systems health data
    this.initializeSystemsHealth();
    this.initializeCabinData();
    this.initializeFlightSystems();
  },
  methods: {
    initializeSystemsHealth() {
      const health = {};
      this.flights.forEach((flight) => {
        // Use flight name hash as seed for consistent health values
        const hash = flight.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const healthValue = 80 + (hash % 20); // 80-100%
        let statusClass; let
          label;
        if (healthValue >= 95) {
          statusClass = 'operational';
          label = 'SYSTEMS OK';
        } else if (healthValue >= 85) {
          statusClass = 'warning';
          label = 'MONITOR';
        } else {
          statusClass = 'critical';
          label = 'ALERT';
        }
        health[flight.name] = { health: healthValue, statusClass, label };
      });
      this.systemsHealthCache = health;
    },
    initializeCabinData() {
      const cabinData = {};
      this.flights.forEach((flight) => {
        const hash = flight.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        cabinData[flight.name] = flight.passengers + (hash % 20) + 10;
      });
      this.cabinSeatsCache = cabinData;
    },
    initializeFlightSystems() {
      const systems = {};
      this.flights.forEach((flight) => {
        systems[flight.name] = this.generateFlightSystems(flight);
      });
      this.flightSystemsCache = systems;
    },
    toggleFlightDetail(flightName) {
      this.expandedFlight = this.expandedFlight === flightName ? null : flightName;
    },
    getCabinSeats(flight) {
      return this.cabinSeatsCache[flight.name] || flight.passengers + 15;
    },
    getCabinOccupancy(flight) {
      const totalSeats = this.getCabinSeats(flight);
      return ((flight.passengers / totalSeats) * 100).toFixed(1);
    },
    getFlightSystems(flight) {
      // Return cached systems for this flight
      return this.flightSystemsCache[flight.name] || [];
    },
    generateFlightSystems(flight) {
      // Generate consistent system data using flight name as seed
      const hash = flight.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

      const generateSystemData = (name, icon, seedOffset) => {
        const seed = (hash + seedOffset) % 100;
        const health = 70 + (seed % 30); // 70-100%
        let status; let
          statusClass;
        if (health >= 90) {
          status = 'OPERATIONAL';
          statusClass = 'operational';
        } else if (health >= 75) {
          status = 'WARNING';
          statusClass = 'warning';
        } else {
          status = 'CRITICAL';
          statusClass = 'critical';
        }
        return {
          name, icon, status, statusClass, health
        };
      };

      const systems = [
        {
          ...generateSystemData('ELECTRICAL SYSTEM', 'd="M7 2v11h3v9l7-12h-4l4-8z"', 10),
          metrics: {
            VOLTAGE: `${(115 + (hash % 50) / 10).toFixed(1)}V`,
            LOAD: `${(75 + (hash % 15)).toFixed(0)}%`,
            'GEN 1': 'ONLINE',
            'GEN 2': 'ONLINE'
          }
        },
        {
          ...generateSystemData('HVAC SYSTEM', 'd="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"', 20),
          metrics: {
            'CABIN TEMP': `${(68 + ((hash + 50) % 80) / 10).toFixed(1)}°F`,
            'CABIN PRESS': `${(8 + ((hash + 30) % 20) / 10).toFixed(2)} PSI`,
            'PACK 1': 'ON',
            'PACK 2': 'ON'
          }
        },
        {
          ...generateSystemData('HYDRAULICS', 'd="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"', 30),
          metrics: {
            'SYSTEM A': `${(2800 + ((hash + 100) % 400)).toFixed(0)} PSI`,
            'SYSTEM B': `${(2800 + ((hash + 200) % 400)).toFixed(0)} PSI`,
            'RESERVOIR A': `${(90 + ((hash + 10) % 10)).toFixed(0)}%`,
            'RESERVOIR B': `${(90 + ((hash + 20) % 10)).toFixed(0)}%`
          }
        },
        {
          ...generateSystemData('FUEL SYSTEM', 'd="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z"', 40),
          metrics: {
            'TOTAL FUEL': `${(40000 + ((hash + 300) % 20000)).toFixed(0)} lbs`,
            'FLOW RATE': `${(5000 + ((hash + 400) % 2000)).toFixed(0)} lbs/hr`,
            'LEFT TANK': `${(85 + ((hash + 50) % 15)).toFixed(0)}%`,
            'RIGHT TANK': `${(85 + ((hash + 60) % 15)).toFixed(0)}%`
          }
        }
      ];

      return systems;
    }
  }
};
</script>

<style scoped>
.analytics-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 32px;
  padding-bottom: 90px;
  overflow-y: auto;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  z-index: 800;
}

/* Header */
.analytics-header {
  margin-bottom: 32px;
}

.analytics-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.analytics-subtitle {
  font-size: 15px;
  color: #888;
  margin: 0;
  font-weight: 400;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.kpi-card {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.6) 0%, rgba(31, 31, 31, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.03), transparent);
  pointer-events: none;
}

.kpi-card:hover {
  transform: translateY(-4px);
  border-color: rgba(74, 157, 215, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.kpi-card.kpi-success {
  border-color: rgba(74, 222, 128, 0.2);
}

.kpi-card.kpi-success:hover {
  border-color: rgba(74, 222, 128, 0.4);
  box-shadow: 0 8px 24px rgba(74, 222, 128, 0.15);
}

.kpi-card.kpi-warning {
  border-color: rgba(251, 191, 36, 0.2);
}

.kpi-card.kpi-warning:hover {
  border-color: rgba(251, 191, 36, 0.4);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.15);
}

.kpi-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(74, 157, 215, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.kpi-icon-wrapper.success {
  background: rgba(74, 222, 128, 0.12);
}

.kpi-icon-wrapper.warning {
  background: rgba(251, 191, 36, 0.12);
}

.kpi-card:hover .kpi-icon-wrapper {
  transform: scale(1.1);
}

.kpi-icon {
  width: 28px;
  height: 28px;
  color: #4a9dd7;
}

.kpi-icon-wrapper.success .kpi-icon {
  color: #4ade80;
}

.kpi-icon-wrapper.warning .kpi-icon {
  color: #fbbf24;
}

.kpi-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kpi-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  letter-spacing: -1px;
}

.kpi-value.success-text {
  color: #4ade80;
}

.kpi-value.warning-text {
  color: #fbbf24;
}

/* Airline Breakdown */
.airline-breakdown {
  margin-top: 48px;
}

.airline-breakdown h2 {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

.airline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.airline-item {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.4) 0%, rgba(31, 31, 31, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.airline-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.02), transparent);
  pointer-events: none;
}

.airline-item:hover {
  border-color: rgba(74, 157, 215, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.airline-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 0 0 auto;
}

.airline-avatar {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.airline-item:hover .airline-avatar {
  transform: scale(1.05);
}

.airline-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.airline-logo {
  font-size: 32px;
}

.airline-name {
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.3px;
}

.airline-code {
  color: #666;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.airline-metrics {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: flex-end;
}

.airline-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 80px;
}

.metric-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
}

.metric-value {
  font-size: 22px;
  color: #e0e0e0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.success-text {
  color: #4ade80;
}

.warning-text {
  color: #fbbf24;
}

.airline-metric-rate {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;
}

.rate-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.rate-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px currentColor;
}

.rate-text {
  font-size: 13px;
  color: #e0e0e0;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .airline-metrics {
    gap: 24px;
  }

  .airline-metric {
    min-width: 70px;
  }

  .airline-metric-rate {
    min-width: 120px;
  }
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .airline-metrics {
    gap: 16px;
  }

  .airline-metric {
    min-width: 60px;
  }

  .metric-value {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .analytics-view {
    padding: 20px;
  }

  .analytics-title {
    font-size: 26px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .kpi-card {
    padding: 20px;
  }

  .airline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
  }

  .airline-info {
    width: 100%;
  }

  .airline-metrics {
    width: 100%;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
  }

  .airline-metric {
    min-width: calc(50% - 6px);
  }

  .airline-metric-rate {
    width: 100%;
  }
}

/* Aircraft Monitoring Section */
.aircraft-monitoring-section {
  margin-top: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.5px;
}

.section-title svg {
  color: #4a9dd7;
}

.flights-grid {
  display: grid;
  gap: 16px;
}

.flight-detail-panel {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
