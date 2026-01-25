/**
 * Utility functions to map tool results and data to preview panel formats
 * Provides structured data for specialized preview components
 */

/**
 * Map tool name to preview type
 *
 * @param {string} toolName - Name of the executed tool
 * @returns {string|null} Preview type identifier
 */
export function getPreviewTypeForTool(toolName) {
  const toolToPreviewMap = {
    'analyze_fuel_consumption': 'flight-data',
    'get_aircraft_status': 'system',
    'predict_trajectory': 'flight-data',
    'analyze_weather': 'weather',
    'optimize_route': 'route',
    'check_airspace_violations': 'flight-data',
    'calculate_eta': 'flight-data',
    'get_system_health': 'system'
  };

  return toolToPreviewMap[toolName] || null;
}

/**
 * Transform fuel analysis result to flight data preview format
 *
 * @param {Object} result - Tool execution result
 * @param {Object} flightContext - Additional flight context
 * @returns {Object} Flight data preview data
 */
export function mapFuelAnalysisToFlightData(result, flightContext = {}) {
  return {
    callsign: result.flight_id || flightContext.callsign || 'Unknown',
    status: result.fuel_status === 'CRITICAL' ? 'alert' : 'on-time',
    route: {
      from: flightContext.from || 'N/A',
      to: flightContext.to || 'N/A'
    },
    altitude: result.current_altitude || flightContext.altitude,
    speed: result.airspeed || flightContext.speed || 450,
    heading: flightContext.heading || 0,
    distance: result.distance_remaining || flightContext.distance,
    fuelStatus: result.fuel_status || 'NORMAL',
    fuelRemaining: result.fuel_remaining,
    fuelPercentage: result.fuel_percentage,
    systems: {
      fuel: result.fuel_status || 'operational',
      engines: 'operational',
      navigation: 'operational'
    },
    aircraft: flightContext.aircraft,
    airline: flightContext.airline,
    eta: flightContext.eta
  };
}

/**
 * Transform aircraft status result to system preview format
 *
 * @param {Object} result - Tool execution result
 * @returns {Object} System status preview data
 */
export function mapAircraftStatusToSystem(result) {
  return {
    overall_status: result.overall_status || result.overallStatus || 'NORMAL',
    systems_checked: result.systems_checked || result.systemsChecked || [],
    alerts: result.alerts || [],
    systemDetails: result.system_details || result.systemDetails,
    uptime: result.uptime || '99.9%',
    responseTime: result.response_time || result.responseTime || '50ms',
    throughput: result.throughput || '1200 req/s',
    errorRate: result.error_rate !== undefined ? result.error_rate : 0.1
  };
}

/**
 * Transform weather hazards to weather preview format
 *
 * @param {Array} hazards - Weather hazard objects
 * @param {Object} context - Additional context
 * @returns {Object} Weather analysis preview data
 */
export function mapHazardsToWeather(hazards, context = {}) {
  const severeHazards = hazards.filter(h => h.severity === 'high' || h.severity === 'severe');
  const moderateHazards = hazards.filter(h => h.severity === 'medium' || h.severity === 'moderate');

  return {
    severe: severeHazards.length,
    moderate: moderateHazards.length,
    affected: context.affectedFlights || 0,
    hazards: hazards.map(h => ({
      type: h.type || h.hazard_type || 'weather',
      severity: h.severity || 'medium',
      location: h.location || `${h.lat?.toFixed(2)}, ${h.lng?.toFixed(2)}`,
      description: h.description || `${h.type} detected in the area`,
      recommendations: h.recommendations || [
        'Monitor weather conditions closely',
        'Consider alternate routes if conditions worsen'
      ]
    })),
    forecast: context.forecast || 'Conditions expected to improve within 2-3 hours',
    recommendations: context.recommendations || [
      'Continue monitoring weather patterns',
      'Maintain safe altitude above weather systems',
      'Ensure adequate fuel reserves for potential rerouting'
    ]
  };
}

/**
 * Transform route optimization data to route preview format
 *
 * @param {Object} routeData - Route optimization result
 * @param {Array} flights - Flight objects for context
 * @returns {Object} Route optimization preview data
 */
export function mapRouteOptimizationToPreview(routeData, flights = []) {
  const routes = [];

  // Direct route
  if (routeData.directRoute || routeData.direct) {
    const direct = routeData.directRoute || routeData.direct;
    routes.push({
      type: 'direct',
      name: 'Direct Route',
      from: direct.from || routeData.from,
      to: direct.to || routeData.to,
      distance: direct.distance || routeData.directDistance,
      time: direct.time || direct.duration,
      fuel: direct.fuel || direct.fuelConsumption,
      waypoints: 0,
      recommended: false
    });
  }

  // Optimized route
  if (routeData.optimizedRoute || routeData.optimized) {
    const optimized = routeData.optimizedRoute || routeData.optimized;
    routes.push({
      type: 'optimized',
      name: 'Optimized Route',
      from: optimized.from || routeData.from,
      to: optimized.to || routeData.to,
      distance: optimized.distance || routeData.optimizedDistance,
      time: optimized.time || optimized.duration,
      fuel: optimized.fuel || optimized.fuelConsumption,
      waypoints: optimized.waypoints?.length || routeData.waypoints?.length || 2,
      hazardsAvoided: optimized.hazardsAvoided || routeData.hazardsAvoided || 0,
      advantages: optimized.advantages || [
        'Avoids severe weather zones',
        'Reduces turbulence exposure',
        'Maintains optimal altitude'
      ],
      recommended: true
    });
  }

  return {
    flights: flights.map(f => f.name || f.callsign),
    routes,
    comparison: {
      timeSaved: routeData.timeSaved || routeData.time_saved || 0,
      fuelSaved: routeData.fuelSaved || routeData.fuel_saved || 0,
      costSaved: routeData.costSaved || routeData.cost_saved || 0
    },
    recommendations: routeData.recommendations || [
      'Use optimized route for improved fuel efficiency',
      'Monitor weather updates during flight',
      'Maintain communication with air traffic control'
    ]
  };
}

/**
 * Transform flight object to flight data preview format
 *
 * @param {Object} flight - Flight object
 * @param {Object} airlineData - Airline information
 * @returns {Object} Flight data preview data
 */
export function mapFlightToPreview(flight, airlineData = {}) {
  return {
    callsign: flight.name || flight.callsign || 'Unknown',
    status: flight.statusClass || flight.status || 'departed',
    route: {
      from: flight.from,
      to: flight.to
    },
    from: flight.from,
    to: flight.to,
    altitude: flight.altitude,
    speed: flight.speed || 450,
    velocity: flight.velocity || flight.speed,
    heading: flight.heading || 0,
    distance: flight.distance,
    fuelStatus: flight.fuelStatus || 'NORMAL',
    fuelRemaining: flight.fuelRemaining,
    fuelPercentage: flight.fuelPercentage,
    systems: flight.systems || {
      navigation: 'operational',
      engines: 'operational',
      fuel: 'operational',
      hydraulics: 'operational'
    },
    aircraft: flight.aircraft || flight.aircraftType,
    airline: airlineData.name || flight.airline,
    eta: flight.eta,
    progress: flight.progress
  };
}

/**
 * Transform system context to system status preview format
 *
 * @param {Object} context - System context object
 * @returns {Object} System status preview data
 */
export function mapSystemContextToPreview(context) {
  const criticalFlights = context.bottleneckFlights || 0;
  const status = criticalFlights > 0 ? 'WARNING' : 'NORMAL';

  return {
    overall_status: status,
    overallStatus: status,
    systems_checked: [
      'flight_tracking',
      'weather_monitoring',
      'route_optimization',
      'fuel_management',
      'communication'
    ],
    systemsChecked: [
      'flight_tracking',
      'weather_monitoring',
      'route_optimization',
      'fuel_management',
      'communication'
    ],
    alerts: criticalFlights > 0 ? [
      {
        severity: 'medium',
        message: `${criticalFlights} flight${criticalFlights > 1 ? 's' : ''} experiencing congestion`
      }
    ] : [],
    uptime: '99.9%',
    responseTime: '45ms',
    throughput: `${context.totalFlights || 0} active flights`,
    errorRate: 0.1,
    systemDetails: {
      flight_tracking: {
        status: 'operational',
        metrics: {
          total_flights: context.totalFlights || 0,
          on_time: context.onTimeFlights || 0,
          delayed: context.delayedFlights || 0
        }
      },
      weather_monitoring: {
        status: 'operational',
        metrics: {
          active_hazards: context.weatherHazards || 0,
          coverage: '100%'
        }
      },
      route_optimization: {
        status: criticalFlights > 0 ? 'warning' : 'operational',
        metrics: {
          optimized_routes: context.onTimeFlights || 0,
          bottlenecks: criticalFlights
        }
      }
    }
  };
}

/**
 * Extract preview data from tool result
 *
 * @param {string} toolName - Name of executed tool
 * @param {Object} result - Tool execution result
 * @param {Object} context - Additional context (flights, airlines, etc.)
 * @returns {Object} { type, data } for preview panel
 */
export function extractPreviewFromToolResult(toolName, result, context = {}) {
  const previewType = getPreviewTypeForTool(toolName);

  if (!previewType) {
    return { type: null, data: result };
  }

  let previewData;

  switch (toolName) {
    case 'analyze_fuel_consumption':
      previewData = mapFuelAnalysisToFlightData(result, context.flightContext);
      break;

    case 'get_aircraft_status':
    case 'get_system_health':
      previewData = mapAircraftStatusToSystem(result);
      break;

    case 'analyze_weather':
      previewData = mapHazardsToWeather(result.hazards || [], context);
      break;

    case 'optimize_route':
      previewData = mapRouteOptimizationToPreview(result, context.flights);
      break;

    case 'predict_trajectory':
    case 'calculate_eta':
    case 'check_airspace_violations':
      previewData = mapFlightToPreview(result, context.airlineData);
      break;

    default:
      previewData = result;
  }

  return {
    type: previewType,
    data: previewData
  };
}
