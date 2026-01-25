<template>
    <Motion
        v-if="!collapsed"
        as="div"
        :initial="{ opacity: 0, y: 100 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 100 }"
        :transition="{ duration: 0.4, ease: 'easeOut' }"
        class="flights-data-table"
    >
        <div class="table-header">
            <div class="table-header-content">
                <div class="table-title">
                    <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                    >
                        <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
                    </svg>
                    <span>Active Flights</span>
                    <span class="flight-count">{{ filteredFlights.length }}/{{ flights.length }}</span>
                </div>

                <!-- Search Bar -->
                <div class="search-container">
                    <svg
                        class="search-icon"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                    >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="search-input"
                        placeholder="Search flights..."
                    />
                    <button
                        v-if="searchQuery"
                        class="search-clear"
                        @click="clearSearch"
                    >
                        <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                    <select
                        v-model="searchField"
                        class="search-filter"
                    >
                        <option value="all">All Fields</option>
                        <option value="flight">Flight #</option>
                        <option value="route">Route</option>
                        <option value="aircraft">Aircraft</option>
                        <option value="airline">Airline</option>
                    </select>
                </div>

                <button
                    class="view-all-btn"
                    @click="$emit('view-all')"
                >
                    View All
                    <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                    >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>
            </div>
            <button
                class="collapse-btn"
                title="Hide Flights Table"
                @click="collapsed = true"
            >
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                >
                    <path d="M7 14l5-5 5 5z" />
                </svg>
            </button>
        </div>

        <div
            ref="tableContainer"
            class="table-container"
        >
            <table class="flights-table">
                <thead>
                    <tr>
                        <th>Flight</th>
                        <th>Route</th>
                        <th>Aircraft</th>
                        <th>Status</th>
                        <th>Tracking</th>
                        <th>Altitude</th>
                        <th>Systems</th>
                        <th class="actions-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="flight in filteredFlights"
                        :key="flight.name"
                        :class="[
                            'flight-row',
                            {
                                'selected': isSelected(flight),
                                'tcas-stable': getTcasAlert(flight) === 'stable',
                                'tcas-warning': getTcasAlert(flight) === 'warning',
                                'tcas-critical': getTcasAlert(flight) === 'critical'
                            }
                        ]"
                        @click="handleFlightClick(flight)"
                    >
                        <td class="flight-cell">
                            <div class="flight-cell-content">
                                <div
                                    class="airline-logo"
                                    :style="{ background: airlines[flight.airline]?.color || '#4a9dd7' }"
                                >
                                    {{ airlines[flight.airline]?.logo || '✈️' }}
                                </div>
                                <div class="flight-info">
                                    <div class="flight-number">{{ flight.name }}</div>
                                    <div class="airline-name">{{ airlines[flight.airline]?.name || 'Unknown' }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="route-cell">
                            <div class="route-content">
                                <span class="airport">{{ flight.from }}</span>
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
                                >
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                                <span class="airport">{{ flight.to }}</span>
                            </div>
                        </td>
                        <td class="aircraft-cell">{{ flight.aircraft }}</td>
                        <td>
                            <span :class="['status-badge', flight.statusClass]">
                                {{ flight.status }}
                            </span>
                        </td>
                        <td class="tracking-cell">
                            <FlightsTrackingPill
                                :flight="flight"
                                :isTracked="isTracked(flight)"
                                @track="handleTrack"
                                @untrack="handleUntrack"
                            />
                        </td>
                        <td class="altitude-cell">{{ flight.altitude }}</td>
                        <td>
                            <span
                                v-if="flight.systems"
                                :class="['systems-badge', flight.systems.overall.statusClass]"
                            >
                                {{ flight.systems.overall.health }}%
                            </span>
                            <span
                                v-else
                                class="systems-badge operational"
                            >N/A</span>
                        </td>
                        <td class="actions-cell">
                            <div class="actions-container">
                                <button
                                    class="menu-button"
                                    :class="{ 'active': isMenuOpen(flight) }"
                                    @click="toggleMenu(flight, $event)"
                                >
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr
                        v-if="filteredFlights.length === 0"
                        class="no-results-row"
                    >
                        <td
                            colspan="8"
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
    </Motion>

    <!-- Fixed Position Dropdown Menu - MUST be outside Motion component -->
    <transition name="menu-fade">
        <div
            v-if="openMenuFlight"
            class="dropdown-menu-fixed"
            :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
            @click.stop
        >
            <button class="menu-item">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                View Details
            </button>
            <button
                class="menu-item"
                @click="isTracked(filteredFlights.find(f => f.name === openMenuFlight)) ? handleUntrack(filteredFlights.find(f => f.name === openMenuFlight)) : handleTrack(filteredFlights.find(f => f.name === openMenuFlight))"
            >
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {{ isTracked(filteredFlights.find(f => f.name === openMenuFlight)) ? 'Stop Tracking' : 'Track Flight' }}
            </button>
            <button class="menu-item danger">
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                Clear from Radar
            </button>
        </div>
    </transition>

    <!-- Overlay to close menu when clicking outside -->
    <div
        v-if="openMenuFlight"
        class="menu-overlay"
        @click="closeMenu"
    ></div>

    <!-- Collapsed Toggle Button -->
    <Motion
        v-if="collapsed"
        as="button"
        :initial="{ opacity: 0, y: 10 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: 10 }"
        :transition="{ duration: 0.3, ease: 'easeOut' }"
        class="expand-btn"
        @click="collapsed = false"
    >
        <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <path d="M21,16v-2l-8-5V3.5c0-0.83-0.67-1.5-1.5-1.5S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
        </svg>
        <span>Show Flights ({{ flights.length }})</span>
        <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <path d="M7 10l5 5 5-5z" />
        </svg>
    </Motion>
</template>

<script>
import { Motion } from 'motion-v';
import FlightsTrackingPill from './FlightsTrackingPill.vue';

export default {
    name: 'FlightsDataTable',
    components: {
        Motion,
        FlightsTrackingPill
    },
    props: {
        flights: {
            type: Array,
            required: true
        },
        airlines: {
            type: Object,
            required: true
        },
        bottomNavCollapsed: {
            type: Boolean,
            default: false
        },
        trackedAircraft: {
            type: Array,
            default: () => []
        },
        selectedFlight: {
            type: Object,
            default: null
        }
    },
    emits: ['view-all', 'flight-click', 'track-aircraft', 'untrack-aircraft', 'collapse-state-change'],
    data() {
        return {
            collapsed: true, // Default to collapsed
            openMenuFlight: null, // Track which flight's menu is open
            menuPosition: { top: 0, left: 0 }, // Fixed position for menu
            searchQuery: '', // Search filter
            searchField: 'all' // Which field to search in
        };
    },
    computed: {
        bottomPosition() {
            return this.bottomNavCollapsed ? '10px' : '80px';
        },
        expandButtonBottom() {
            return this.bottomNavCollapsed ? '20px' : '90px';
        },
        /**
         * Filter flights based on search query
         */
        filteredFlights() {
            if (!this.searchQuery.trim()) {
                return this.flights;
            }

            const query = this.searchQuery.toLowerCase();

            return this.flights.filter((flight) => {
                if (this.searchField === 'all') {
                    // Search across all fields
                    return (
                        flight.name?.toLowerCase().includes(query)
                        || flight.from?.toLowerCase().includes(query)
                        || flight.to?.toLowerCase().includes(query)
                        || flight.aircraft?.toLowerCase().includes(query)
                        || flight.status?.toLowerCase().includes(query)
                        || this.airlines[flight.airline]?.name?.toLowerCase().includes(query)
                    );
                }

                // Search specific field
                if (this.searchField === 'flight') {
                    return flight.name?.toLowerCase().includes(query);
                }
                if (this.searchField === 'route') {
                    return flight.from?.toLowerCase().includes(query)
                        || flight.to?.toLowerCase().includes(query);
                }
                if (this.searchField === 'aircraft') {
                    return flight.aircraft?.toLowerCase().includes(query);
                }
                if (this.searchField === 'airline') {
                    return this.airlines[flight.airline]?.name?.toLowerCase().includes(query);
                }

                return true;
            });
        },
        /**
         * Check TCAS collision alerts for each flight
         * Returns severity level: 'stable', 'warning', or 'critical'
         */
        tcasAlerts() {
            const alerts = {};

            // If less than 2 flights, all are stable
            if (this.flights.length < 2) {
                this.flights.forEach((flight) => {
                    alerts[flight.name] = 'stable';
                });
                return alerts;
            }

            this.flights.forEach((flight, index) => {
                // Parse altitude - handle various formats (10668m, 10,668m, etc.)
                const altitudeStr = flight.altitude?.replace(/[^\d]/g, '');
                const flightAlt = parseInt(altitudeStr, 10);

                // Skip if altitude is invalid
                if (!altitudeStr || Number.isNaN(flightAlt) || flightAlt === 0) {
                    alerts[flight.name] = 'stable';
                    return;
                }

                let minSeparation = Infinity;

                // Check against other flights
                for (let i = 0; i < this.flights.length; i += 1) {
                    if (i !== index) {
                        const otherFlight = this.flights[i];
                        const otherAltStr = otherFlight.altitude?.replace(/[^\d]/g, '');
                        const otherAlt = parseInt(otherAltStr, 10);

                        // Skip invalid altitudes
                        if (!otherAltStr || Number.isNaN(otherAlt) || otherAlt === 0) {
                            continue; // eslint-disable-line no-continue
                        }

                        const altDiff = Math.abs(flightAlt - otherAlt);

                        // Only consider meaningful separations (> 0)
                        if (altDiff > 0 && altDiff < minSeparation) {
                            minSeparation = altDiff;
                        }
                    }
                }

                // Classify TCAS status based on minimum separation
                // If no valid comparisons were made, default to stable
                if (minSeparation === Infinity || minSeparation > 2000) {
                    alerts[flight.name] = 'stable'; // Blue - Normal (well separated)
                } else if (minSeparation < 500) {
                    alerts[flight.name] = 'critical'; // Red - Immediate danger
                } else if (minSeparation < 1000) {
                    alerts[flight.name] = 'warning'; // Yellow - Caution
                } else {
                    alerts[flight.name] = 'stable'; // Blue - Normal
                }
            });
            return alerts;
        }
    },
    watch: {
        collapsed(newVal) {
            this.$emit('collapse-state-change', newVal);
        }
    },
    mounted() {
        // Close menu when clicking outside
        document.addEventListener('click', this.closeMenu);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeMenu);
    },
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
        toggleMenu(flight, event) {
            event.stopPropagation();

            if (this.openMenuFlight === flight.name) {
                // Close menu
                this.openMenuFlight = null;
                return;
            }

            // Use nextTick to ensure DOM is updated before calculating position
            this.$nextTick(() => {
                // Calculate fixed position for menu
                const button = event.currentTarget;
                const buttonRect = button.getBoundingClientRect();

                // Menu dimensions (actual measured size)
                const menuHeight = 136;
                const menuWidth = 200;

                // Calculate position to the left of button
                let left = buttonRect.right - menuWidth - 4;

                // Start with menu below button
                let top = buttonRect.top + buttonRect.height + 4;

                // Check if menu would overflow viewport bottom
                const spaceBelow = window.innerHeight - (buttonRect.top + buttonRect.height);
                const spaceAbove = buttonRect.top;

                if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
                    // Position above button if more space there
                    top = buttonRect.top - menuHeight - 4;
                }

                // Ensure menu stays within viewport left/right bounds
                if (left < 16) {
                    left = 16;
                } else if (left + menuWidth > window.innerWidth - 16) {
                    left = window.innerWidth - menuWidth - 16;
                }

                // Ensure menu stays within viewport top/bottom bounds
                if (top < 16) {
                    top = 16;
                } else if (top + menuHeight > window.innerHeight - 16) {
                    top = window.innerHeight - menuHeight - 16;
                }

                this.menuPosition = { top, left };
            });

            this.openMenuFlight = flight.name;
        },
        closeMenu() {
            this.openMenuFlight = null;
        },
        isMenuOpen(flight) {
            return this.openMenuFlight === flight.name;
        },
        clearSearch() {
            this.searchQuery = '';
        }
    }
};
</script>

<style scoped>
.flights-data-table {
    position: absolute;
    bottom: v-bind(bottomPosition);
    left: 16px;
    right: 16px;
    background: linear-gradient(135deg, rgb(25 35 45 / 55%) 0%, rgb(20 30 40 / 60%) 100%);
    backdrop-filter: blur(32px) saturate(180%);
    border: 1px solid rgb(74 157 215 / 30%);
    border-radius: 20px;
    box-shadow:
        0 20px 60px rgb(0 0 0 / 40%),
        0 0 0 1px rgb(74 157 215 / 20%),
        inset 0 1px 0 rgb(255 255 255 / 12%);
    z-index: 900;
    max-height: 350px;
    display: flex;
    flex-direction: column;
    transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
}

.table-header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.table-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
}

.table-title svg {
    color: #4a9dd7;
}

.flight-count {
    background: rgb(74 157 215 / 20%);
    color: #4a9dd7;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    border: 1px solid rgb(74 157 215 / 30%);
}

/* Search Bar Styling */
.search-container {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgb(255 255 255 / 8%);
    backdrop-filter: blur(8px);
    border: 1px solid rgb(74 157 215 / 25%);
    border-radius: 10px;
    padding: 8px 12px;
    flex: 1;
    max-width: 400px;
}

.search-icon {
    color: #60a5fa;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    min-width: 0;
}

.search-input::placeholder {
    color: rgb(255 255 255 / 40%);
}

.search-clear {
    background: rgb(239 68 68 / 20%);
    border: 1px solid rgb(239 68 68 / 30%);
    color: #ef4444;
    padding: 4px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.search-clear:hover {
    background: rgb(239 68 68 / 30%);
    transform: scale(1.05);
}

.search-filter {
    background: linear-gradient(135deg, rgb(74 157 215 / 18%) 0%, rgb(74 157 215 / 12%) 100%);
    backdrop-filter: blur(8px) saturate(180%);
    border: 1px solid rgb(74 157 215 / 35%);
    color: #60a5fa;
    padding: 6px 12px 6px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
        0 2px 8px rgb(0 0 0 / 15%),
        inset 0 1px 0 rgb(255 255 255 / 10%);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    padding-right: 26px;
}

.search-filter:hover {
    background: linear-gradient(135deg, rgb(74 157 215 / 28%) 0%, rgb(74 157 215 / 20%) 100%);
    border-color: rgb(74 157 215 / 50%);
    box-shadow:
        0 4px 12px rgb(0 0 0 / 25%),
        0 0 0 1px rgb(74 157 215 / 25%),
        inset 0 1px 0 rgb(255 255 255 / 15%);
    transform: translateY(-1px);
}

.search-filter:focus {
    background: linear-gradient(135deg, rgb(74 157 215 / 28%) 0%, rgb(74 157 215 / 20%) 100%);
    border-color: rgb(74 157 215 / 60%);
    box-shadow:
        0 4px 16px rgb(74 157 215 / 30%),
        0 0 0 1px rgb(74 157 215 / 40%),
        inset 0 1px 0 rgb(255 255 255 / 15%);
}

.search-filter option {
    background: linear-gradient(135deg, rgb(20 25 30 / 98%) 0%, rgb(15 20 25 / 99%) 100%);
    color: #e8eef5;
    padding: 10px 14px;
    font-size: 12px;
    font-weight: 500;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.search-filter option:hover {
    background: linear-gradient(90deg, rgb(74 157 215 / 18%) 0%, rgb(74 157 215 / 8%) 100%);
    color: #fff;
}

.search-filter option:checked {
    background: linear-gradient(90deg, rgb(74 157 215 / 25%) 0%, rgb(74 157 215 / 15%) 100%);
    color: #93c5fd;
    font-weight: 600;
}

.view-all-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgb(74 157 215 / 15%);
    color: #4a9dd7;
    border: 1px solid rgb(74 157 215 / 30%);
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.view-all-btn:hover {
    background: rgb(74 157 215 / 25%);
    transform: translateX(2px);
}

.collapse-btn {
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 10%);
    color: #888;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.collapse-btn:hover {
    background: rgb(255 255 255 / 10%);
    color: #fff;
}

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
    color: #888;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
}

.flights-table tbody tr {
    border-bottom: 1px solid rgb(255 255 255 / 6%);
    cursor: pointer;
    position: relative;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.flights-table tbody tr::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: transparent;
    border-radius: 0 4px 4px 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover state - works for all rows */
.flights-table tbody tr:hover {
    background: rgb(74 157 215 / 15%) !important;
    transform: translateX(2px);
}

.flights-table tbody tr:hover::before {
    box-shadow: 0 0 12px rgb(74 157 215 / 40%);
}

/* Selected Row */
.flights-table tbody tr.selected {
    background: linear-gradient(90deg, rgb(74 157 215 / 20%) 0%, rgb(74 157 215 / 8%) 100%);
    border-left: 4px solid #4a9dd7;
    box-shadow: inset 0 0 30px rgb(74 157 215 / 15%);
}

.flights-table tbody tr.selected::before {
    background: linear-gradient(180deg, #4a9dd7 0%, #3b8bc0 100%);
    box-shadow: 0 0 15px rgb(74 157 215 / 60%), inset 0 0 8px rgb(255 255 255 / 30%);
}

/* TCAS Stable State - Blue (Normal operations) */
.flights-table tbody tr.tcas-stable {
    background: linear-gradient(90deg, rgb(59 130 246 / 12%) 0%, rgb(59 130 246 / 4%) 100%);
    border-left: 4px solid #3b82f6;
}

.flights-table tbody tr.tcas-stable::before {
    background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
    box-shadow: 0 0 12px rgb(59 130 246 / 50%);
}

/* TCAS Warning State - Yellow (Caution) */
.flights-table tbody tr.tcas-warning {
    background: linear-gradient(90deg, rgb(234 179 8 / 18%) 0%, rgb(234 179 8 / 6%) 100%);
    border-left: 4px solid #eab308;
}

.flights-table tbody tr.tcas-warning::before {
    background: linear-gradient(180deg, #eab308 0%, #ca8a04 100%);
    box-shadow: 0 0 15px rgb(234 179 8 / 60%);
    animation: pulse-glow-warning 2s ease-in-out infinite;
}

/* TCAS Critical State - Red (Immediate danger) */
.flights-table tbody tr.tcas-critical {
    background: linear-gradient(90deg, rgb(220 38 38 / 22%) 0%, rgb(220 38 38 / 8%) 100%);
    border-left: 4px solid #dc2626;
}

.flights-table tbody tr.tcas-critical::before {
    background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
    box-shadow: 0 0 20px rgb(220 38 38 / 70%);
    animation: pulse-glow-critical 1.2s ease-in-out infinite;
}

.flights-table td {
    padding: 12px 16px;
    font-size: 13px;
    color: #e0e0e0;
}

.flight-cell {
    min-width: 180px;
}

.flight-cell-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.airline-logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
}

.flight-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.flight-number {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
}

.airline-name {
    font-size: 11px;
    color: #888;
}

.route-cell {
    min-width: 150px;
}

.route-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.airport {
    font-weight: 600;
    color: #4a9dd7;
    font-size: 13px;
}

.route-content svg {
    color: #666;
}

.aircraft-cell {
    min-width: 120px;
    font-size: 12px;
    color: #b0b0b0;
}

.altitude-cell {
    min-width: 100px;
    font-family: 'Courier New', monospace;
    font-weight: 600;
}

.status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.status-badge.on-time {
    background: rgb(74 222 128 / 15%);
    color: #4ade80;
    border: 1px solid rgb(74 222 128 / 30%);
}

.status-badge.delayed {
    background: rgb(245 158 11 / 15%);
    color: #f59e0b;
    border: 1px solid rgb(245 158 11 / 30%);
}

.status-badge.boarding {
    background: rgb(59 130 246 / 15%);
    color: #3b82f6;
    border: 1px solid rgb(59 130 246 / 30%);
}

.systems-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    white-space: nowrap;
}

.systems-badge.operational {
    background: rgb(74 222 128 / 15%);
    color: #4ade80;
    border: 1px solid rgb(74 222 128 / 30%);
}

.systems-badge.warning {
    background: rgb(251 191 36 / 15%);
    color: #fbbf24;
    border: 1px solid rgb(251 191 36 / 30%);
}

.systems-badge.critical {
    background: rgb(239 68 68 / 15%);
    color: #ef4444;
    border: 1px solid rgb(239 68 68 / 30%);
}

/* Tracking Cell */
.tracking-cell {
    width: 120px;
    text-align: center;
}

/* Actions Column */
.actions-header {
    width: 80px;
    text-align: center;
}

.actions-cell {
    width: 80px;
    text-align: center;
    padding: 8px 16px;
}

.actions-container {
    display: flex;
    justify-content: center;
}

/* Three-Dot Menu Button */
.menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: rgb(255 255 255 / 7%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(8px);
}

.menu-button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgb(74 157 215 / 0%) 0%, rgb(74 157 215 / 25%) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.menu-button:hover::before {
    opacity: 1;
}

.menu-button.active {
    background: rgb(74 157 215 / 25%);
    border-color: rgb(74 157 215 / 45%);
    transform: rotate(90deg);
}

.menu-button .dot {
    width: 4px;
    height: 4px;
    background: #94a3b8;
    border-radius: 50%;
    box-shadow: 0 0 4px rgb(148 163 184 / 50%);
}

.menu-button:hover .dot,
.menu-button.active .dot {
    background: #4a9dd7;
    box-shadow: 0 0 8px rgb(74 157 215 / 70%);
}

/* Fixed Position Dropdown Menu */
.dropdown-menu-fixed {
    position: fixed;
    background: linear-gradient(135deg, rgb(20 25 30 / 98%) 0%, rgb(15 20 25 / 99%) 100%);
    backdrop-filter: blur(32px) saturate(200%);
    border: 1px solid rgb(74 157 215 / 40%);
    border-radius: 14px;
    box-shadow:
        0 16px 64px rgb(0 0 0 / 80%),
        0 0 0 1px rgb(74 157 215 / 30%),
        inset 0 1px 0 rgb(255 255 255 / 15%);
    z-index: 10000;
    min-width: 200px;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 18px;
    background: transparent;
    border: none;
    color: #e8eef5;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    border-bottom: 1px solid rgb(255 255 255 / 7%);
    position: relative;
    transition: all 0.2s ease;
}

.menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: transparent;
    border-radius: 0 3px 3px 0;
    transition: all 0.2s ease;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item svg {
    color: #60a5fa;
    filter: drop-shadow(0 0 4px rgb(96 165 250 / 40%));
}

.menu-item:hover {
    background: linear-gradient(90deg, rgb(74 157 215 / 18%) 0%, rgb(74 157 215 / 8%) 100%);
    color: #fff;
    transform: translateX(4px);
}

.menu-item:hover::before {
    background: #4a9dd7;
}

.menu-item:hover svg {
    color: #93c5fd;
}

.menu-item.danger {
    color: #fca5a5;
}

.menu-item.danger svg {
    color: #f87171;
    filter: drop-shadow(0 0 4px rgb(248 113 113 / 40%));
}

.menu-item.danger:hover {
    background: linear-gradient(90deg, rgb(220 38 38 / 18%) 0%, rgb(220 38 38 / 8%) 100%);
    color: #fecaca;
}

.menu-item.danger:hover::before {
    background: #dc2626;
}

.menu-item.danger:hover svg {
    color: #fca5a5;
}

/* Menu Overlay */
.menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: transparent;
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

/* Collapsed State */
.expand-btn {
    position: absolute;
    bottom: v-bind(expandButtonBottom);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, rgb(74 157 215 / 30%) 0%, rgb(74 157 215 / 20%) 100%);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgb(74 157 215 / 35%);
    color: #60a5fa;
    padding: 14px 24px;
    border-radius: 28px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 900;
    box-shadow:
        0 8px 24px rgb(0 0 0 / 50%),
        0 0 0 1px rgb(74 157 215 / 20%),
        inset 0 1px 0 rgb(255 255 255 / 12%);
}

.expand-btn:hover {
    background: linear-gradient(135deg, rgb(74 157 215 / 40%) 0%, rgb(74 157 215 / 30%) 100%);
    transform: translateX(-50%) translateY(-3px);
    box-shadow:
        0 12px 32px rgb(0 0 0 / 60%),
        0 0 0 1px rgb(74 157 215 / 30%),
        inset 0 1px 0 rgb(255 255 255 / 15%);
    color: #93c5fd;
}

/* Menu Fade Transition */
.menu-fade-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.menu-fade-enter-to,
.menu-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Keyframe Animations for TCAS Glow Effects */
@keyframes pulse-glow-warning {
    0%, 100% {
        box-shadow: 0 0 15px rgb(234 179 8 / 60%);
    }

    50% {
        box-shadow: 0 0 25px rgb(234 179 8 / 80%);
    }
}

@keyframes pulse-glow-critical {
    0%, 100% {
        box-shadow: 0 0 20px rgb(220 38 38 / 70%);
    }

    50% {
        box-shadow: 0 0 35px rgb(220 38 38 / 90%);
    }
}

/* Dot Animation for Menu Button */
.menu-button .dot {
    animation: dot-float 2s ease-in-out infinite;
}

.menu-button .dot:nth-child(1) {
    animation-delay: 0s;
}

.menu-button .dot:nth-child(2) {
    animation-delay: 0.2s;
}

.menu-button .dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes dot-float {
    0%, 100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
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
    .flights-data-table {
        left: 8px;
        right: 8px;
        bottom: 70px;
        max-height: 280px;
    }

    .table-header {
        padding: 12px 16px;
        flex-wrap: wrap;
    }

    .search-container {
        order: 3;
        width: 100%;
        margin-top: 12px;
        max-width: none;
    }

    .table-title {
        font-size: 13px;
    }

    .view-all-btn {
        padding: 6px 10px;
        font-size: 11px;
    }

    .flights-table th,
    .flights-table td {
        padding: 10px 12px;
        font-size: 12px;
    }

    .flight-cell {
        min-width: 150px;
    }

    .route-cell {
        min-width: 120px;
    }
}
</style>
