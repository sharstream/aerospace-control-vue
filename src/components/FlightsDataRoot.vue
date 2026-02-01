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
            <Motion
                tag="button"
                class="collapse-btn"
                title="Close Flights Table"
                :whileHover="{ scale: 1.1, rotate: 90 }"
                :whileTap="{ scale: 0.95 }"
                :transition="{ type: 'spring', stiffness: 400, damping: 15 }"
                @click="collapsed = true"
            >
                <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </Motion>
        </div>

        <DataTableFlight
            :filteredFlights="filteredFlights"
            :airlines="airlines"
            :trackedAircraft="trackedAircraft"
            :selectedFlight="selectedFlight"
            :tcasAlerts="tcasAlerts"
            :openMenuFlight="openMenuFlight"
            @flight-click="handleFlightClick"
            @track-aircraft="handleTrack"
            @untrack-aircraft="handleUntrack"
            @toggle-menu="toggleMenu"
        />
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
import DataTableFlight from './flights/DataTableFlight.vue';

export default {
    name: 'FlightsDataRoot',
    components: {
        Motion,
        DataTableFlight
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
    background: linear-gradient(135deg, rgb(20 25 30 / 98%) 0%, rgb(15 20 25 / 99%) 100%);
    backdrop-filter: blur(32px) saturate(200%);
    border: 1px solid rgb(74 157 215 / 40%);
    color: #e8eef5;
    padding: 6px 26px 6px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
        0 8px 16px rgb(0 0 0 / 50%),
        0 0 0 1px rgb(74 157 215 / 30%),
        inset 0 1px 0 rgb(255 255 255 / 15%);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23e8eef5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
}

.search-filter:hover {
    background: linear-gradient(135deg, rgb(25 30 35 / 98%) 0%, rgb(20 25 30 / 99%) 100%);
    border-color: rgb(74 157 215 / 50%);
    box-shadow:
        0 12px 24px rgb(0 0 0 / 60%),
        0 0 0 1px rgb(74 157 215 / 40%),
        inset 0 1px 0 rgb(255 255 255 / 18%);
    transform: translateY(-1px);
    color: #fff;
}

.search-filter:focus {
    background: linear-gradient(135deg, rgb(25 30 35 / 98%) 0%, rgb(20 25 30 / 99%) 100%);
    border-color: rgb(74 157 215 / 60%);
    box-shadow:
        0 12px 24px rgb(74 157 215 / 30%),
        0 0 0 1px rgb(74 157 215 / 50%),
        inset 0 1px 0 rgb(255 255 255 / 18%);
    color: #fff;
}

.search-filter option {
    background: linear-gradient(135deg, rgb(20 25 30 / 98%) 0%, rgb(15 20 25 / 99%) 100%);
    color: #e8eef5;
    padding: 14px 18px;
    font-size: 13px;
    font-weight: 500;
    border-bottom: 1px solid rgb(255 255 255 / 7%);
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
    background: rgb(255 255 255 / 8%);
    border: 1px solid rgb(148 163 184 / 20%);
    color: rgb(226 232 240 / 90%);
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 20%);
    will-change: transform;
}

.collapse-btn:hover {
    background: rgb(239 68 68 / 90%);
    color: white;
    border-color: rgb(239 68 68);
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
}
</style>
