import { defineStore } from 'pinia'
import { flightData, airlines, aircraftModels } from '@shared/data'

export const useFlightsStore = defineStore('flights', {
  state: () => ({
    flights: [...flightData],
    airlines: airlines,
    aircraftModels: aircraftModels,
    animationInterval: null
  }),

  getters: {
    // Get flight by ID
    getFlightById: (state) => (id) => {
      return state.flights.find(flight => flight.id === id)
    },

    // Get flight by name
    getFlightByName: (state) => (name) => {
      return state.flights.find(flight => flight.name === name)
    },

    // Get flights by airline
    getFlightsByAirline: (state) => (airlineCode) => {
      return state.flights.filter(flight => flight.airline === airlineCode)
    },

    // Get flights by status
    getFlightsByStatus: (state) => (statusClass) => {
      return state.flights.filter(flight => flight.statusClass === statusClass)
    },

    // Get total flight count
    flightCount: (state) => state.flights.length,

    // Get flights with bottleneck
    bottleneckFlights: (state) => {
      return state.flights.filter(flight => flight.bottleneck)
    }
  },

  actions: {
    // Update flight progress
    updateFlightProgress(flightId, progress) {
      const flight = this.flights.find(f => f.id === flightId)
      if (flight) {
        flight.progress = progress
      }
    },

    // Update all flight positions (for animation)
    updateAllFlightPositions() {
      this.flights = this.flights.map(flight => {
        let newProgress = flight.progress + flight.speed

        // Reset if completed
        if (newProgress >= 1) {
          newProgress = 0
        }

        return {
          ...flight,
          progress: newProgress
        }
      })
    },

    // Start flight animation
    startFlightAnimation() {
      if (this.animationInterval) {
        return // Already running
      }

      this.animationInterval = setInterval(() => {
        this.updateAllFlightPositions()
      }, 50)
    },

    // Stop flight animation
    stopFlightAnimation() {
      if (this.animationInterval) {
        clearInterval(this.animationInterval)
        this.animationInterval = null
      }
    },

    // Update flight status
    updateFlightStatus(flightId, status, statusClass) {
      const flight = this.flights.find(f => f.id === flightId)
      if (flight) {
        flight.status = status
        flight.statusClass = statusClass
      }
    },

    // Add new flight
    addFlight(flight) {
      this.flights.push(flight)
    },

    // Remove flight
    removeFlight(flightId) {
      const index = this.flights.findIndex(f => f.id === flightId)
      if (index !== -1) {
        this.flights.splice(index, 1)
      }
    }
  }
})
