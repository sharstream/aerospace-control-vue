# Aerospace Control System - Vue 3 Refactor

Modern Vue 3 application for aerospace airline visualization and control.

## 🎯 Project Overview

This is a complete refactor of the original HTML-based aerospace control system into a modern Vue 3 application using Vite, while preserving all existing business logic and functionality.

## 📁 Project Structure

```
aerospace-control-vue/
├── src/
│   ├── modules/              # Feature modules (one per tab)
│   │   ├── map/             # Map visualization with Leaflet
│   │   ├── dashboard/       # Flight operations dashboard
│   │   ├── weather/         # Weather monitoring
│   │   ├── analytics/       # Flight analytics
│   │   ├── settings/        # Application settings
│   │   └── ai-chat/         # AI assistant chat
│   ├── shared/              # Shared utilities and data
│   │   ├── data/            # Static data (airlines, aircraft, flights)
│   │   ├── utils/           # Utility functions (calculations)
│   │   └── composables/     # Vue composables (future)
│   ├── components/          # Shared UI components
│   ├── assets/              # Static assets
│   │   └── styles/          # Global styles
│   ├── App.vue              # Root component (orchestrator)
│   └── main.js              # Application entry point
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

- **Vue 3.5.26** - Progressive JavaScript framework
- **Leaflet 1.9.4** - Interactive map library
- **Vite 6.0.7** - Next-generation frontend tooling

## 🏗️ Architecture

### Root Orchestrator Pattern

The `App.vue` component serves as the main orchestrator that:
- Manages global state (flights, active view, selected flight)
- Coordinates module loading and data flow
- Handles navigation between modules
- Provides centralized event handling

### Module Structure

Each tab/feature is organized as a self-contained module:

```
module-name/
├── ModuleName.vue          # Main module component
├── components/             # Module-specific components (if needed)
└── composables/            # Module-specific logic (if needed)
```

### Shared Resources

All shared logic resides in `src/shared/`:
- **Data**: Airlines, aircraft models, airports, flights, weather
- **Utils**: Calculations (bearing, distance), system context
- **Composables**: Reusable Vue composition logic (future expansion)

## 🎨 Features Preserved

All original functionality has been preserved:

✅ Interactive Leaflet map with OpenStreetMap
✅ Real-time flight animation and tracking
✅ Flight path visualization with great-circle routes
✅ Dynamic bearing calculation for aircraft orientation
✅ Weather hazard zones display
✅ Dashboard with flight cards and status
✅ Weather monitoring module
✅ Analytics with performance metrics
✅ Settings panel
✅ AI chat assistant (Commander Atlas)
✅ Bottom navigation with view switching
✅ Responsive design and animations

## 🔧 Development

### Path Aliases

Configured in `vite.config.js`:
- `@` → `src/`
- `@modules` → `src/modules/`
- `@shared` → `src/shared/`
- `@components` → `src/components/`
- `@assets` → `src/assets/`

### Adding New Modules

1. Create module directory in `src/modules/[module-name]/`
2. Create `ModuleName.vue` component
3. Import and register in `App.vue`
4. Add navigation item in `BottomNavigation.vue`

### State Management

Currently using:
- Vue's reactive state (`ref`, `computed`)
- Props and events for component communication
- Local storage for settings persistence

For larger scale, consider adding Pinia for centralized state management.

## 🎯 Next Steps

Future enhancements to consider:

1. **Add Pinia** for centralized state management
2. **Add Vue Router** for URL-based navigation
3. **Expand Dashboard** with detailed flight analysis views
4. **Enhance AI Chat** with real OpenAI API integration
5. **Add Tests** (Vitest + Vue Test Utils)
6. **Add TypeScript** for type safety
7. **Performance optimization** with lazy loading
8. **Add PWA** capabilities for offline usage

## 📝 Migration Notes

### What Changed
- Static HTML → Vue 3 SFC components
- Inline scripts → Modular Vue components
- Global variables → Reactive Vue state
- Direct DOM manipulation → Vue template reactivity
- Monolithic file → Organized module structure

### What Stayed the Same
- All business logic (calculations, data structures)
- Leaflet map implementation
- Flight animation algorithms
- Bearing calculations for aircraft orientation
- Weather hazard display
- All visual designs and UX
- OpenStreetMap integration

## 🐛 Known Issues

None currently. The refactor maintains 100% functional parity with the original application.

## 📄 License

Proprietary - Internal use only

## 🤝 Contributing

1. Follow the established module structure
2. Keep business logic in shared utilities
3. Use Vue 3 Composition API
4. Maintain consistent code style
5. Test all changes before committing

## 📞 Support

For questions or issues, contact the development team.

---

**Built with ❤️ using Vue 3 & Vite**
