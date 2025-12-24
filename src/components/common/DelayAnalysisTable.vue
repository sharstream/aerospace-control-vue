<template>
  <div class="delay-analysis-container">
    <table v-if="delayedFlights.length > 0" class="delay-table">
      <thead>
        <tr>
          <th>Flight</th>
          <th>Airline</th>
          <th>Route</th>
          <th>Aircraft</th>
          <th>Passengers</th>
          <th>Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="flight in delayedFlights"
          :key="flight.name"
          class="delay-table-row"
        >
          <td class="flight-number-cell">
            <strong>{{ flight.name }}</strong>
          </td>
          <td>
            <div class="airline-cell">
              <span class="airline-logo-icon">{{ airlines[flight.airline]?.logo }}</span>
              <span class="airline-name">{{ airlines[flight.airline]?.name }}</span>
            </div>
          </td>
          <td class="route-cell">
            <span class="route-from">{{ airports[flight.from]?.city }}</span>
            <span class="route-arrow">→</span>
            <span class="route-to">{{ airports[flight.to]?.city }}</span>
          </td>
          <td class="aircraft-cell">{{ aircraftModels[flight.aircraft]?.name }}</td>
          <td class="passengers-cell">{{ flight.passengers }}</td>
          <td>
            <span :class="['impact-badge', getImpactClass(flight)]">
              {{ getImpactLabel(flight) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="no-delays-message">
      <svg
        width="64"
        height="64"
        fill="currentColor"
        viewBox="0 0 24 24"
        class="success-icon"
      >
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
      </svg>
      <h3 class="no-delays-title">No Delays Reported</h3>
      <p class="no-delays-description">All flights are operating on schedule</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DelayAnalysisTable',
  props: {
    delayedFlights: {
      type: Array,
      default: () => []
    },
    airlines: {
      type: Object,
      required: true
    },
    airports: {
      type: Object,
      required: true
    },
    aircraftModels: {
      type: Object,
      required: true
    }
  },
  methods: {
    getImpactClass(flight) {
      // Determine impact based on passengers and delay severity
      if (flight.passengers > 250) return 'impact-high'
      if (flight.passengers > 150) return 'impact-medium'
      return 'impact-low'
    },

    getImpactLabel(flight) {
      if (flight.passengers > 250) return 'High'
      if (flight.passengers > 150) return 'Medium'
      return 'Low'
    }
  }
}
</script>

<style scoped>
.delay-analysis-container {
  width: 100%;
}

.delay-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.delay-table thead {
  background: linear-gradient(135deg, rgba(51, 51, 51, 0.8) 0%, rgba(42, 42, 42, 0.9) 100%);
}

.delay-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(74, 157, 215, 0.3);
}

.delay-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 14px;
  color: #e0e0e0;
}

.delay-table-row {
  transition: all 0.2s ease;
}

.delay-table-row:hover {
  background: rgba(74, 157, 215, 0.08);
}

.delay-table-row:last-child td {
  border-bottom: none;
}

.flight-number-cell strong {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.airline-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.airline-logo-icon {
  font-size: 20px;
  line-height: 1;
}

.airline-name {
  color: #e0e0e0;
  font-weight: 500;
}

.route-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.route-from,
.route-to {
  color: #4a9dd7;
  font-weight: 600;
}

.route-arrow {
  color: #666;
  font-size: 16px;
}

.aircraft-cell {
  color: #b0b0b0;
  font-weight: 500;
}

.passengers-cell {
  color: #e0e0e0;
  font-weight: 600;
}

.impact-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
  min-width: 70px;
}

.impact-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}

.impact-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
}

.impact-low {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.4);
}

/* No Delays Message */
.no-delays-message {
  text-align: center;
  padding: 60px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(74, 222, 128, 0.2);
}

.success-icon {
  color: #4ade80;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.4));
}

.no-delays-title {
  font-size: 22px;
  font-weight: 700;
  color: #4ade80;
  margin: 0 0 10px 0;
  letter-spacing: -0.3px;
}

.no-delays-description {
  font-size: 15px;
  color: #b0b0b0;
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .delay-table {
    font-size: 12px;
  }

  .delay-table th,
  .delay-table td {
    padding: 10px 12px;
  }

  .airline-cell {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .delay-table {
    display: block;
    overflow-x: auto;
  }

  .delay-table thead {
    display: none;
  }

  .delay-table tbody {
    display: block;
  }

  .delay-table-row {
    display: block;
    margin-bottom: 16px;
    background: rgba(51, 51, 51, 0.6);
    border-radius: 8px;
    padding: 12px;
  }

  .delay-table td {
    display: block;
    padding: 8px 0;
    border: none;
  }

  .delay-table td::before {
    content: attr(data-label);
    display: inline-block;
    font-weight: 700;
    color: #888;
    margin-right: 8px;
    font-size: 11px;
    text-transform: uppercase;
  }
}
</style>
