import { reactive } from 'vue';

const STORAGE_KEY = 'aerospace_usage_metrics';

class UsageTracker {
    constructor() {
        this.metrics = reactive({
            sessionId: this.generateSessionId(),
            sessionStart: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            totalSessions: 0,
            viewChanges: {
                dashboard: 0,
                map: 0,
                weather: 0,
                analytics: 0,
                settings: 0
            },
            featureUsage: {
                flightClicks: 0,
                aiPanelOpens: 0,
                exportActions: 0
            },
            timeSpent: {
                dashboard: 0,
                map: 0,
                weather: 0,
                analytics: 0,
                settings: 0
            },
            currentView: null,
            viewStartTime: null,
            history: []
        });

        this.loadMetrics();
        this.startSession();
        this.setupAutoSave();
    }

    // eslint-disable-next-line class-methods-use-this
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    loadMetrics() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
        // Merge with existing structure to maintain reactivity
                Object.assign(this.metrics, {
                    ...data,
                    sessionId: this.generateSessionId(),
                    sessionStart: new Date().toISOString(),
                    currentView: null,
                    viewStartTime: null
                });
            }
        } catch (error) {
            console.error('Failed to load usage metrics:', error);
        }
    }

    saveMetrics() {
        try {
            this.metrics.lastUpdated = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.metrics));
        } catch (error) {
            console.error('Failed to save usage metrics:', error);
        }
    }

    setupAutoSave() {
    // Auto-save every 10 seconds
        setInterval(() => {
            this.saveMetrics();
        }, 10000);

    // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.endSession();
            this.saveMetrics();
        });
    }

    startSession() {
        this.metrics.totalSessions++;
        this.addHistoryEntry('session_start', { sessionId: this.metrics.sessionId });
    }

    endSession() {
        if (this.metrics.currentView && this.metrics.viewStartTime) {
            this.updateTimeSpent(this.metrics.currentView);
        }
        this.addHistoryEntry('session_end', {
            sessionId: this.metrics.sessionId,
            duration: Date.now() - new Date(this.metrics.sessionStart).getTime()
        });
    }

    trackViewChange(view) {
    // Update time spent on previous view
        if (this.metrics.currentView && this.metrics.viewStartTime) {
            this.updateTimeSpent(this.metrics.currentView);
        }

    // Track new view
        if (this.metrics.viewChanges[view] !== undefined) {
            this.metrics.viewChanges[view]++;
        }

        this.metrics.currentView = view;
        this.metrics.viewStartTime = Date.now();

        this.addHistoryEntry('view_change', { view });
        this.saveMetrics();
    }

    updateTimeSpent(view) {
        if (this.metrics.viewStartTime && this.metrics.timeSpent[view] !== undefined) {
            const timeSpent = Date.now() - this.metrics.viewStartTime;
            this.metrics.timeSpent[view] += timeSpent;
        }
    }

    trackFlightClick(flightId) {
        this.metrics.featureUsage.flightClicks++;
        this.addHistoryEntry('flight_click', { flightId });
        this.saveMetrics();
    }

    trackAIPanelOpen() {
        this.metrics.featureUsage.aiPanelOpens++;
        this.addHistoryEntry('ai_panel_open');
        this.saveMetrics();
    }

    trackExportAction(format) {
        this.metrics.featureUsage.exportActions++;
        this.addHistoryEntry('export_action', { format });
        this.saveMetrics();
    }

    addHistoryEntry(action, data = {}) {
        this.metrics.history.push({
            timestamp: new Date().toISOString(),
            action,
            ...data
        });

    // Keep only last 100 history entries
        if (this.metrics.history.length > 100) {
            this.metrics.history.shift();
        }
    }

    getMetrics() {
        return this.metrics;
    }

    clearMetrics() {
        localStorage.removeItem(STORAGE_KEY);
    // Reset metrics
        this.metrics.totalSessions = 0;
        this.metrics.viewChanges = {
            dashboard: 0,
            map: 0,
            weather: 0,
            analytics: 0,
            settings: 0
        };
        this.metrics.featureUsage = {
            flightClicks: 0,
            aiPanelOpens: 0,
            exportActions: 0
        };
        this.metrics.timeSpent = {
            dashboard: 0,
            map: 0,
            weather: 0,
            analytics: 0,
            settings: 0
        };
        this.metrics.history = [];
        this.saveMetrics();
    }

    exportToJSON() {
        return JSON.stringify(this.metrics, null, 2);
    }

    exportToCSV() {
        const lines = [];

    // Header
        lines.push('Aerospace Control - Usage Metrics Report');
        lines.push(`Generated: ${new Date().toISOString()}`);
        lines.push('');

    // Session Info
        lines.push('Session Information');
        lines.push('Field,Value');
        lines.push(`Session ID,${this.metrics.sessionId}`);
        lines.push(`Session Start,${this.metrics.sessionStart}`);
        lines.push(`Total Sessions,${this.metrics.totalSessions}`);
        lines.push('');

    // View Changes
        lines.push('View Changes');
        lines.push('View,Count');
        Object.entries(this.metrics.viewChanges).forEach(([view, count]) => {
            lines.push(`${view},${count}`);
        });
        lines.push('');

    // Time Spent (convert to minutes)
        lines.push('Time Spent (minutes)');
        lines.push('View,Minutes');
        Object.entries(this.metrics.timeSpent).forEach(([view, ms]) => {
            lines.push(`${view},${(ms / 60000).toFixed(2)}`);
        });
        lines.push('');

    // Feature Usage
        lines.push('Feature Usage');
        lines.push('Feature,Count');
        Object.entries(this.metrics.featureUsage).forEach(([feature, count]) => {
            lines.push(`${feature},${count}`);
        });
        lines.push('');

    // Recent History
        lines.push('Recent Activity History');
        lines.push('Timestamp,Action,Details');
        this.metrics.history.slice(-20).forEach((entry) => {
            const details = Object.entries(entry)
        .filter(([key]) => key !== 'timestamp' && key !== 'action')
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
            lines.push(`${entry.timestamp},${entry.action},${details}`);
        });

        return lines.join('\n');
    }

    exportToText() {
        const lines = [];

        lines.push('='.repeat(60));
        lines.push('AEROSPACE CONTROL - USAGE METRICS REPORT');
        lines.push('='.repeat(60));
        lines.push('');
        lines.push(`Generated: ${new Date().toISOString()}`);
        lines.push('');

    // Session Info
        lines.push('SESSION INFORMATION');
        lines.push('-'.repeat(60));
        lines.push(`Session ID: ${this.metrics.sessionId}`);
        lines.push(`Session Start: ${this.metrics.sessionStart}`);
        lines.push(`Total Sessions: ${this.metrics.totalSessions}`);
        lines.push('');

    // View Changes
        lines.push('VIEW CHANGES');
        lines.push('-'.repeat(60));
        Object.entries(this.metrics.viewChanges).forEach(([view, count]) => {
            lines.push(`${view.padEnd(20)}: ${count}`);
        });
        lines.push('');

    // Time Spent
        lines.push('TIME SPENT');
        lines.push('-'.repeat(60));
        Object.entries(this.metrics.timeSpent).forEach(([view, ms]) => {
            const minutes = (ms / 60000).toFixed(2);
            lines.push(`${view.padEnd(20)}: ${minutes} minutes`);
        });
        lines.push('');

    // Feature Usage
        lines.push('FEATURE USAGE');
        lines.push('-'.repeat(60));
        Object.entries(this.metrics.featureUsage).forEach(([feature, count]) => {
            lines.push(`${feature.padEnd(20)}: ${count}`);
        });
        lines.push('');

    // Recent Activity
        lines.push('RECENT ACTIVITY (Last 20 events)');
        lines.push('-'.repeat(60));
        this.metrics.history.slice(-20).forEach((entry) => {
            const details = Object.entries(entry)
        .filter(([key]) => key !== 'timestamp' && key !== 'action')
        .map(([key, value]) => `${key}:${value}`)
        .join(', ');
            lines.push(`[${entry.timestamp}] ${entry.action}${details ? ` - ${details}` : ''}`);
        });
        lines.push('');
        lines.push('='.repeat(60));

        return lines.join('\n');
    }

    // eslint-disable-next-line class-methods-use-this
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    exportMetrics(format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let content; let filename; let
mimeType;

        switch (format) {
            case 'json':
                content = this.exportToJSON();
                filename = `aerospace-usage-${timestamp}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.exportToCSV();
                filename = `aerospace-usage-${timestamp}.csv`;
                mimeType = 'text/csv';
                break;
            case 'txt':
                content = this.exportToText();
                filename = `aerospace-usage-${timestamp}.txt`;
                mimeType = 'text/plain';
                break;
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }

        this.downloadFile(content, filename, mimeType);
        this.trackExportAction(format);
    }
}

// Singleton instance
let trackerInstance = null;

export function useUsageTracking() {
    if (!trackerInstance) {
        trackerInstance = new UsageTracker();
    }
    return trackerInstance;
}
