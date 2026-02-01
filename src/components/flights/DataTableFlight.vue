<template>
    <div
        ref="tableContainer"
        class="table-container"
    >
        <table class="flights-table">
            <thead>
                <tr>
                    <th class="severity-header">Severity Alert</th>
                    <th class="flight-cell">Flight</th>
                    <th class="route-cell">Route</th>
                    <th class="aircraft-cell">Aircraft</th>
                    <th>Status</th>
                    <th class="tracking-cell">Tracking</th>
                    <th class="altitude-cell">Altitude</th>
                    <th>Systems</th>
                    <th class="actions-header">Actions</th>
                </tr>
            </thead>
            <tbody>
                <FlightRow
                    v-for="flight in filteredFlights"
                    :key="flight.name"
                    :flight="flight"
                    :airlines="airlines"
                    :isSelected="isSelected(flight)"
                    :isTracked="isTracked(flight)"
                    :tcasAlert="getTcasAlert(flight)"
                    :isMenuOpen="isMenuOpen(flight)"
                    @click="handleFlightClick"
                    @track="handleTrack"
                    @untrack="handleUntrack"
                    @toggle-menu="handleToggleMenu"
                />
                <tr
                    v-if="filteredFlights.length === 0"
                    class="no-results-row"
                >
                    <td
                        colspan="9"
                        class="no-results-cell"
                    >
                        <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                        <span>No flights match your search criteria</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import FlightRow from './FlightRow.vue';

export default {
    name: 'DataTableFlight',
    components: {
        FlightRow
    },
    props: {
        filteredFlights: {
            type: Array,
            required: true
        },
        airlines: {
            type: Object,
            required: true
        },
        trackedAircraft: {
            type: Array,
            default: () => []
        },
        selectedFlight: {
            type: Object,
            default: null
        },
        tcasAlerts: {
            type: Object,
            default: () => ({})
        },
        openMenuFlight: {
            type: String,
            default: null
        }
    },
    emits: ['flight-click', 'track-aircraft', 'untrack-aircraft', 'toggle-menu'],
    methods: {
        handleFlightClick(flight) {
            this.$emit('flight-click', flight);
        },
        isTracked(flight) {
            return flight.icao24 && this.trackedAircraft.includes(flight.icao24);
        },
        handleTrack(flight) {
            this.$emit('track-aircraft', flight);
        },
        handleUntrack(flight) {
            this.$emit('untrack-aircraft', flight);
        },
        isSelected(flight) {
            return this.selectedFlight && this.selectedFlight.name === flight.name;
        },
        getTcasAlert(flight) {
            return this.tcasAlerts[flight.name] || null;
        },
        isMenuOpen(flight) {
            return this.openMenuFlight === flight.name;
        },
        handleToggleMenu(flight, event) {
            this.$emit('toggle-menu', flight, event);
        }
    }
};
</script>

<style scoped>
.table-container {
    overflow: auto;
    max-height: 280px;
}

.flights-table {
    width: 100%;
    border-collapse: collapse;
}

.flights-table thead {
    position: sticky;
    top: 0;
    background: rgb(30 40 50 / 70%);
    backdrop-filter: blur(16px) saturate(180%);
    z-index: 1;
}

.flights-table th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    color: #cbd5e1;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgb(255 255 255 / 12%);
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
}

/* Column widths to match data cells */
.flights-table th.flight-cell {
    min-width: 180px;
}

.flights-table th.route-cell {
    min-width: 150px;
}

.flights-table th.aircraft-cell {
    min-width: 120px;
}

.flights-table th.altitude-cell {
    min-width: 100px;
}

.flights-table th.tracking-cell {
    width: 120px;
    text-align: center;
}

.flights-table th.severity-header {
    width: 70px;
    text-align: center;
    padding: 12px 8px;
    font-size: 10px;
    line-height: 1.3;
    white-space: nowrap;
}

.flights-table th.actions-header {
    width: 80px;
    text-align: center;
}

.flights-table :deep(td) {
    padding: 12px 16px;
    font-size: 13px;
    color: #e0e7f0;
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
}

/* Elegant alternating row colors - Soft dark grey for professional look */
.flights-table :deep(tbody tr:nth-child(odd)) {
    background: linear-gradient(90deg, rgb(45 52 60 / 40%) 0%, rgb(40 47 55 / 30%) 100%);
}

.flights-table :deep(tbody tr:nth-child(even)) {
    background: linear-gradient(90deg, rgb(50 57 65 / 35%) 0%, rgb(45 52 60 / 25%) 100%);
}

/* No Results Row */
.no-results-row {
    cursor: default !important;
}

.no-results-row:hover {
    background: transparent !important;
    transform: none !important;
}

.no-results-cell {
    text-align: center;
    padding: 40px 20px !important;
    color: #888;
    font-size: 14px;
    font-weight: 500;
}

.no-results-cell svg {
    display: block;
    margin: 0 auto 12px;
    color: #666;
}

/* Scrollbar Styling */
.table-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: rgb(255 255 255 / 5%);
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
    background: rgb(74 157 215 / 30%);
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: rgb(74 157 215 / 50%);
}

/* Responsive */
@media (width <= 768px) {
    .flights-table th,
    .flights-table :deep(td) {
        padding: 10px 12px;
        font-size: 12px;
    }

    .flights-table th.flight-cell,
    .flights-table :deep(.flight-cell) {
        min-width: 150px;
    }

    .flights-table th.route-cell,
    .flights-table :deep(.route-cell) {
        min-width: 120px;
    }
}
</style>
