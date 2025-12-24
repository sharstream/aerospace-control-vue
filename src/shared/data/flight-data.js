import { airports } from './airports.js'

// Dynamic flight data with detailed information
export const flightData = [
  {
    name: 'DL1234',
    airline: 'DL',
    from: 'SFO',
    to: 'JFK',
    path: [airports.SFO.coords, airports.JFK.coords],
    aircraft: 'A320neo',
    status: 'On Time',
    statusClass: 'on-time',
    departure: '10:30 AM',
    arrival: '07:15 PM',
    gate: 'A15',
    terminal: '3',
    bottleneck: false,
    progress: 0.15,
    speed: 0.0008,
    altitude: '35,000 ft',
    passengers: 156,
    systems: {
      overall: { health: 98, statusClass: 'operational', label: 'SYSTEMS OK' },
      electrical: {
        name: 'ELECTRICAL SYSTEM',
        statusClass: 'operational',
        status: 'OPERATIONAL',
        health: 98,
        icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
        metrics: {
          'VOLTAGE': '115.2V',
          'LOAD': '67%',
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
          'EGT': '625°C',
          'FUEL FLOW': '2450 kg/hr',
          'THRUST': '85%'
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
    altitude: '41,000 ft',
    passengers: 312,
    systems: {
      overall: { health: 86, statusClass: 'warning', label: 'SYSTEMS OK' },
      electrical: {
        name: 'ELECTRICAL SYSTEM',
        statusClass: 'critical',
        status: 'CRITICAL',
        health: 71,
        icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
        metrics: {
          'VOLTAGE': '115.6V',
          'LOAD': '71%',
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
          'EGT': '715°C',
          'FUEL FLOW': '5219 lbs/hr',
          'THRUST': '88%'
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
    altitude: '38,000 ft',
    passengers: 243,
    systems: {
      overall: { health: 95, statusClass: 'operational', label: 'SYSTEMS OK' },
      electrical: {
        name: 'ELECTRICAL SYSTEM',
        statusClass: 'operational',
        status: 'OPERATIONAL',
        health: 95,
        icon: 'M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z',
        metrics: {
          'VOLTAGE': '115.8V',
          'LOAD': '64%',
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
          'EGT': '638°C',
          'FUEL FLOW': '3150 lbs/hr',
          'THRUST': '84%'
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
    altitude: '39,000 ft',
    passengers: 298
  },
  {
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
    altitude: '42,000 ft',
    passengers: 354
  },
  {
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
    altitude: '33,000 ft',
    passengers: 145
  },
  {
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
    altitude: '40,000 ft',
    passengers: 287
  },
  {
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
    altitude: '36,000 ft',
    passengers: 152
  },
  {
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
    altitude: '37,000 ft',
    passengers: 256
  },
  {
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
    altitude: '34,000 ft',
    passengers: 148
  }
]
