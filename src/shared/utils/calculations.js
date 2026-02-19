// Calculate distance between two geographic points using Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
            * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate bearing (direction) between two points
export function calculateBearing(lat1, lon1, lat2, lon2) {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad)
            - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
  // Normalize to 0-360 degrees
    bearing = (bearing + 360) % 360;

    return bearing;
}

// Check if a point is inside a weather hazard zone
export function isInWeatherZone(lat, lon, weatherHazards) {
    for (const hazard of weatherHazards) {
        const distance = calculateDistance(lat, lon, hazard.center[0], hazard.center[1]);
        if (distance <= hazard.radius) {
            return { inZone: true, hazard };
        }
    }
    return { inZone: false };
}

// Generate waypoints to avoid weather hazards
export function generateOptimizedRoute(start, end, weatherHazards) {
    const directDistance = calculateDistance(start[0], start[1], end[0], end[1]);

  // Check if direct route intersects weather zones
    const numCheckPoints = 20;
    const hazardsOnPath = [];

    for (let i = 0; i <= numCheckPoints; i++) {
        const t = i / numCheckPoints;
        const checkLat = start[0] + (end[0] - start[0]) * t;
        const checkLon = start[1] + (end[1] - start[1]) * t;
        const check = isInWeatherZone(checkLat, checkLon, weatherHazards);

        if (check.inZone && !hazardsOnPath.find(h => h === check.hazard)) {
            hazardsOnPath.push(check.hazard);
        }
    }

  // If no hazards, return direct route
    if (hazardsOnPath.length === 0) {
        return {
            path: [start, end],
            distance: directDistance,
            weatherAvoidance: false,
            hazardsAvoided: 0
        };
    }

  // Generate waypoints to avoid hazards
    const waypoints = [start];

    for (const hazard of hazardsOnPath) {
    // Calculate perpendicular offset to avoid hazard
    // Offset perpendicular to the flight path
        const angle = Math.atan2(end[0] - start[0], end[1] - start[1]);
        const offsetAngle = angle + Math.PI / 2;
        const offsetDist = (hazard.radius + 200) / 111; // Add 200km buffer, convert to degrees

        const waypointLat = hazard.center[0] + offsetDist * Math.cos(offsetAngle);
        const waypointLon = hazard.center[1] + offsetDist * Math.sin(offsetAngle);

        waypoints.push([waypointLat, waypointLon]);
    }

    waypoints.push(end);

  // Calculate total distance for waypoint route
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
        totalDistance += calculateDistance(
      waypoints[i][0],
waypoints[i][1],
waypoints[i + 1][0],
waypoints[i + 1][1]
    );
    }

    return {
        path: waypoints,
        distance: totalDistance,
        directDistance,
        weatherAvoidance: true,
        hazardsAvoided: hazardsOnPath.length,
        additionalDistance: totalDistance - directDistance
    };
}

// Calculate estimated time and fuel savings
export function calculateFlightMetrics(route, directDistance) {
    const avgSpeed = 900; // km/h average cruise speed
    const fuelConsumption = 3.5; // kg per km (simplified)

    const optimizedTime = (route.distance / avgSpeed) * 60; // minutes
    const directTime = (directDistance / avgSpeed) * 60;

    const optimizedFuel = route.distance * fuelConsumption;
    const directFuel = directDistance * fuelConsumption;

  // Weather avoidance saves fuel by avoiding turbulence and storms
    const weatherSavings = route.weatherAvoidance ? 0.08 : 0; // 8% savings from avoiding bad weather

    return {
        time: optimizedTime,
        directTime,
        timeDifference: optimizedTime - directTime,
        fuel: optimizedFuel * (1 - weatherSavings),
        directFuel,
        fuelSavings: directFuel - (optimizedFuel * (1 - weatherSavings)),
        fuelSavingsPercent: weatherSavings * 100,
        distance: route.distance,
        directDistance
    };
}

// Get system-wide flight statistics and context
export function getSystemContext(flightData, airlines) {
    const totalFlights = flightData.length;
    const onTimeFlights = flightData.filter(f => f.statusClass === 'on-time').length;
    const delayedFlights = flightData.filter(f => f.statusClass === 'delayed').length;
    const bottleneckFlights = flightData.filter(f => f.bottleneck).length;
    const activeAirlines = Object.keys(airlines).length;

  // Calculate average altitude - safely handle invalid values
    const validAltitudes = flightData
        .map((f) => {
            if (!f.altitude || f.altitude === 'N/A') return null;
            const alt = parseInt(String(f.altitude).replace(/[^\d]/g, ''), 10);
            return Number.isNaN(alt) ? null : alt;
        })
        .filter(alt => alt !== null && alt > 0);

    const avgAltitude = validAltitudes.length > 0
        ? Math.round(validAltitudes.reduce((sum, alt) => sum + alt, 0) / validAltitudes.length)
        : 0;

  // Get most congested route
    const routeCounts = {};
    flightData.forEach((f) => {
        const route = `${f.from}-${f.to}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    const busiestRoute = Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0];

  // Calculate total passengers - safely handle non-numeric values
    const totalPassengers = flightData.reduce((sum, f) => {
        const passengers = typeof f.passengers === 'number' ? f.passengers : 0;
        return sum + passengers;
    }, 0);

    return {
        totalFlights,
        onTimeFlights,
        delayedFlights,
        bottleneckFlights,
        onTimePercentage: Math.round((onTimeFlights / totalFlights) * 100),
        activeAirlines,
        avgAltitude,
        busiestRoute: busiestRoute ? `${busiestRoute[0]} (${busiestRoute[1]} flights)` : 'N/A',
        totalPassengers
    };
}
