import { defineStore } from 'pinia';
import { weatherHazards } from '@shared/data';

export const useWeatherStore = defineStore('weather', {
    state: () => ({
        weatherHazards
    }),

    getters: {
    // Get hazard by ID
        getHazardById: state => id => state.weatherHazards.find(hazard => hazard.id === id),

    // Get hazards by type
        getHazardsByType: state => type => state.weatherHazards.filter(hazard => hazard.type === type),

    // Get hazards by severity
        getHazardsBySeverity: state => severity => state.weatherHazards.filter(hazard => hazard.severity === severity),

    // Get total hazard count
        hazardCount: state => state.weatherHazards.length,

    // Get active hazards
        activeHazards: state => state.weatherHazards.filter(hazard => hazard.active !== false)
    },

    actions: {
    // Add new weather hazard
        addHazard(hazard) {
            this.weatherHazards.push(hazard);
        },

    // Remove weather hazard
        removeHazard(hazardId) {
            const index = this.weatherHazards.findIndex(h => h.id === hazardId);
            if (index !== -1) {
                this.weatherHazards.splice(index, 1);
            }
        },

    // Update hazard severity
        updateHazardSeverity(hazardId, severity) {
            const hazard = this.weatherHazards.find(h => h.id === hazardId);
            if (hazard) {
                hazard.severity = severity;
            }
        },

    // Toggle hazard active status
        toggleHazardActive(hazardId) {
            const hazard = this.weatherHazards.find(h => h.id === hazardId);
            if (hazard) {
                hazard.active = !hazard.active;
            }
        }
    }
});
