/**
 * TrajectoryRenderer - Handles aircraft trajectory visualization on Leaflet map
 *
 * Responsibilities:
 * - Render trajectory paths as Leaflet Polylines
 * - Update trajectories in real-time
 * - Apply airline-specific colors to paths
 * - Optimize rendering using Leaflet Canvas renderer
 *
 * @see https://leafletjs.com/reference-2.0.0.html#path
 * @see https://leafletjs.com/reference-2.0.0.html#renderer
 */

import { Polyline, Canvas } from 'leaflet';

class TrajectoryRenderer {
  /**
   * @param {L.Map} map - Leaflet map instance
   * @param {Object} options - Configuration options
   */
  constructor(map, options = {}) {
    this.map = map;
    this.trajectoryPaths = new Map(); // icao24 -> Polyline instance
    this.options = {
      weight: 3,
      opacity: 0.7,
      smoothFactor: 1.0,
      ...options
    };

    // Use SVG renderer (default) instead of Canvas to avoid state issues during zoom
    // Canvas renderer has problems with coordinate updates during zoom animations
    this.renderer = null;
  }

  /**
   * Render or update trajectory for an aircraft (OpenSky-style solid line)
   * @param {string} icao24 - Aircraft ICAO24 address
   * @param {Array} waypoints - Array of waypoint objects
   */
  renderTrajectory(icao24, waypoints) {
    if (!waypoints || waypoints.length < 2) {
      this.removeTrajectory(icao24);
      return;
    }

    // Convert waypoints to LatLng coordinates
    const latLngs = waypoints.map(wp => [wp.position[0], wp.position[1]]);

    // Use high-contrast orange color for clear trajectory visibility
    const trajectoryColor = '#FF9900'; // High-contrast orange

    // Check if trajectory already exists
    const existingPath = this.trajectoryPaths.get(icao24);

    if (existingPath) {
      // Update existing polyline coordinates
      existingPath.setLatLngs(latLngs);
      return;
    }

    // Create single solid polyline (OpenSky-style)
    const polyline = new Polyline(latLngs, {
      color: trajectoryColor,
      weight: 3,
      opacity: 0.85,
      smoothFactor: 1.5,
      renderer: this.renderer,
      className: 'trajectory-path',
      interactive: false
    });

    // Store polyline reference
    this.trajectoryPaths.set(icao24, polyline);

    // Add to map
    polyline.addTo(this.map);
  }

  /**
   * Add a single point to an existing trajectory (for simulated or frequent updates)
   * @param {string} icao24 - Aircraft ICAO24 address
   * @param {Array} position - [lat, lng]
   */
  addPoint(icao24, position) {
    // Skip trajectory updates during zoom animations to avoid Leaflet projection errors
    if (this.map._zooming || this.map._animatingZoom) {
      return;
    }
    
    const existingPath = this.trajectoryPaths.get(icao24);
    
    if (existingPath) {
      // Update existing trajectory by adding new point
      const latLngs = existingPath.getLatLngs();
      
      // Avoid duplicate points (check if last point is same as new point)
      const lastPoint = latLngs[latLngs.length - 1];
      if (lastPoint && lastPoint.lat === position[0] && lastPoint.lng === position[1]) {
        return; // Skip duplicate
      }
      
      latLngs.push(position);
      existingPath.setLatLngs(latLngs);
    } else {
      // Create new trajectory with single point (needs at least 2 points for a line)
      // We'll wait for the second point to actually render
      const polyline = new Polyline([position], {
        color: '#FF9900',
        weight: 3,
        opacity: 0.85,
        smoothFactor: 1.5,
        renderer: this.renderer,
        className: 'trajectory-path',
        interactive: false
      });
      
      this.trajectoryPaths.set(icao24, polyline);
      polyline.addTo(this.map);
    }
  }

  /**
   * Remove trajectory for an aircraft
   * @param {string} icao24 - Aircraft ICAO24 address
   */
  removeTrajectory(icao24) {
    const path = this.trajectoryPaths.get(icao24);
    if (path) {
      this.map.removeLayer(path);
      this.trajectoryPaths.delete(icao24);
    }
  }

  /**
   * Remove all trajectories
   */
  clearAllTrajectories() {
    this.trajectoryPaths.forEach((path) => {
      this.map.removeLayer(path);
    });
    this.trajectoryPaths.clear();
  }

  /**
   * Update trajectory color for an aircraft
   * @param {string} icao24 - Aircraft ICAO24 address
   * @param {string} color - Custom color (optional, defaults to orange)
   */
  updateTrajectoryColor(icao24, color = '#FF9900') {
    const path = this.trajectoryPaths.get(icao24);
    if (path) {
      path.setStyle({ color });
    }
  }

  /**
   * Highlight trajectory (e.g., on hover or selection)
   * @param {string} icao24 - Aircraft ICAO24 address
   * @param {boolean} highlight - Whether to highlight or unhighlight
   */
  highlightTrajectory(icao24, highlight = true) {
    const path = this.trajectoryPaths.get(icao24);
    if (path) {
      if (highlight) {
        path.setStyle({
          weight: 5,
          opacity: 1.0,
          color: '#ff6b6b' // Brighter red on highlight
        });
        path.bringToFront();
      } else {
        path.setStyle({
          weight: 3,
          opacity: 0.85,
          color: '#FF9900' // Orange
        });
      }
    }
  }

  /**
   * Check if trajectory exists for aircraft
   * @param {string} icao24 - Aircraft ICAO24 address
   * @returns {boolean}
   */
  hasTrajectory(icao24) {
    return this.trajectoryPaths.has(icao24);
  }

  /**
   * Get all tracked aircraft ICAOs
   * @returns {Array<string>}
   */
  getTrackedAircraft() {
    return Array.from(this.trajectoryPaths.keys());
  }

  /**
   * Cleanup - remove all trajectories and renderer
   */
  destroy() {
    this.clearAllTrajectories();
    this.trajectoryPaths = null;
    this.renderer = null;
    this.map = null;
  }
}

export { TrajectoryRenderer };
export default TrajectoryRenderer;
