/**
 * Vue Composable for Real-Time Aircraft Trajectory Tracking
 *
 * Provides reactive aircraft tracking with automatic cleanup
 *
 * Usage in components:
 *   const { startTracking, stopTracking, getTrajectory, isTracking } = useTrajectoryTracking();
 *   await startTracking('aae316');
 */

import { ref, onBeforeUnmount } from 'vue';
import { TrajectoryTracker } from '@/services/aircraft-tracker';

export function useTrajectoryTracking(options = {}) {
  // Create tracker instance
  const tracker = new TrajectoryTracker({
    pollInterval: options.pollInterval || 45000,
    maxPoints: options.maxPoints || 1000,
    onUpdate: options.onUpdate
  });

  // Reactive state
  const trackedAircraft = ref([]);
  const trajectories = ref(new Map());
  const statistics = ref(new Map());

  /**
   * Start tracking an aircraft
   * @param {string} icao24 - ICAO24 address
   */
  const startTracking = async (icao24) => {
    await tracker.startTracking(icao24);
    updateReactiveState();
  };

  /**
   * Stop tracking an aircraft
   * @param {string} icao24 - ICAO24 address
   */
  const stopTracking = (icao24) => {
    tracker.stopTracking(icao24);
    updateReactiveState();
  };

  /**
   * Stop all tracking
   */
  const stopAllTracking = () => {
    tracker.stopAllTracking();
    updateReactiveState();
  };

  /**
   * Get trajectory for aircraft
   * @param {string} icao24 - ICAO24 address
   * @returns {Array} Waypoints array
   */
  const getTrajectory = icao24 => tracker.getTrajectory(icao24);

  /**
   * Get trajectory as GeoJSON
   * @param {string} icao24 - ICAO24 address
   * @returns {Object} GeoJSON Feature
   */
  const getGeoJSON = icao24 => tracker.exportAsGeoJSON(icao24);

  /**
   * Get all trajectories as GeoJSON
   * @returns {Object} GeoJSON FeatureCollection
   */
  const getAllGeoJSON = () => tracker.exportAllAsGeoJSON();

  /**
   * Check if aircraft is being tracked
   * @param {string} icao24 - ICAO24 address
   * @returns {boolean}
   */
  const isTracking = icao24 => tracker.isTracking(icao24);

  /**
   * Get statistics for aircraft
   * @param {string} icao24 - ICAO24 address
   * @returns {Object} Statistics
   */
  const getStatistics = icao24 => tracker.getStatistics(icao24);

  /**
   * Clear trajectory for aircraft
   * @param {string} icao24 - ICAO24 address
   */
  const clearTrajectory = (icao24) => {
    tracker.clearTrajectory(icao24);
    updateReactiveState();
  };

  /**
   * Clear all trajectories
   */
  const clearAllTrajectories = () => {
    tracker.clearAllTrajectories();
    updateReactiveState();
  };

  /**
   * Download trajectory as JSON
   * @param {string} icao24 - ICAO24 address
   */
  const downloadTrajectory = (icao24) => {
    tracker.downloadAsJSON(icao24);
  };

  /**
   * Update reactive state
   * @private
   */
  const updateReactiveState = () => {
    trackedAircraft.value = tracker.getTrackedAircraft();
    trajectories.value = new Map(tracker.trajectories);
    statistics.value = new Map(
      trackedAircraft.value.map(icao24 => [icao24, tracker.getStatistics(icao24)])
    );
  };

  // Cleanup on component unmount
  onBeforeUnmount(() => {
    stopAllTracking();
  });

  return {
    // Methods
    startTracking,
    stopTracking,
    stopAllTracking,
    isTracking,
    getTrajectory,
    getGeoJSON,
    getAllGeoJSON,
    getStatistics,
    clearTrajectory,
    clearAllTrajectories,
    downloadTrajectory,

    // Reactive state
    trackedAircraft,
    trajectories,
    statistics,

    // Tracker instance (for advanced use)
    tracker
  };
}

export default useTrajectoryTracking;
