# Tellene Interactive Map

A modular, extensible TTRPG campaign map application built with TypeScript and Canvas. Phase 1 focuses on a robust map engine with intuitive navigation controls.

## 🎮 Features

### Current (Phase 1)
- ✅ **Map Display** - High-resolution interactive map rendering
- ✅ **Navigation** - Smooth pan and zoom with multiple input methods
- ✅ **Coordinate System** - Accurate world/screen space conversion
- ✅ **Multi-Input Support** - Mouse, keyboard, and touch controls
- ✅ **Real-time Feedback** - Coordinate display and zoom level indicator
- ✅ **Modular Architecture** - Clean separation of concerns for easy extension
- ✅ **Zero Runtime Dependencies** - Pure TypeScript and Canvas API

### Planned (Phase 2-5)
- 🔲 Party movement and tracking
- 🔲 Terrain system with movement costs
- 🔲 Encounter generation and visualization
- 🔲 Campaign state management and persistence
- 🔲 Fog of war and exploration tracking
- 🔲 Token/miniature rendering
- 🔲 Measurement and drawing tools

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Add your map image to assets/maps/tellene-map.png

# Start development server
npm run dev

# Open browser to http://localhost:8080
```

**Controls:**
- **Left Click + Drag** - Pan
- **Mouse Wheel** - Zoom
- **Arrow Keys** - Pan
- **+/- Keys** - Zoom
- **R Key** - Reset view
- **Touch** - Single drag (pan), pinch (zoom), double-tap (zoom in)

See `GETTING_STARTED.md` for detailed setup instructions.

## 📋 Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Setup, installation, and usage guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and extension points
- **[PROJECT_MANIFEST.json](./PROJECT_MANIFEST.json)** - Complete feature inventory

## 🏗️ Architecture

### Core Systems

```
MapEngine          -> Central orchestrator
├── MapRenderer    -> Canvas operations
├── CoordinateSystem -> Space conversion
└── [Data/UI/Input] -> Supporting systems
```

### Key Components

| Component | Purpose | Status |
|-----------|---------|--------|
| **MapEngine** | Orchestrates map, camera, and events | ✅ Complete |
| **MapRenderer** | Canvas drawing and image loading | ✅ Complete |
| **CoordinateSystem** | World ↔ Screen coordinate conversion | ✅ Complete |
| **InputManager** | Centralizes all input handling | ✅ Complete |
| **MouseHandler** | Desktop mouse interactions | ✅ Complete |
| **TouchHandler** | Mobile/tablet touch interactions | ✅ Complete |
| **UIController** | UI component management | ✅ Complete |
| **ControlPanel** | Navigation controls UI | ✅ Complete |
| **CoordinateDisplay** | Real-time coordinate display | ✅ Complete |
| **DataManager** | Central data repository | ✅ Complete |

### File Organization

```
src/
├── core/           # Map engine & rendering
│   ├── MapEngine.ts
│   ├── MapRenderer.ts
│   └── CoordinateSystem.ts
├── input/          # Input handling
│   ├── InputManager.ts
│   ├── MouseHandler.ts
│   └── TouchHandler.ts
├── ui/             # User interface
│   ├── UIController.ts
│   ├── ControlPanel.ts
│   └── CoordinateDisplay.ts
├── data/           # Data management
│   ├── DataManager.ts
│   ├── Types.ts
│   └── placeholders/  # Future systems
├── utils/          # Shared utilities
│   ├── Constants.ts
│   ├── Logger.ts
│   └── MathUtils.ts
└── index.ts        # Entry point
```

## 🛠️ Development

### Available Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run type-check   # Verify TypeScript types
npm run lint         # Run ESLint
npm start            # Serve production build
```

### Configuration

All settings are in `src/utils/Constants.ts`:

```typescript
// Map settings
MAP_CONFIG = {
  defaultZoom: 1,
  minZoom: 0.5,
  maxZoom: 4,
  defaultMapImagePath: 'assets/maps/tellene-map.png'
}

// Input settings
INPUT_CONFIG = {
  panSensitivity: 1,
  wheelZoomSensitivity: 0.1,
  doubleTapZoomFactor: 1.5
}

// UI settings
UI_CONFIG = {
  showCoordinateDisplay: true,
  updateCoordinateFrequency: 100  // ms
}

// Debug settings
DEBUG_CONFIG = {
  enableLogging: true,
  renderCoordinateGrid: false
}
```

## 🔌 API Reference

### MapEngine

```typescript
// Navigation
mapEngine.pan(deltaX, deltaY)
mapEngine.setPan(x, y)
mapEngine.zoom(factor, screenX?, screenY?)
mapEngine.setZoom(level)
mapEngine.resetView()

// Queries
mapEngine.getWorldCoordinates(screenX, screenY): WorldCoordinate | null
mapEngine.getScreenCoordinates(worldX, worldY): ScreenCoordinate | null
mapEngine.isWithinBounds(worldX, worldY): boolean

// State
mapEngine.getState(): MapState
mapEngine.getZoom(): number
mapEngine.getPan(): { x, y }
mapEngine.isReady(): boolean

// Rendering
mapEngine.startRenderLoop()
mapEngine.stopRenderLoop()
mapEngine.render()

// Events
mapEngine.on(eventType, listener): () => void  // Returns unsubscribe function
```

### DataManager

```typescript
// Locations
dataManager.addLocation(location)
dataManager.getLocation(id): Location | null
dataManager.getAllLocations(): Location[]
dataManager.removeLocation(id)

// Markers
dataManager.addMarker(marker)
dataManager.getMarker(id): Marker | null
dataManager.getAllMarkers(): Marker[]

// Zones
dataManager.addZone(zone)
dataManager.getZone(id): Zone | null

// Terrain
dataManager.addTerrainRegion(region)
dataManager.getTerrainRegion(id): TerrainRegion | null

// Measurements
dataManager.addMeasurement(measurement)
dataManager.getMeasurement(id): Measurement | null

// Utility
dataManager.clearAll()
dataManager.exportData()
dataManager.importData(data)
```

### UIController

```typescript
uiController.showAll()
uiController.hideAll()
uiController.getControlPanel(): ControlPanel
```

## 📊 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Design Principles

1. **Modular** - Each system is independent and testable
2. **Type-Safe** - Full TypeScript with strict mode
3. **Extensible** - Clear hooks for future systems
4. **Configurable** - All settings in one place
5. **Zero Dependencies** - Pure TypeScript and Web APIs
6. **Performance** - 60 FPS target with efficient rendering

## 🧪 Testing

(Framework ready in package.json, tests to be added in Phase 2)

## 🤝 Contributing

This is a personal project for a TTRPG campaign, but the architecture is designed for collaboration:

1. Follow the modular structure
2. Add new systems in appropriate directories
3. Update Constants.ts for configuration
4. Document your changes
5. Keep TypeScript strict mode enabled

## 📈 Roadmap

### Phase 1 (✅ Complete)
- Map engine foundation
- Navigation controls
- Input system

### Phase 2 (Planned)
- Party movement tracking
- Path visualization
- Travel time calculation

### Phase 3 (Planned)
- Terrain visualization
- Movement cost modifiers
- Biome encounters

### Phase 4 (Planned)
- Monster territories
- Encounter generation
- Combat integration

### Phase 5 (Planned)
- Campaign persistence
- Story tracking
- Event timeline

## 📝 License

MIT - Use freely in personal or commercial projects

## 🎓 Learn More

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Deep dive into system design
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup and usage guide
- [PROJECT_MANIFEST.json](./PROJECT_MANIFEST.json) - Complete feature inventory

## 🐛 Troubleshooting

**Map not loading?**
- Ensure image exists at `assets/maps/tellene-map.png`
- Check browser console (F12) for errors
- Try a different image format

**Controls not responding?**
- Click on the map canvas to ensure it has focus
- Check browser DevTools for JavaScript errors
- Try different input methods

**Performance issues?**
- Use smaller resolution maps for testing
- Check browser DevTools Performance tab
- Reduce zoom level or pan less

---

**Built with ❤️ for the Tellene campaign**
