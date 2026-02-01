<template>
    <div class="report-section">
        <h2 class="report-section-header">
            <slot name="icon">
                <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
            </slot>
            <span>{{ title }}</span>
        </h2>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ReportSection',
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
.report-section {
    background: linear-gradient(135deg, rgb(42 42 42 / 80%) 0%, rgb(31 31 31 / 80%) 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid rgb(255 255 255 / 8%);
    box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.report-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgb(74 157 215 / 5%), transparent);
    pointer-events: none;
}

.report-section:hover {
    border-color: rgb(74 157 215 / 20%);
    box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

.report-section-header {
    font-size: 20px;
    margin: 0 0 20px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
    line-height: 1.3;
    font-weight: 700;
    letter-spacing: -0.3px;
}

.report-section-header svg {
    color: #4a9dd7;
    flex-shrink: 0;
}

.report-section-header span {
    flex: 1;
}
</style>
