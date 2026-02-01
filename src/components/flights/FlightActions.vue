<template>
    <!-- Three-Dot Menu Button -->
    <div class="actions-container">
        <button
            class="menu-button"
            :class="{ 'active': isOpen }"
            @click="handleToggle"
        >
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'FlightActions',
    props: {
        flight: {
            type: Object,
            required: true
        },
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    emits: ['toggle-menu'],
    methods: {
        handleToggle(event) {
            event.stopPropagation();
            this.$emit('toggle-menu', this.flight, event);
        }
    }
};
</script>

<style scoped>
/* Actions Column */
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

.menu-button:hover .dot,
.menu-button.active .dot {
    background: #4a9dd7;
    box-shadow: 0 0 8px rgb(74 157 215 / 70%);
}

@keyframes dot-float {
    0%, 100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-3px);
    }
}
</style>
