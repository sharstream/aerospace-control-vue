<template>
  <div class="cabin-visualization">
    <div class="cabin-header-info">
      <div class="cabin-title-text">Cabin Layout & Passenger Manifest</div>
      <div class="cabin-occupancy">{{ flight.passengers }} / {{ totalSeats }} Seats ({{ occupancyRate }}% Full)</div>
    </div>

    <div class="cabin-layout">
      <!-- Flight Deck -->
      <div class="cabin-section">
        <div class="cabin-section-label">FLIGHT DECK</div>
        <div class="cabin-rows">
          <div class="cabin-row">
            <div class="cabin-row-number">0</div>
            <div class="seat cockpit">👨‍✈️</div>
            <div class="seat cockpit">👨‍✈️</div>
          </div>
        </div>
      </div>

      <!-- Business Class -->
      <div class="cabin-section">
        <div class="cabin-section-label">BUSINESS CLASS</div>
        <div class="cabin-rows">
          <div
            v-for="row in 3"
            :key="'business-' + row"
            class="cabin-row"
          >
            <div class="cabin-row-number">{{ row }}</div>
            <div
              v-for="col in 2"
              :key="'b-l-' + col"
              :class="['seat', getSeatClass(row, col)]"
            >
              <span v-if="isSeatOccupied(row, col)">👤</span>
            </div>
            <div class="cabin-aisle"></div>
            <div
              v-for="col in 2"
              :key="'b-r-' + col"
              :class="['seat', getSeatClass(row, col + 2)]"
            >
              <span v-if="isSeatOccupied(row, col + 2)">👤</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Economy Class -->
      <div class="cabin-section">
        <div class="cabin-section-label">ECONOMY CLASS</div>
        <div class="cabin-rows">
          <div
            v-for="row in 20"
            :key="'economy-' + row"
            class="cabin-row"
          >
            <div class="cabin-row-number">{{ row + 3 }}</div>
            <div
              v-for="col in 3"
              :key="'e-l-' + col"
              :class="['seat', getSeatClass(row + 3, col)]"
            >
              <span v-if="isSeatOccupied(row + 3, col)">👤</span>
            </div>
            <div class="cabin-aisle"></div>
            <div
              v-for="col in 3"
              :key="'e-r-' + col"
              :class="['seat', getSeatClass(row + 3, col + 3)]"
            >
              <span v-if="isSeatOccupied(row + 3, col + 3)">👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cabin-legend">
      <div class="legend-item">
        <div class="legend-color occupied"></div>
        <span>Occupied</span>
      </div>
      <div class="legend-item">
        <div class="legend-color available"></div>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <div class="legend-color first-class"></div>
        <span>First Class</span>
      </div>
      <div class="legend-item">
        <div class="legend-color cockpit"></div>
        <span>Flight Deck</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CabinVisualization',
  props: {
    flight: {
      type: Object,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    occupancyRate: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    getSeatClass(row, col) {
      // Deterministic seat generation based on row and column
      const seed = (row * 7 + col * 13) % 10;
      return seed < 7 ? 'occupied' : 'empty';
    },
    isSeatOccupied(row, col) {
      const seed = (row * 7 + col * 13) % 10;
      return seed < 7;
    }
  }
};
</script>

<style scoped>
.cabin-visualization {
  background: linear-gradient(135deg, rgba(26, 38, 50, 0.6) 0%, rgba(20, 30, 40, 0.6) 100%);
  border: 1px solid rgba(74, 157, 215, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.cabin-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cabin-title-text {
  font-size: 16px;
  font-weight: 700;
  color: #4a9dd7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cabin-occupancy {
  font-size: 13px;
  color: #888;
  font-weight: 600;
}

.cabin-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.cabin-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cabin-section-label {
  font-size: 10px;
  font-weight: 700;
  color: #4a9dd7;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-left: 32px;
}

.cabin-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cabin-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cabin-row-number {
  width: 24px;
  font-size: 11px;
  color: #666;
  text-align: right;
  font-weight: 600;
}

.cabin-aisle {
  width: 20px;
}

.seat {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid;
  transition: all 0.2s ease;
  cursor: pointer;
}

.seat:hover {
  transform: scale(1.1);
}

.seat.occupied {
  background: #4a7ba7;
  border-color: #5a8dc7;
  box-shadow: 0 2px 4px rgba(74, 123, 167, 0.4);
}

.seat.empty {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.seat.first-class {
  background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%);
  border-color: #e5c047;
  box-shadow: 0 2px 4px rgba(212, 175, 55, 0.4);
}

.seat.cockpit {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #f87171;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
}

.cabin-legend {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #b0b0b0;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid;
}

.legend-color.occupied {
  background: #4a7ba7;
  border-color: #5a8dc7;
}

.legend-color.available {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.legend-color.first-class {
  background: linear-gradient(135deg, #d4af37 0%, #c5a028 100%);
  border-color: #e5c047;
}

.legend-color.cockpit {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #f87171;
}
</style>
