# Getting Started

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- A modern web browser

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RulesAreCool/Tellene-Interactive-Map.git
   cd Tellene-Interactive-Map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your map image**
   - Place your map image file in `assets/maps/`
   - Name it `tellene-map.png` (or update the path in `src/utils/Constants.ts`)
   - Recommended size: 2048x2048 or larger

## Development

### Run Development Server

```bash
npm run dev
```

This starts Webpack dev server at `http://localhost:8080` with hot reload.

### Build for Production

```bash
npm run build
```

Output goes to `dist/` directory.

### Type Checking

```bash
npm run type-check
```

Verify TypeScript types without building.

### Linting

```bash
npm run lint
```

Check code style with ESLint.

## Usage

### Basic Map Display

The application initializes automatically when you open it. The map will:
1. Load the image
2. Center in the viewport
3. Display zoom and pan controls

### Navigation

**Mouse:**
- **Left Click + Drag** - Pan around the map
- **Mouse Wheel** - Zoom in/out
- **Right Click** - (Currently unused, available for future features)

**Keyboard:**
- **Arrow Keys** - Pan in cardinal directions
- **+/-** - Zoom in/out
- **R** - Reset view to default

**Touch (Mobile):**
- **Single Finger Drag** - Pan
- **Two Finger Pinch** - Zoom
- **Double Tap** - Zoom in at tap location

### UI Elements

**Control Panel** (top-left)
- Zoom In/Out buttons
- Reset View button
- Current control instructions
- Placeholder area for future tools

**Coordinate Display** (bottom-right)
- Current world coordinates under cursor
- Current screen coordinates
- Current zoom percentage

## Configuration

All settings are in `src/utils/Constants.ts`. You can adjust:

- **Zoom limits** - `MAP_CONFIG.minZoom`, `MAP_CONFIG.maxZoom`
- **Pan sensitivity** - `INPUT_CONFIG.panSensitivity`
- **Wheel zoom speed** - `INPUT_CONFIG.wheelZoomSensitivity`
- **Debug features** - `DEBUG_CONFIG.enableLogging`, etc.

## Accessing the API

When running in a browser, the application is available as:

```javascript
// Access the API
window.TelleneMap.app        // Main application instance
window.TelleneMap.api        // Public API object

// Example usage
const { mapEngine, dataManager, uiController } = window.TelleneMap.api;

// Get current zoom
console.log(mapEngine.getZoom());

// Pan the map
mapEngine.pan(100, 50);

// Subscribe to events
mapEngine.on('zoom:changed', (event) => {
  console.log('New zoom level:', event.data.zoom);
});

// Add data
dataManager.addLocation({
  id: 'town-1',
  name: 'Riverside',
  worldCoordinate: { x: 500, y: 300 },
  type: 'town'
});
```

## Project Structure

```
Tellene-Interactive-Map/
├── src/
│   ├── core/               # Map engine
│   ├── input/              # Input handlers
│   ├── ui/                 # UI components
│   ├── data/               # Data management
│   │   └── placeholders/   # Future system templates
│   ├── utils/              # Utilities
│   └── index.ts            # Entry point
├── public/
���   ├── index.html          # HTML template
│   └── styles.css          # Styles
├── assets/
│   └── maps/               # Map images
├── dist/                   # Built output
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Troubleshooting

### Map image not loading?
- Check the image path in `src/utils/Constants.ts`
- Ensure the image file exists in `assets/maps/`
- Check browser console for error messages
- Try a different image format (PNG, JPG, WebP)

### Performance issues with large maps?
- Enable debug logging: Set `DEBUG_CONFIG.enableLogging = true` in Constants.ts
- Check that zoom level is reasonable (not too far zoomed in on high-res map)
- Consider reducing image resolution
- Profile with browser DevTools (F12)

### Controls not working?
- Check that canvas has focus (click on the map)
- Verify keyboard event listeners in InputManager
- Check browser console for JavaScript errors
- Try a different input method (mouse vs touch vs keyboard)

## Next Steps

This Phase 1 foundation is ready for:
- **Phase 2** - Party movement system
- **Phase 3** - Terrain mechanics
- **Phase 4** - Encounter system
- **Phase 5** - Campaign persistence

See `ARCHITECTURE.md` for information about extending the system.

## Support

For issues or questions:
1. Check the console (F12) for error messages
2. Review `ARCHITECTURE.md` for system design
3. Check the inline code comments
4. Open an issue on GitHub

## License

MIT
