/**
 * SkySentinel API Service
 * Connects Vue frontend to FastAPI backend for real-time aircraft data
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Fetches current airspace data from the backend
 * @param {number} limit - Maximum number of aircraft to fetch (default: 50)
 * @returns {Promise<Object>} GeoJSON FeatureCollection with aircraft data
 */
export async function fetchAirspaceData(limit = 50) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/airspace?limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch airspace data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching airspace data:', error);
        throw error;
    }
}

/**
 * Fetches airspace data for a specific region (bounding box)
 * @param {Object} bounds - Bounding box coordinates
 * @param {number} bounds.minLat - Minimum latitude
 * @param {number} bounds.maxLat - Maximum latitude
 * @param {number} bounds.minLon - Minimum longitude
 * @param {number} bounds.maxLon - Maximum longitude
 * @returns {Promise<Object>} GeoJSON FeatureCollection with aircraft data
 */
export async function fetchAirspaceRegion(bounds) {
    try {
        const { minLat, maxLat, minLon, maxLon } = bounds;
        const params = new URLSearchParams({
            min_lat: minLat,
            max_lat: maxLat,
            min_lon: minLon,
            max_lon: maxLon
        });

        const response = await fetch(`${API_BASE_URL}/api/v1/airspace/region?${params}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch regional airspace data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching regional airspace data:', error);
        throw error;
    }
}

/**
 * Checks if the backend API is operational
 * @returns {Promise<Object>} Health check response
 */
export async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);

        if (!response.ok) {
            throw new Error(`API health check failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking API health:', error);
        throw error;
    }
}

/**
 * Transforms GeoJSON aircraft data from backend to frontend format
 * @param {Object} geojsonData - GeoJSON FeatureCollection from backend
 * @returns {Array} Array of flight objects in frontend format
 */
export function transformAircraftData(geojsonData) {
    if (!geojsonData || !geojsonData.features) {
        return [];
    }

    return geojsonData.features.map((feature, index) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates; // [longitude, latitude]

        // Create a simple flight path (current position to a projected destination)
        // In a real scenario, you'd calculate destination based on heading and velocity
        const currentPosition = [coords[1], coords[0]]; // Convert to [lat, lon]
        const heading = props.heading || 0;

        // Project a destination roughly 1000km in the direction of travel
        const distance = 10; // degrees (roughly 1100km)
        const destLat = currentPosition[0] + (distance * Math.cos(heading * Math.PI / 180));
        const destLon = currentPosition[1] + (distance * Math.sin(heading * Math.PI / 180));
        const destinationPosition = [destLat, destLon];

        return {
            id: `${props.icao24}-${index}`,
            name: props.callsign !== 'N/A' ? props.callsign : props.icao24.toUpperCase(),
            airline: extractAirlineCode(props.callsign),
            from: props.origin_country || 'Unknown',
            to: 'In Transit',
            path: [currentPosition, destinationPosition],
            aircraft: 'Unknown',
            status: props.on_ground ? 'On Ground' : 'In Flight',
            statusClass: props.on_ground ? 'boarding' : 'on-time',
            departure: formatTimestamp(props.last_contact),
            arrival: '--',
            gate: '--',
            terminal: '--',
            bottleneck: false,
            progress: 0.15, // Start position for animation
            speed: 0.0008,
            altitude: props.altitude ? `${Math.round(props.altitude)}m` : 'N/A',
            velocity: props.velocity ? `${Math.round(props.velocity)} m/s` : 'N/A',
            heading: props.heading ? `${Math.round(props.heading)}°` : 'N/A',
            vertical_rate: props.vertical_rate ? `${props.vertical_rate} m/s` : 'N/A',
            passengers: '--',
            icao24: props.icao24,
            category: props.category,
            // Store raw data for potential future use
            rawData: props
        };
    });
}

/**
 * Extracts airline code from callsign (first 2-3 characters)
 * @param {string} callsign - Aircraft callsign
 * @returns {string} Airline code or default
 */
function extractAirlineCode(callsign) {
    if (!callsign || callsign === 'N/A') {
        return 'DL'; // Default airline for styling
    }

    // Extract first 2-3 letters from callsign
    const match = callsign.match(/^([A-Z]{2,3})/);
    return match ? match[1] : 'DL';
}

/**
 * Formats Unix timestamp to readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return '--';

    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}
