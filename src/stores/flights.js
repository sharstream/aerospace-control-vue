import { defineStore } from 'pinia';
import { flightData, airlines, aircraftModels } from '@shared/data';
import { fetchAirspaceData, transformAircraftData, checkApiHealth } from '@/services/api';

export const useFlightsStore = defineStore('flights', {
    state: () => ({
        flights: [...flightData],
        airlines,
        aircraftModels,
        animationInterval: null,
        refreshInterval: null,
        useRealData: false,
        isLoading: false,
        apiStatus: 'unknown',
        lastUpdate: null,
        error: null,
        errorType: null,
        rateLimitInfo: {
            remaining: null,
            retryAfterSeconds: null
        },
        countdownSeconds: null,
        countdownInterval: null
    }),

    getters: {
        // Get flight by ID
        getFlightById: state => id => state.flights.find(flight => flight.id === id),

        // Get flight by name
        getFlightByName: state => name => state.flights.find(flight => flight.name === name),

        // Get flights by airline
        getFlightsByAirline: state => airlineCode => state.flights.filter(flight => flight.airline === airlineCode),

        // Get flights by status
        getFlightsByStatus: state => statusClass => state.flights.filter(flight => flight.statusClass === statusClass),

        // Get total flight count
        flightCount: state => state.flights.length,

        // Get flights with bottleneck
        bottleneckFlights: state => state.flights.filter(flight => flight.bottleneck),

        // Check if using real-time data
        isUsingRealData: state => state.useRealData,

        // Get API connection status
        getApiStatus: state => state.apiStatus
    },

    actions: {
        // Update flight progress
        updateFlightProgress(flightId, progress) {
            const flight = this.flights.find(f => f.id === flightId);
            if (flight) {
                flight.progress = progress;
            }
        },

        // Update all flight positions (for animation)
        updateAllFlightPositions() {
            this.flights = this.flights.map((flight) => {
                let newProgress = flight.progress + flight.speed;

                // Reset if completed
                if (newProgress >= 1) {
                    newProgress = 0;
                }

                return {
                    ...flight,
                    progress: newProgress
                };
            });
        },

        // Start flight animation
        startFlightAnimation() {
            if (this.animationInterval) {
                return; // Already running
            }

            this.animationInterval = setInterval(() => {
                this.updateAllFlightPositions();
            }, 50);
        },

        // Stop flight animation
        stopFlightAnimation() {
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
        },

        // Update flight status
        updateFlightStatus(flightId, status, statusClass) {
            const flight = this.flights.find(f => f.id === flightId);
            if (flight) {
                flight.status = status;
                flight.statusClass = statusClass;
            }
        },

        // Add new flight
        addFlight(flight) {
            this.flights.push(flight);
        },

        // Remove flight
        removeFlight(flightId) {
            const index = this.flights.findIndex(f => f.id === flightId);
            if (index !== -1) {
                this.flights.splice(index, 1);
            }
        },

        // Check API health status
        async checkApiConnection() {
            try {
                const health = await checkApiHealth();
                this.apiStatus = health.status === 'operational' ? 'connected' : 'error';
                return true;
            } catch (error) {
                this.apiStatus = 'disconnected';
                console.error('API connection check failed:', error);
                return false;
            }
        },

        // Start countdown timer for rate limit retry
        startRateLimitCountdown(seconds) {
            // Clear existing countdown if any
            this.stopRateLimitCountdown();

            this.countdownSeconds = seconds;

            this.countdownInterval = setInterval(() => {
                this.countdownSeconds -= 1;

                if (this.countdownSeconds <= 0) {
                    this.stopRateLimitCountdown();
                    // Automatically retry fetching data when countdown reaches 0
                    if (this.useRealData) {
                        this.fetchRealTimeData();
                    }
                }
            }, 1000);
        },

        // Stop countdown timer
        stopRateLimitCountdown() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            this.countdownSeconds = null;
        },

        // Fetch real-time aircraft data from backend
        async fetchRealTimeData() {
            if (!this.useRealData) {
                return;
            }

            this.isLoading = true;
            this.error = null;
            this.errorType = null;

            try {
                const responseData = await fetchAirspaceData(50);
                const transformedFlights = transformAircraftData(responseData);

                // Preserve progress values for smooth animation
                const updatedFlights = transformedFlights.map((newFlight) => {
                    const existingFlight = this.flights.find(f => f.icao24 === newFlight.icao24);
                    if (existingFlight) {
                        return {
                            ...newFlight,
                            progress: existingFlight.progress,
                            speed: existingFlight.speed
                        };
                    }
                    return newFlight;
                });

                this.flights = updatedFlights;
                this.lastUpdate = new Date();
                this.apiStatus = 'connected';

                // Update rate limit info from successful response
                if (responseData.rateLimit) {
                    this.rateLimitInfo = {
                        remaining: responseData.rateLimit.remaining,
                        retryAfterSeconds: responseData.rateLimit.retryAfterSeconds
                    };
                }

                // Stop countdown if it was running (successful request)
                this.stopRateLimitCountdown();
            } catch (error) {
                console.error('Failed to fetch real-time data:', error);

                // Parse error type from backend response
                if (error.errorType) {
                    this.errorType = error.errorType;
                    // Map error types to specific status
                    if (error.errorType === 'RATE_LIMIT') {
                        this.apiStatus = 'rate_limited';

                        // Extract rate limit info from error
                        if (error.rateLimit) {
                            this.rateLimitInfo = {
                                remaining: error.rateLimit.remaining,
                                retryAfterSeconds: error.rateLimit.retryAfterSeconds
                            };

                            // Start countdown timer if retry after seconds is available
                            if (error.rateLimit.retryAfterSeconds) {
                                this.startRateLimitCountdown(error.rateLimit.retryAfterSeconds);
                            }
                        }
                    } else if (error.errorType === 'CONNECTION_ERROR') {
                        this.apiStatus = 'connection_error';
                    } else {
                        this.apiStatus = 'error';
                    }
                } else {
                    this.apiStatus = 'error';
                    this.errorType = 'UNKNOWN';
                }

                this.error = error.message;

                // Fall back to mock data if real data fails
                if (this.flights.length === 0) {
                    this.flights = [...flightData];
                }
            } finally {
                this.isLoading = false;
            }
        },

        // Toggle between real and mock data
        async toggleDataSource() {
            this.useRealData = !this.useRealData;

            if (this.useRealData) {
                // Check API connection first
                const isConnected = await this.checkApiConnection();

                if (!isConnected) {
                    this.useRealData = false;
                    throw new Error('Cannot connect to SkySentinel API. Please ensure the backend is running.');
                }

                // Fetch initial data
                await this.fetchRealTimeData();
            } else {
                // Stop refresh and revert to mock data
                if (this.refreshInterval) {
                    clearInterval(this.refreshInterval);
                    this.refreshInterval = null;
                }
                this.flights = [...flightData];
                this.apiStatus = 'disconnected';
            }
        },

        // Start using real-time data
        async enableRealTimeData() {
            if (!this.useRealData) {
                await this.toggleDataSource();
            }
        },

        // Switch back to mock data
        disableRealTimeData() {
            if (this.useRealData) {
                this.toggleDataSource();
            }
        },

        // Clean up intervals on store disposal
        cleanup() {
            this.stopFlightAnimation();
            this.stopRateLimitCountdown();
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    }
});
