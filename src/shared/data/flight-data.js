import { airports } from './airports.js';

/**
 * Mock flight data following OpenSky API structure
 * This matches the structure returned by transformAircraftData() in api.js
 *
 * Key OpenSky API fields:
 * - icao24: 6-character hex identifier (e.g., "abc123")
 * - callsign: Flight number/callsign
 * - origin_country: Country of origin
 * - on_ground: Boolean indicating if aircraft is on ground
 * - last_contact: Unix timestamp of last contact
 * - altitude: Altitude in meters
 * - velocity: Speed in m/s
 * - heading: Direction in degrees (0-360)
 * - vertical_rate: Climb/descent rate in m/s
 * - category: Aircraft category code
 */
export const flightData = [
    {
        // OpenSky API fields (required for tracking)
        id: 'a12b34-0',
        icao24: 'a12b34',
        name: 'DL1234',
        airline: 'DL',
        from: 'United States',
        to: 'In Transit',
        path: [airports.SFO.coords, airports.JFK.coords],
        aircraft: 'A320neo',
        status: 'In Flight',
        statusClass: 'on-time',
        departure: '10:30 AM',
        arrival: '07:15 PM',
        gate: 'A15',
        terminal: '3',
        bottleneck: false,
        progress: 0.15,
        speed: 0.0008,
        altitude: '10668m', // 35,000 ft = 10,668 meters
        velocity: '235 m/s', // ~470 knots
        heading: '90°', // Eastbound
        vertical_rate: '0 m/s', // Level flight
        passengers: 156,
        category: 3, // Category 3: Large aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'a12b34',
            callsign: 'DL1234',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000), // Current Unix timestamp
            altitude: 10668, // meters
            velocity: 235, // m/s
            heading: 90, // degrees
            vertical_rate: 0, // m/s
            category: 3
        },
        systems: {
            overall: { health: 98, statusClass: 'operational', label: 'SYSTEMS OK' },
            electrical: {
                name: 'ELECTRICAL SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 98,
                icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
                metrics: {
                    VOLTAGE: '115.2V',
                    LOAD: '67%',
                    'GEN 1': 'ONLINE',
                    'GEN 2': 'ONLINE'
                }
            },
            engine: {
                name: 'ENGINE SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 96,
                icon: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z',
                metrics: {
                    'N1 SPEED': '87.2%',
                    EGT: '625°C',
                    'FUEL FLOW': '2450 kg/hr',
                    THRUST: '85%'
                }
            },
            hvac: {
                name: 'HVAC SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 97,
                icon: 'M12 2c1 0 3 .5 3 2v1c3 0 5 2 5 5v3c0 1-.5 1-1 1v6H8v-6c-.5 0-1 0-1-1v-3c0-3 2-5 5-5V4c0-1.5 2-2 3-2zm-1 9h2v6h-2z',
                metrics: {
                    'CABIN TEMP': '72°F',
                    'CABIN PRESS': '8.45 PSI',
                    'PACK 1': 'ON',
                    'PACK 2': 'ON'
                }
            },
            hydraulics: {
                name: 'HYDRAULICS',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 99,
                icon: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z',
                metrics: {
                    'SYSTEM A': '3025 PSI',
                    'SYSTEM B': '3015 PSI',
                    'RESERVOIR A': '98%',
                    'RESERVOIR B': '97%'
                }
            },
            fuel: {
                name: 'FUEL SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 94,
                icon: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z',
                metrics: {
                    'TOTAL FUEL': '12450 lbs',
                    'FLOW RATE': '2450 lbs/hr',
                    'LEFT TANK': '82%',
                    'RIGHT TANK': '84%'
                }
            }
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'b23c45-1',
        icao24: 'b23c45',
        name: 'AA2567',
        airline: 'AA',
        from: 'LAX',
        to: 'LHR',
        path: [airports.LAX.coords, airports.LHR.coords],
        aircraft: 'B777-300ER',
        status: 'In Flight',
        statusClass: 'on-time',
        departure: '11:45 AM',
        arrival: '06:30 AM+1',
        gate: 'B22',
        terminal: '4',
        bottleneck: true,
        progress: 0.35,
        speed: 0.0005,
        altitude: '12497m', // 41,000 ft = 12,497 meters
        velocity: '250 m/s', // ~485 knots
        heading: '45°', // Northeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 312,
        category: 4, // Category 4: Heavy aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'b23c45',
            callsign: 'AA2567',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 12497, // meters
            velocity: 250, // m/s
            heading: 45, // degrees
            vertical_rate: 0, // m/s
            category: 4
        },
        systems: {
            overall: { health: 86, statusClass: 'warning', label: 'SYSTEMS OK' },
            electrical: {
                name: 'ELECTRICAL SYSTEM',
                statusClass: 'critical',
                status: 'CRITICAL',
                health: 71,
                icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
                metrics: {
                    VOLTAGE: '115.6V',
                    LOAD: '71%',
                    'GEN 1': 'ONLINE',
                    'GEN 2': 'ONLINE'
                }
            },
            engine: {
                name: 'BOEING ENGINE',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 95,
                icon: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z',
                metrics: {
                    'N1 SPEED': '89.5%',
                    EGT: '715°C',
                    'FUEL FLOW': '5219 lbs/hr',
                    THRUST: '88%'
                }
            },
            hvac: {
                name: 'HVAC SYSTEM',
                statusClass: 'critical',
                status: 'CRITICAL',
                health: 68,
                icon: 'M12 2c1 0 3 .5 3 2v1c3 0 5 2 5 5v3c0 1-.5 1-1 1v6H8v-6c-.5 0-1 0-1-1v-3c0-3 2-5 5-5V4c0-1.5 2-2 3-2zm-1 9h2v6h-2z',
                metrics: {
                    'CABIN TEMP': '68.5°F',
                    'CABIN PRESS': '8.52 PSI',
                    'PACK 1': 'ON',
                    'PACK 2': 'ON'
                }
            },
            hydraulics: {
                name: 'HYDRAULICS',
                statusClass: 'critical',
                status: 'CRITICAL',
                health: 92,
                icon: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z',
                metrics: {
                    'SYSTEM A': '2962 PSI',
                    'SYSTEM B': '2887 PSI',
                    'RESERVOIR A': '97%',
                    'RESERVOIR B': '95%'
                }
            },
            fuel: {
                name: 'FUEL SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 89,
                icon: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z',
                metrics: {
                    'TOTAL FUEL': '54073 lbs',
                    'FLOW RATE': '5219 lbs/hr',
                    'LEFT TANK': '78%',
                    'RIGHT TANK': '81%'
                }
            }
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'c34d56-2',
        icao24: 'c34d56',
        name: 'UA789',
        airline: 'UA',
        from: 'ORD',
        to: 'MUC',
        path: [airports.ORD.coords, airports.MUC.coords],
        aircraft: 'B787-9',
        status: 'On Time',
        statusClass: 'on-time',
        departure: '02:15 PM',
        arrival: '05:45 AM+1',
        gate: 'C5',
        terminal: '1',
        bottleneck: false,
        progress: 0.55,
        speed: 0.0006,
        altitude: '11582m', // 38,000 ft = 11,582 meters
        velocity: '240 m/s', // ~466 knots
        heading: '75°', // East-Northeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 243,
        category: 3, // Category 3: Large aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'c34d56',
            callsign: 'UA789',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 11582, // meters
            velocity: 240, // m/s
            heading: 75, // degrees
            vertical_rate: 0, // m/s
            category: 3
        },
        systems: {
            overall: { health: 95, statusClass: 'operational', label: 'SYSTEMS OK' },
            electrical: {
                name: 'ELECTRICAL SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 95,
                icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
                metrics: {
                    VOLTAGE: '115.8V',
                    LOAD: '64%',
                    'GEN 1': 'ONLINE',
                    'GEN 2': 'ONLINE'
                }
            },
            engine: {
                name: 'BOEING ENGINE',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 94,
                icon: 'M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12 6 2.12v4.78z',
                metrics: {
                    'N1 SPEED': '86.8%',
                    EGT: '638°C',
                    'FUEL FLOW': '3150 lbs/hr',
                    THRUST: '84%'
                }
            },
            hvac: {
                name: 'HVAC SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 96,
                icon: 'M12 2c1 0 3 .5 3 2v1c3 0 5 2 5 5v3c0 1-.5 1-1 1v6H8v-6c-.5 0-1 0-1-1v-3c0-3 2-5 5-5V4c0-1.5 2-2 3-2zm-1 9h2v6h-2z',
                metrics: {
                    'CABIN TEMP': '71°F',
                    'CABIN PRESS': '8.42 PSI',
                    'PACK 1': 'ON',
                    'PACK 2': 'ON'
                }
            },
            hydraulics: {
                name: 'HYDRAULICS',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 97,
                icon: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z',
                metrics: {
                    'SYSTEM A': '3018 PSI',
                    'SYSTEM B': '3022 PSI',
                    'RESERVOIR A': '96%',
                    'RESERVOIR B': '98%'
                }
            },
            fuel: {
                name: 'FUEL SYSTEM',
                statusClass: 'operational',
                status: 'OPERATIONAL',
                health: 93,
                icon: 'M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z',
                metrics: {
                    'TOTAL FUEL': '18920 lbs',
                    'FLOW RATE': '3150 lbs/hr',
                    'LEFT TANK': '79%',
                    'RIGHT TANK': '78%'
                }
            }
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'd45e67-3',
        icao24: 'd45e67',
        name: 'DL8934',
        airline: 'DL',
        from: 'MIA',
        to: 'CDG',
        path: [airports.MIA.coords, airports.CDG.coords],
        aircraft: 'A350-900',
        status: 'Boarding',
        statusClass: 'boarding',
        departure: '03:30 PM',
        arrival: '06:15 AM+1',
        gate: 'D8',
        terminal: '2',
        bottleneck: false,
        progress: 0.72,
        speed: 0.001,
        altitude: '11887m', // 39,000 ft = 11,887 meters
        velocity: '245 m/s', // ~476 knots
        heading: '60°', // Northeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 298,
        category: 3, // Category 3: Large aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'd45e67',
            callsign: 'DL8934',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 11887, // meters
            velocity: 245, // m/s
            heading: 60, // degrees
            vertical_rate: 0, // m/s
            category: 3
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'e56f78-4',
        icao24: 'e56f78',
        name: 'AA567',
        airline: 'AA',
        from: 'BOS',
        to: 'NRT',
        path: [airports.BOS.coords, airports.NRT.coords],
        aircraft: 'B777-300ER',
        status: 'On Time',
        statusClass: 'on-time',
        departure: '05:00 PM',
        arrival: '08:30 PM+1',
        gate: 'E14',
        terminal: '5',
        bottleneck: false,
        progress: 0.12,
        speed: 0.0009,
        altitude: '12802m', // 42,000 ft = 12,802 meters
        velocity: '255 m/s', // ~495 knots
        heading: '300°', // Northwest
        vertical_rate: '0 m/s', // Level flight
        passengers: 354,
        category: 4, // Category 4: Heavy aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'e56f78',
            callsign: 'AA567',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 12802, // meters
            velocity: 255, // m/s
            heading: 300, // degrees
            vertical_rate: 0, // m/s
            category: 4
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'f67g89-5',
        icao24: 'f67g89',
        name: 'WN1847',
        airline: 'WN',
        from: 'DEN',
        to: 'LAX',
        path: [airports.DEN.coords, airports.LAX.coords],
        aircraft: 'B737-800',
        status: 'Delayed',
        statusClass: 'delayed',
        departure: '08:15 AM',
        arrival: '10:45 AM',
        gate: 'A3',
        terminal: '1',
        bottleneck: false,
        progress: 0.45,
        speed: 0.001,
        altitude: '10058m', // 33,000 ft = 10,058 meters
        velocity: '230 m/s', // ~447 knots
        heading: '255°', // West-Southwest
        vertical_rate: '0 m/s', // Level flight
        passengers: 145,
        category: 2, // Category 2: Medium aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'f67g89',
            callsign: 'WN1847',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 10058, // meters
            velocity: 230, // m/s
            heading: 255, // degrees
            vertical_rate: 0, // m/s
            category: 2
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'g78h90-6',
        icao24: 'g78h90',
        name: 'LH456',
        airline: 'LH',
        from: 'FRA',
        to: 'JFK',
        path: [airports.FRA.coords, airports.JFK.coords],
        aircraft: 'A350-900',
        status: 'In Flight',
        statusClass: 'on-time',
        departure: '01:20 PM',
        arrival: '04:50 PM',
        gate: 'Z10',
        terminal: '1',
        bottleneck: true,
        progress: 0.28,
        speed: 0.0007,
        altitude: '12192m', // 40,000 ft = 12,192 meters
        velocity: '248 m/s', // ~482 knots
        heading: '285°', // West-Northwest
        vertical_rate: '0 m/s', // Level flight
        passengers: 287,
        category: 3, // Category 3: Large aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'g78h90',
            callsign: 'LH456',
            origin_country: 'Germany',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 12192, // meters
            velocity: 248, // m/s
            heading: 285, // degrees
            vertical_rate: 0, // m/s
            category: 3
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'h89i01-7',
        icao24: 'h89i01',
        name: 'UA1523',
        airline: 'UA',
        from: 'SEA',
        to: 'ORD',
        path: [airports.SEA.coords, airports.ORD.coords],
        aircraft: 'B737-800',
        status: 'On Time',
        statusClass: 'on-time',
        departure: '06:30 AM',
        arrival: '12:45 PM',
        gate: 'B7',
        terminal: '2',
        bottleneck: false,
        progress: 0.65,
        speed: 0.0009,
        altitude: '10973m', // 36,000 ft = 10,973 meters
        velocity: '238 m/s', // ~462 knots
        heading: '105°', // East-Southeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 152,
        category: 2, // Category 2: Medium aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'h89i01',
            callsign: 'UA1523',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 10973, // meters
            velocity: 238, // m/s
            heading: 105, // degrees
            vertical_rate: 0, // m/s
            category: 2
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'i90j12-8',
        icao24: 'i90j12',
        name: 'DL2698',
        airline: 'DL',
        from: 'ATL',
        to: 'AMS',
        path: [airports.ATL.coords, airports.AMS.coords],
        aircraft: 'A330-300',
        status: 'On Time',
        statusClass: 'on-time',
        departure: '04:45 PM',
        arrival: '07:20 AM+1',
        gate: 'E29',
        terminal: 'I',
        bottleneck: false,
        progress: 0.18,
        speed: 0.0008,
        altitude: '11278m', // 37,000 ft = 11,278 meters
        velocity: '242 m/s', // ~470 knots
        heading: '70°', // East-Northeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 256,
        category: 3, // Category 3: Large aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'i90j12',
            callsign: 'DL2698',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 11278, // meters
            velocity: 242, // m/s
            heading: 70, // degrees
            vertical_rate: 0, // m/s
            category: 3
        }
    },
    {
        // OpenSky API fields (required for tracking)
        id: 'j01k23-9',
        icao24: 'j01k23',
        name: 'AA3421',
        airline: 'AA',
        from: 'DFW',
        to: 'MIA',
        path: [airports.DFW.coords, airports.MIA.coords],
        aircraft: 'B737-800',
        status: 'On Time',
        statusClass: 'on-time',
        departure: '09:20 AM',
        arrival: '01:35 PM',
        gate: 'A18',
        terminal: '3',
        bottleneck: false,
        progress: 0.52,
        speed: 0.0011,
        altitude: '10363m', // 34,000 ft = 10,363 meters
        velocity: '233 m/s', // ~453 knots
        heading: '120°', // East-Southeast
        vertical_rate: '0 m/s', // Level flight
        passengers: 148,
        category: 2, // Category 2: Medium aircraft
        // Raw OpenSky data (used by trajectory tracking)
        rawData: {
            icao24: 'j01k23',
            callsign: 'AA3421',
            origin_country: 'United States',
            on_ground: false,
            last_contact: Math.floor(Date.now() / 1000),
            altitude: 10363, // meters
            velocity: 233, // m/s
            heading: 120, // degrees
            vertical_rate: 0, // m/s
            category: 2
        }
    }
];
