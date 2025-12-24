import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    activeView: 'map', // 'map', 'dashboard', 'flights', 'weather', 'analytics', 'settings'
    selectedFlight: null,
    aiPanelVisible: false,
    mapControlsCollapsed: false,
    legendCollapsed: false,
    expandedFlightDetail: null // For analytics module expanded flight
  }),

  getters: {
    // Check if a specific view is active
    isViewActive: (state) => (view) => {
      return state.activeView === view
    },

    // Check if map view is active
    isMapView: (state) => state.activeView === 'map',

    // Check if dashboard view is active
    isDashboardView: (state) => state.activeView === 'dashboard',

    // Check if any flight is selected
    hasSelectedFlight: (state) => state.selectedFlight !== null,

    // Check if AI panel is visible
    isAIPanelVisible: (state) => state.aiPanelVisible
  },

  actions: {
    // Change active view
    changeView(view) {
      this.activeView = view
    },

    // Select a flight
    selectFlight(flight) {
      this.selectedFlight = flight
    },

    // Clear selected flight
    clearSelectedFlight() {
      this.selectedFlight = null
    },

    // Toggle AI panel
    toggleAIPanel() {
      this.aiPanelVisible = !this.aiPanelVisible
    },

    // Open AI panel
    openAIPanel() {
      this.aiPanelVisible = true
    },

    // Close AI panel
    closeAIPanel() {
      this.aiPanelVisible = false
    },

    // Toggle map controls collapsed state
    toggleMapControls() {
      this.mapControlsCollapsed = !this.mapControlsCollapsed
    },

    // Toggle legend collapsed state
    toggleLegend() {
      this.legendCollapsed = !this.legendCollapsed
    },

    // Set expanded flight detail (for analytics module)
    setExpandedFlightDetail(flightName) {
      this.expandedFlightDetail = flightName
    },

    // Clear expanded flight detail
    clearExpandedFlightDetail() {
      this.expandedFlightDetail = null
    },

    // Toggle flight detail expansion
    toggleFlightDetail(flightName) {
      if (this.expandedFlightDetail === flightName) {
        this.expandedFlightDetail = null
      } else {
        this.expandedFlightDetail = flightName
      }
    }
  }
})
