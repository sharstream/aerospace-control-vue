<template>
    <tr
        :class="[
            'flight-row',
            {
                'selected': isSelected,
                'tcas-stable': tcasAlert === 'stable',
                'tcas-warning': tcasAlert === 'warning',
                'tcas-critical': tcasAlert === 'critical'
            }
        ]"
        @click="handleClick"
    >
        <td class="severity-cell">
            <div
                v-if="tcasAlert"
                class="severity-indicator"
                :class="`severity-${tcasAlert}`"
                :title="tcasAlert === 'stable' ? 'Normal Separation' : tcasAlert === 'warning' ? 'Caution - Close Proximity' : 'Critical - Immediate Danger'"
            >
                <svg
                    v-if="tcasAlert === 'stable'"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                >
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <svg
                    v-else-if="tcasAlert === 'warning'"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                >
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                <svg
                    v-else-if="tcasAlert === 'critical'"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            </div>
        </td>
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
                :isTracked="isTracked"
                @track="$emit('track', flight)"
                @untrack="$emit('untrack', flight)"
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
            <FlightActions
                :flight="flight"
                :isOpen="isMenuOpen"
                @toggle-menu="handleMenuToggle"
            />
        </td>
    </tr>
</template>

<script>
import FlightsTrackingPill from '../FlightsTrackingPill.vue';
import FlightActions from './FlightActions.vue';

export default {
    name: 'FlightRow',
    components: {
        FlightsTrackingPill,
        FlightActions
    },
    props: {
        flight: {
            type: Object,
            required: true
        },
        airlines: {
            type: Object,
            required: true
        },
        isSelected: {
            type: Boolean,
            default: false
        },
        isTracked: {
            type: Boolean,
            default: false
        },
        tcasAlert: {
            type: String,
            default: null,
            validator: (value) => [null, 'stable', 'warning', 'critical'].includes(value)
        },
        isMenuOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click', 'track', 'untrack', 'toggle-menu'],
    methods: {
        handleClick() {
            this.$emit('click', this.flight);
        },
        handleMenuToggle(flight, event) {
            this.$emit('toggle-menu', flight, event);
        }
    }
};
</script>

<style scoped>
.flight-row {
    border-bottom: 1px solid rgb(255 255 255 / 6%);
    cursor: pointer;
    position: relative;
    transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.flight-row::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 6px;
    background: transparent;
    border-radius: 0 3px 3px 0;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover state - works for all rows - More vibrant accent */
.flight-row:hover {
    background: linear-gradient(90deg, var(--sky-4) 0%, var(--blue-3) 100%) !important;
    transform: translateX(2px);
}

.flight-row:hover::before {
    box-shadow: 0 0 16px var(--sky-7);
}

/* Selected Row - Strong accent for visibility */
.flight-row.selected {
    background: linear-gradient(90deg, var(--blue-5) 0%, var(--blue-4) 100%);
    border-left: 4px solid var(--blue-9);
    box-shadow: inset 0 0 30px var(--blue-6);
}

.flight-row.selected::before {
    background: linear-gradient(180deg, var(--blue-9) 0%, var(--blue-10) 100%);
    box-shadow: 0 0 20px var(--blue-8), inset 0 0 8px rgb(255 255 255 / 30%);
}

/* TCAS Stable State - Blue (Normal operations) - Radix Colors */
.flight-row.tcas-stable {
    background: linear-gradient(90deg, var(--blue-4) 0%, var(--blue-3) 100%);
    border-left: 4px solid var(--blue-9);
}

.flight-row.tcas-stable::before {
    background: linear-gradient(180deg, var(--blue-9) 0%, var(--blue-10) 100%);
    box-shadow: 0 0 16px var(--blue-8);
}

/* TCAS Warning State - Amber (Caution) - Radix Colors */
.flight-row.tcas-warning {
    background: linear-gradient(90deg, var(--amber-4) 0%, var(--amber-3) 100%);
    border-left: 4px solid var(--amber-9);
}

.flight-row.tcas-warning::before {
    background: linear-gradient(180deg, var(--amber-9) 0%, var(--amber-10) 100%);
    box-shadow: 0 0 18px var(--amber-8);
    animation: pulse-glow-warning 2s ease-in-out infinite;
}

/* TCAS Critical State - Red (Immediate danger) - Radix Colors */
.flight-row.tcas-critical {
    background: linear-gradient(90deg, var(--red-5) 0%, var(--red-4) 100%);
    border-left: 6px solid var(--red-9);
}

.flight-row.tcas-critical::before {
    background: linear-gradient(180deg, var(--red-9) 0%, var(--red-10) 100%);
    box-shadow: 0 0 24px var(--red-8);
    animation: pulse-glow-critical 1.2s ease-in-out infinite;
    width: 6px;
}

/* Flight Cell */
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
    box-shadow: 0 2px 8px rgb(0 0 0 / 40%);
}

.flight-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.flight-number {
    font-size: 14px;
    font-weight: 700;
    color: #e0e7f0;
    text-shadow: 0 1px 3px rgb(0 0 0 / 40%);
}

.airline-name {
    font-size: 11px;
    color: #a8b5c7;
    text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
}

/* Route Cell */
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
    color: #7dd3fc;
    font-size: 13px;
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
}

.route-content svg {
    color: #94a3b8;
}

/* Aircraft Cell */
.aircraft-cell {
    min-width: 120px;
    font-size: 12px;
    color: #cbd5e1;
    font-weight: 500;
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
}

/* Altitude Cell */
.altitude-cell {
    min-width: 100px;
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #e0e7f0;
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
}

/* Tracking Cell */
.tracking-cell {
    width: 120px;
    text-align: center;
}

/* Severity Cell */
.severity-cell {
    width: 70px;
    text-align: center;
    padding: 12px 8px;
}

.severity-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgb(255 255 255 / 95%);
    cursor: help;
}

.severity-indicator.severity-stable {
    color: var(--blue-9);
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%), 0 0 0 1px var(--blue-6);
}

.severity-indicator.severity-warning {
    color: var(--amber-9);
    box-shadow: 0 2px 10px rgb(0 0 0 / 20%), 0 0 0 2px var(--amber-7);
    animation: pulse-warning 2s ease-in-out infinite;
}

.severity-indicator.severity-critical {
    color: var(--red-9);
    box-shadow: 0 2px 12px rgb(0 0 0 / 25%), 0 0 0 2px var(--red-7);
    animation: pulse-critical 1.2s ease-in-out infinite;
}

@keyframes pulse-warning {
    0%, 100% {
        box-shadow: 0 2px 10px rgb(0 0 0 / 20%), 0 0 0 2px var(--amber-7);
    }

    50% {
        box-shadow: 0 4px 16px rgb(234 179 8 / 40%), 0 0 0 2px var(--amber-8);
    }
}

@keyframes pulse-critical {
    0%, 100% {
        box-shadow: 0 2px 12px rgb(0 0 0 / 25%), 0 0 0 2px var(--red-7);
    }

    50% {
        box-shadow: 0 4px 20px rgb(220 38 38 / 50%), 0 0 0 3px var(--red-8);
    }
}

/* Actions Cell */
.actions-cell {
    width: 80px;
    text-align: center;
    padding: 8px 16px;
}

/* Status Badges */
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
    background: var(--green-3);
    color: var(--green-11);
    border: 1px solid var(--green-7);
    box-shadow: 0 0 8px var(--green-4);
}

.status-badge.delayed {
    background: var(--amber-3);
    color: var(--amber-11);
    border: 1px solid var(--amber-7);
    box-shadow: 0 0 8px var(--amber-4);
}

.status-badge.boarding {
    background: var(--sky-3);
    color: var(--sky-11);
    border: 1px solid var(--sky-7);
    box-shadow: 0 0 8px var(--sky-4);
}

/* Systems Badges */
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
    background: var(--green-3);
    color: var(--green-11);
    border: 1px solid var(--green-7);
    box-shadow: 0 0 6px var(--green-4);
}

.systems-badge.warning {
    background: var(--amber-3);
    color: var(--amber-11);
    border: 1px solid var(--amber-7);
    box-shadow: 0 0 6px var(--amber-4);
}

.systems-badge.critical {
    background: var(--red-3);
    color: var(--red-11);
    border: 1px solid var(--red-7);
    box-shadow: 0 0 6px var(--red-4);
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
</style>
