/**
 * Real-Time Aircraft Trajectory Tracker
 *
 * Builds flight trajectories over time by polling aircraft positions
 * and storing historical waypoints in memory.
 *
 * Usage:
 *   const tracker = new TrajectoryTracker();
 *   await tracker.startTracking('aae316'); // Start tracking aircraft
 *   const trajectory = tracker.getTrajectory('aae316'); // Get collected points
 *   tracker.stopTracking('aae316'); // Stop tracking
 */

import { fetchAircraftStates } from './api';

export class TrajectoryTracker {
  constructor(options = {}) {
    this.trajectories = new Map(); // icao24 -> array of positions
    this.trackingIntervals = new Map(); // icao24 -> interval ID
    this.pollInterval = options.pollInterval || 45000; // 45 seconds (matches cache TTL)
    this.maxPoints = options.maxPoints || 1000; // Maximum points per trajectory
    this.onUpdate = options.onUpdate || null; // Callback when trajectory updates
  }

  /**
   * Start tracking an aircraft in real-time
   * @param {string} icao24 - ICAO24 address of aircraft
   * @returns {Promise<void>}
   */
  async startTracking(icao24) {
    // If already tracking, stop first
    if (this.trackingIntervals.has(icao24)) {
      this.stopTracking(icao24);
    }

    // Initialize trajectory array
    if (!this.trajectories.has(icao24)) {
      this.trajectories.set(icao24, []);
    }

    // Fetch initial position immediately
    await this.updatePosition(icao24);

    // Set up polling interval
    const intervalId = setInterval(async () => {
      await this.updatePosition(icao24);
    }, this.pollInterval);

    this.trackingIntervals.set(icao24, intervalId);

    console.log(`📡 Started tracking aircraft ${icao24} (polling every ${this.pollInterval / 1000}s)`);
  }

  /**
   * Stop tracking an aircraft
   * @param {string} icao24 - ICAO24 address of aircraft
   */
  stopTracking(icao24) {
    const intervalId = this.trackingIntervals.get(icao24);
    if (intervalId) {
      clearInterval(intervalId);
      this.trackingIntervals.delete(icao24);
      console.log(`⏹️  Stopped tracking aircraft ${icao24}`);
    }
  }

  /**
   * Stop tracking all aircraft
   */
  stopAllTracking() {
    this.trackingIntervals.forEach((intervalId, icao24) => {
      clearInterval(intervalId);
      console.log(`⏹️  Stopped tracking aircraft ${icao24}`);
    });
    this.trackingIntervals.clear();
  }

  /**
   * Update position for a tracked aircraft
   * @param {string} icao24 - ICAO24 address of aircraft
   * @private
   */
  async updatePosition(icao24) {
    try {
      const data = await fetchAircraftStates(icao24);

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const coords = feature.geometry.coordinates; // [lon, lat]
        const props = feature.properties;

        this.addPosition(icao24, [coords[1], coords[0]], { // Convert to [lat, lon]
          altitude: props.altitude,
          heading: props.heading,
          velocity: props.velocity,
          vertical_rate: props.vertical_rate,
          on_ground: props.on_ground,
          callsign: props.callsign
        });
      } else {
        console.warn(`⚠️  No data found for aircraft ${icao24}`);
      }
    } catch (error) {
      console.error(`❌ Error updating position for ${icao24}:`, error);
    }
  }

  /**
   * Add a position waypoint to aircraft trajectory
   * @param {string} icao24 - ICAO24 address
   * @param {Array} position - [latitude, longitude]
   * @param {Object} metadata - Additional data (altitude, heading, velocity, etc.)
   */
  addPosition(icao24, position, metadata = {}) {
    if (!this.trajectories.has(icao24)) {
      this.trajectories.set(icao24, []);
    }

    const trajectory = this.trajectories.get(icao24);

    // Check if position has changed (avoid duplicates)
    const lastPoint = trajectory[trajectory.length - 1];
    if (lastPoint
        && lastPoint.position[0] === position[0]
        && lastPoint.position[1] === position[1]) {
      console.log(`🔄 Position unchanged for ${icao24}, skipping duplicate`);
      return;
    }

    const waypoint = {
      time: Date.now(),
      position, // [lat, lon]
      altitude: metadata.altitude,
      heading: metadata.heading,
      velocity: metadata.velocity,
      vertical_rate: metadata.vertical_rate,
      on_ground: metadata.on_ground,
      callsign: metadata.callsign
    };

    trajectory.push(waypoint);

    // Trim trajectory if it exceeds max points
    if (trajectory.length > this.maxPoints) {
      trajectory.shift(); // Remove oldest point
    }

    console.log(`✈️  ${icao24}: Added waypoint #${trajectory.length} at [${position[0].toFixed(4)}, ${position[1].toFixed(4)}]`);

    // Call update callback if provided
    if (this.onUpdate) {
      this.onUpdate(icao24, waypoint, trajectory);
    }
  }

  /**
   * Get trajectory for a specific aircraft
   * @param {string} icao24 - ICAO24 address
   * @returns {Array} Array of waypoints
   */
  getTrajectory(icao24) {
    return this.trajectories.get(icao24) || [];
  }

  /**
   * Get all tracked aircraft
   * @returns {Array} Array of ICAO24 addresses
   */
  getTrackedAircraft() {
    return Array.from(this.trajectories.keys());
  }

  /**
   * Check if aircraft is being tracked
   * @param {string} icao24 - ICAO24 address
   * @returns {boolean}
   */
  isTracking(icao24) {
    return this.trackingIntervals.has(icao24);
  }

  /**
   * Export trajectory as GeoJSON LineString
   * @param {string} icao24 - ICAO24 address
   * @returns {Object} GeoJSON Feature
   */
  exportAsGeoJSON(icao24) {
    const points = this.getTrajectory(icao24);

    if (points.length === 0) {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        },
        properties: {
          icao24,
          waypoint_count: 0,
          duration: 0,
          message: 'No trajectory data available'
        }
      };
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points.map(p => [p.position[1], p.position[0], p.altitude || 0]) // [lon, lat, alt]
      },
      properties: {
        icao24,
        callsign: points[points.length - 1].callsign,
        waypoint_count: points.length,
        duration: points[points.length - 1].time - points[0].time,
        start_time: points[0].time,
        end_time: points[points.length - 1].time,
        max_altitude: Math.max(...points.map(p => p.altitude || 0)),
        min_altitude: Math.min(...points.filter(p => p.altitude).map(p => p.altitude)),
        avg_velocity: points.reduce((sum, p) => sum + (p.velocity || 0), 0) / points.length
      },
      waypoints: points
    };
  }

  /**
   * Export all trajectories as GeoJSON FeatureCollection
   * @returns {Object} GeoJSON FeatureCollection
   */
  exportAllAsGeoJSON() {
    const features = Array.from(this.trajectories.keys()).map(icao24 => (
      this.exportAsGeoJSON(icao24)
    ));

    return {
      type: 'FeatureCollection',
      features,
      metadata: {
        total_aircraft: features.length,
        total_waypoints: features.reduce((sum, f) => sum + f.properties.waypoint_count, 0)
      }
    };
  }

  /**
   * Clear trajectory for a specific aircraft
   * @param {string} icao24 - ICAO24 address
   */
  clearTrajectory(icao24) {
    this.trajectories.delete(icao24);
    console.log(`🗑️  Cleared trajectory for ${icao24}`);
  }

  /**
   * Clear all trajectories
   */
  clearAllTrajectories() {
    this.trajectories.clear();
    console.log('🗑️  Cleared all trajectories');
  }

  /**
   * Get trajectory statistics
   * @param {string} icao24 - ICAO24 address
   * @returns {Object} Statistics object
   */
  getStatistics(icao24) {
    const points = this.getTrajectory(icao24);

    if (points.length === 0) {
      return null;
    }

    const altitudes = points.filter(p => p.altitude).map(p => p.altitude);
    const velocities = points.filter(p => p.velocity).map(p => p.velocity);

    return {
      icao24,
      callsign: points[points.length - 1].callsign,
      waypoint_count: points.length,
      tracking_duration: points[points.length - 1].time - points[0].time,
      start_time: new Date(points[0].time),
      end_time: new Date(points[points.length - 1].time),
      altitude: {
        max: Math.max(...altitudes),
        min: Math.min(...altitudes),
        avg: altitudes.reduce((sum, a) => sum + a, 0) / altitudes.length,
        current: points[points.length - 1].altitude
      },
      velocity: {
        max: Math.max(...velocities),
        min: Math.min(...velocities),
        avg: velocities.reduce((sum, v) => sum + v, 0) / velocities.length,
        current: points[points.length - 1].velocity
      },
      distance_traveled: this.calculateDistance(points),
      current_position: points[points.length - 1].position,
      on_ground: points[points.length - 1].on_ground
    };
  }

  /**
   * Calculate total distance traveled along trajectory
   * @param {Array} points - Array of waypoints
   * @returns {number} Distance in kilometers
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  calculateDistance(points) {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const [lat1, lon1] = points[i - 1].position;
      const [lat2, lon2] = points[i].position;
      totalDistance += TrajectoryTracker.haversineDistance(lat1, lon1, lat2, lon2);
    }

    return totalDistance;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @returns {number} Distance in kilometers
   * @private
   */
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Export trajectory data to JSON for download
   * @param {string} icao24 - ICAO24 address
   * @returns {string} JSON string
   */
  exportToJSON(icao24) {
    const trajectory = this.getTrajectory(icao24);
    const statistics = this.getStatistics(icao24);

    const data = {
      icao24,
      trajectory,
      statistics,
      exported_at: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Download trajectory as JSON file
   * @param {string} icao24 - ICAO24 address
   */
  downloadAsJSON(icao24) {
    const json = this.exportToJSON(icao24);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trajectory_${icao24}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance for global use
export const globalTracker = new TrajectoryTracker({
  pollInterval: 45000, // 45 seconds
  maxPoints: 1000,
  onUpdate: (icao24, _waypoint, trajectory) => {
    // Global update handler (can be customized)
    console.log(`📊 Trajectory updated for ${icao24}: ${trajectory.length} points`);
  }
});

export default TrajectoryTracker;
