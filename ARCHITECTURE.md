# Phase 1 Architecture Overview

## System Breakdown

### Core Systems (`src/core/`)

**MapEngine.ts** - The orchestrator
- Manages pan, zoom, and viewport
- Coordinates between rendering and coordinate systems
- Handles camera transformations
- Dispatches events
- Public API: `pan()`, `zoom()`, `getWorldCoordinates()`, etc.

**MapRenderer.ts** - Canvas drawing
- Loads and caches map image
- Handles all canvas operations
- Applies transformations (pan, zoom)
- Draws debug overlays
- Public API: `loadMapImage()`, `drawMap()`, `resizeCanvas()`, etc.

**CoordinateSystem.ts** - Space conversion
- Converts between world and screen coordinates
- Validates bounds
- Provides map information
- Independent of viewport
- Public API: `worldToScreen()`, `screenToWorld()`, `isWithinBounds()`, etc.

### Input Systems (`src/input/`)

**InputManager.ts** - Centralizes all input
- Routes keyboard, mouse, and touch events
- Delegates to specific handlers
- Provides input query interface
- Public API: `getMousePosition()`, `getWorldMousePosition()`

**MouseHandler.ts** - Desktop mouse input
- Left-click drag to pan
- Mouse wheel to zoom
- Coordinate tracking
- Cursor management

**TouchHandler.ts** - Mobile/touch input
- Single-finger drag to pan
- Two-finger pinch to zoom
- Double-tap zoom
- Touch-specific event handling

### UI Systems (`src/ui/`)

**UIController.ts** - UI orchestrator
- Manages all UI components
- Provides methods to show/hide UI
- Integrates components with engine
- Public API: `getControlPanel()`, `showAll()`, `hideAll()`

**ControlPanel.ts** - Interactive controls
- Zoom in/out buttons
- Reset view button
- Control instructions
- Framework for adding future tools

**CoordinateDisplay.ts** - Information overlay
- Shows current cursor position (world space)
- Shows current cursor position (screen space)
- Shows current zoom level
- Updates in real-time

### Data Systems (`src/data/`)

**Types.ts** - TypeScript definitions
- All interfaces and types
- Enums for type-safe values
- Placeholder types for future systems

**DataManager.ts** - Central data management
- Stores locations, markers, terrain, zones, measurements
- Provides CRUD operations
- No persistence (yet)
- Public API: `addLocation()`, `getMarker()`, `clearAll()`, etc.

**Placeholders/** - Future system scaffolding
- LocationData.ts - Location management framework
- MarkerData.ts - Marker management framework
- TerrainRegions.ts - Terrain system framework
- ZoneData.ts - Zone management framework
- MeasurementData.ts - Measurement tools framework

### Utilities (`src/utils/`)

**Constants.ts** - Centralized configuration
- All "magic numbers" are here
- Easy to adjust without code changes
- Organized by system

**MathUtils.ts** - Mathematical operations
- Coordinate conversions
- Distance calculations
- Clamping and interpolation

**Logger.ts** - Logging utility
- Respects debug settings
- Provides different log levels
- Helps with troubleshooting

## Data Flow

### User Interaction Flow
```
User Input
    ↓
InputManager routes to specific handler (Mouse/Touch/Keyboard)
    ↓
Handler calls MapEngine methods (pan, zoom)
    ↓
MapEngine updates internal state
    ↓
MapEngine dispatches events
    ↓
Render loop picks up new state
    ↓
MapRenderer draws based on new state
    ↓
Canvas displays result
```

### Coordinate Query Flow
```
User moves cursor
    ↓
MouseHandler tracks position
    ↓
CoordinateDisplay queries InputManager
    ↓
InputManager queries MapEngine.getWorldCoordinates()
    ↓
MapEngine uses CoordinateSystem to convert
    ↓
CoordinateDisplay shows result
```

### Pan/Zoom Calculation
```
MapEngine.pan() or MapEngine.zoom() called
    ↓
State updated
    ↓
clampPan() ensures valid viewport
    ↓
Event dispatched to listeners
    ↓
Render loop notices state change
    ↓
MapRenderer applies transformation (translate, scale)
    ↓
Map drawn at new position/zoom
```

## Extension Points (Future Phases)

### Adding Markers in Phase 2
1. DataManager already has `addMarker()` and `getMarker()`
2. Create MarkerRenderer in MapRenderer
3. Call from MapEngine.render() loop
4. Add marker UI in ControlPanel

### Adding Terrain in Phase 3
1. TerrainRegions placeholder is ready
2. Create TerrainRenderer
3. Draw terrain data in MapRenderer
4. TerrainManager provides terrain queries

### Adding Campaign State in Phase 4
1. DataManager extended with campaign data
2. Add save/load system
3. Integrate with UI for display
4. Track state changes

## Key Design Principles

### Separation of Concerns
- Rendering is separate from logic
- Input is separate from business logic
- UI is separate from engine
- Each system has one responsibility

### Configuration Over Hard-coding
- All settings in Constants.ts
- No magic numbers scattered throughout code
- Easy to tune behavior

### Event-Driven Architecture
- Systems communicate via events
- Loose coupling between components
- Easy to add listeners in future

### Type Safety
- Full TypeScript with strict mode
- All types defined in Types.ts
- Future data systems have clear contracts

### Extensibility
- Clear placeholder structures
- Framework for adding new tools
- DataManager prepared for all data types
- Render loop can accommodate new layers

## File Organization Rationale

```
src/
├── core/           # Pure engine logic, no UI/input
├── input/          # User interaction handlers
├── ui/             # Visual interface
├── data/           # Data structures and management
└── utils/          # Shared utilities

public/            # Web assets
assets/            # Game data (maps, images, etc.)
```

This structure makes it easy to:
- Find related code
- Add new features
- Test components in isolation
- Reuse code in future projects
