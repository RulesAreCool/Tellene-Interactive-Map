/**
 * Centralized Configuration
 * 
 * All "magic numbers" and configuration values are defined here.
 * This makes it easy to tune behavior without digging through code.
 */

// ============================================================================
// MAP CONFIGURATION
// ============================================================================

export const MAP_CONFIG = {
  // Default zoom level (1 = 100%, 0.5 = 50%, 2 = 200%)
  defaultZoom: 1,

  // Zoom constraints
  minZoom: 0.5,
  maxZoom: 4,

  // Default map image path
  defaultMapImagePath: 'assets/maps/tellene-map.webp',

  // Canvas background color
  backgroundColor: '#1a1a1a',
};

// ============================================================================
// INPUT CONFIGURATION
// ============================================================================

export const INPUT_CONFIG = {
  // Pan sensitivity (higher = more responsive)
  panSensitivity: 1,

  // Mouse wheel zoom sensitivity
  wheelZoomSensitivity: 0.1,

  // Touch pinch zoom sensitivity
  pinchZoomSensitivity: 0.01,

  // Double-tap zoom multiplier
  doubleTapZoomFactor: 1.5,

  // Pan speed with arrow keys (pixels per frame)
  keyboardPanSpeed: 10,

  // Zoom speed with +/- keys
  keyboardZoomFactor: 1.1,

  // Double-click detection window (ms)
  doubleTapWindow: 300,

  // Minimum distance for drag (pixels) - prevents accidental pans
  dragThreshold: 5,
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
  // Show coordinate display
  showCoordinateDisplay: true,

  // Update frequency for coordinate display (ms)
  updateCoordinateFrequency: 100,

  // Zoom button step amount
  zoomButtonStep: 0.2,

  // Background color
  backgroundColor: '#000000',

  // Text color for coordinates
  cursorCoordinateColor: '#00FF00',

  // Button hover color
  buttonHoverColor: 'rgba(100, 150, 255, 1)',

  // Button normal color
  buttonNormalColor: 'rgba(100, 150, 255, 0.8)',
};

// ============================================================================
// DEBUG CONFIGURATION
// ============================================================================

export const DEBUG_CONFIG = {
  // Enable console logging
  enableLogging: true,

  // Log level: 'debug' | 'info' | 'warn' | 'error'
  logLevel: 'info',

  // Render coordinate grid overlay
  renderCoordinateGrid: false,

  // Grid spacing (pixels)
  gridSpacing: 100,

  // Show FPS counter (future feature)
  showFPS: false,

  // Verbose event logging
  logEvents: false,
};

// ============================================================================
// PERFORMANCE CONFIGURATION
// ============================================================================

export const PERFORMANCE_CONFIG = {
  // Target frames per second
  targetFPS: 60,

  // Debounce resize events (ms)
  resizeDebounce: 250,

  // Canvas rendering quality
  pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
};
