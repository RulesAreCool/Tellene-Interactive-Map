/**
 * Core Map Engine
 * 
 * The main controller for the map application. Orchestrates:
 * - Map rendering
 * - Camera/viewport management (pan and zoom)
 * - Coordinate system
 * - Event dispatching
 * 
 * This is the heart of the application and interfaces between
 * all other systems (input, UI, data, etc.)
 */

import Logger from '@utils/Logger';
import * as MathUtils from '@utils/MathUtils';
import { MAP_CONFIG, INPUT_CONFIG, UI_CONFIG, DEBUG_CONFIG } from '@utils/Constants';
import MapRenderer from './MapRenderer';
import CoordinateSystem from './CoordinateSystem';
import { MapState, MapEvent, MapEventType, WorldCoordinate, ScreenCoordinate } from '@data/Types';

class MapEngine {
  private renderer: MapRenderer;
  private coordinateSystem: CoordinateSystem | null = null;
  private state: MapState = {
    zoom: MAP_CONFIG.defaultZoom,
    panX: 0,
    panY: 0,
    isLoading: false,
    isReady: false,
    error: null,
  };
  private eventListeners: Map<MapEventType, Set<(event: MapEvent) => void>> = new Map();
  private animationId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.renderer = new MapRenderer(canvasElement);
    Logger.info('MapEngine initialized');
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Initialize the map engine
   * @param mapImageUrl - URL to the map image
   */
  async initialize(mapImageUrl: string): Promise<void> {
    try {
      this.state.isLoading = true;
      this.dispatchEvent({
        type: MapEventType.MAP_LOADED,
        timestamp: Date.now(),
      });

      // Load the map image
      await this.renderer.loadMapImage(mapImageUrl);

      // Get map dimensions and set up coordinate system
      const mapDims = this.renderer.getMapImageDimensions();
      if (!mapDims) {
        throw new Error('Failed to get map dimensions');
      }

      this.coordinateSystem = new CoordinateSystem(mapDims.width, mapDims.height);

      // Center the map initially
      this.centerMap();

      this.state.isReady = true;
      this.state.isLoading = false;
      this.state.error = null;

      Logger.info('MapEngine ready', {
        mapDimensions: mapDims,
        initialZoom: this.state.zoom,
        initialPan: { x: this.state.panX, y: this.state.panY },
      });
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = error instanceof Error ? error.message : String(error);
      Logger.error('Failed to initialize MapEngine', { error });
      throw error;
    }
  }

  /**
   * Center the map in the viewport
   */
  private centerMap(): void {
    if (!this.renderer.isReady()) return;

    const mapDims = this.renderer.getMapImageDimensions();
    const canvasInfo = this.renderer.getCanvasInfo();

    if (!mapDims) return;

    // Center the map
    this.state.panX = (canvasInfo.width - mapDims.width * this.state.zoom) / 2;
    this.state.panY = (canvasInfo.height - mapDims.height * this.state.zoom) / 2;
  }

  // =========================================================================
  // PAN AND ZOOM
  // =========================================================================

  /**
   * Pan the map by a delta amount
   * @param deltaX - Change in X
   * @param deltaY - Change in Y
   */
  pan(deltaX: number, deltaY: number): void {
    this.state.panX += deltaX;
    this.state.panY += deltaY;
    this.clampPan();
    this.dispatchEvent({
      type: MapEventType.PAN_CHANGED,
      timestamp: Date.now(),
      data: { panX: this.state.panX, panY: this.state.panY },
    });
  }

  /**
   * Set pan to absolute position
   */
  setPan(x: number, y: number): void {
    this.state.panX = x;
    this.state.panY = y;
    this.clampPan();
    this.dispatchEvent({
      type: MapEventType.PAN_CHANGED,
      timestamp: Date.now(),
      data: { panX: this.state.panX, panY: this.state.panY },
    });
  }

  /**
   * Clamp pan to reasonable bounds
   * Prevents panning too far outside the map
   */
  private clampPan(): void {
    if (!this.renderer.isReady()) return;

    const mapDims = this.renderer.getMapImageDimensions();
    const canvasInfo = this.renderer.getCanvasInfo();

    if (!mapDims) return;

    const maxPanX = 0;
    const minPanX = canvasInfo.width - mapDims.width * this.state.zoom;
    const maxPanY = 0;
    const minPanY = canvasInfo.height - mapDims.height * this.state.zoom;

    this.state.panX = MathUtils.clamp(this.state.panX, minPanX, maxPanX);
    this.state.panY = MathUtils.clamp(this.state.panY, minPanY, maxPanY);
  }

  /**
   * Zoom in or out by a step
   * @param factor - Zoom multiplier (e.g., 1.1 for 10% zoom in)
   * @param screenX - Screen X position to zoom towards (optional, defaults to center)
   * @param screenY - Screen Y position to zoom towards (optional, defaults to center)
   */
  zoom(factor: number, screenX?: number, screenY?: number): void {
    const oldZoom = this.state.zoom;
    const newZoom = MathUtils.clamp(
      oldZoom * factor,
      MAP_CONFIG.minZoom,
      MAP_CONFIG.maxZoom
    );

    if (newZoom === oldZoom) return; // No change

    // If no screen position provided, zoom to center of canvas
    const canvasInfo = this.renderer.getCanvasInfo();
    const zoomX = screenX ?? canvasInfo.width / 2;
    const zoomY = screenY ?? canvasInfo.height / 2;

    // Adjust pan to zoom towards the point
    const scale = newZoom / oldZoom;
    this.state.panX = zoomX - (zoomX - this.state.panX) * scale;
    this.state.panY = zoomY - (zoomY - this.state.panY) * scale;

    this.state.zoom = newZoom;
    this.clampPan();

    this.dispatchEvent({
      type: MapEventType.ZOOM_CHANGED,
      timestamp: Date.now(),
      data: { zoom: this.state.zoom, screenX: zoomX, screenY: zoomY },
    });
  }

  /**
   * Set zoom to absolute value
   */
  setZoom(zoom: number): void {
    const clampedZoom = MathUtils.clamp(
      zoom,
      MAP_CONFIG.minZoom,
      MAP_CONFIG.maxZoom
    );
    if (clampedZoom !== this.state.zoom) {
      this.state.zoom = clampedZoom;
      this.clampPan();
      this.dispatchEvent({
        type: MapEventType.ZOOM_CHANGED,
        timestamp: Date.now(),
        data: { zoom: this.state.zoom },
      });
    }
  }

  /**
   * Reset view to default (centered and default zoom)
   */
  resetView(): void {
    this.state.zoom = MAP_CONFIG.defaultZoom;
    this.centerMap();
    this.dispatchEvent({
      type: MapEventType.ZOOM_CHANGED,
      timestamp: Date.now(),
      data: { zoom: this.state.zoom },
    });
  }

  // =========================================================================
  // COORDINATE QUERIES
  // =========================================================================

  /**
   * Get world coordinates for a screen position
   */
  getWorldCoordinates(screenX: number, screenY: number): WorldCoordinate | null {
    if (!this.coordinateSystem) return null;

    const screen: ScreenCoordinate = { x: screenX, y: screenY };
    return this.coordinateSystem.screenToWorld(
      screen,
      this.state.panX,
      this.state.panY,
      this.state.zoom
    );
  }

  /**
   * Get screen coordinates for a world position
   */
  getScreenCoordinates(worldX: number, worldY: number): ScreenCoordinate | null {
    if (!this.coordinateSystem) return null;

    const world: WorldCoordinate = { x: worldX, y: worldY };
    return this.coordinateSystem.worldToScreen(
      world,
      this.state.panX,
      this.state.panY,
      this.state.zoom
    );
  }

  /**
   * Check if a world coordinate is within map bounds
   */
  isWithinBounds(worldX: number, worldY: number): boolean {
    if (!this.coordinateSystem) return false;
    return this.coordinateSystem.isWithinBounds({ x: worldX, y: worldY });
  }

  // =========================================================================
  // RENDERING
  // =========================================================================

  /**
   * Render a single frame
   * Called by the animation loop
   */
  render(): void {
    const canvasInfo = this.renderer.getCanvasInfo();

    // Clear canvas
    this.renderer.clear(UI_CONFIG.backgroundColor);

    // Draw the map
    if (this.renderer.isReady()) {
      this.renderer.drawMap(this.state.panX, this.state.panY, this.state.zoom);

      // Draw debug features if enabled
      if (DEBUG_CONFIG.renderCoordinateGrid) {
        this.renderer.drawDebugGrid(100, this.state.panX, this.state.panY, this.state.zoom);
      }
    }
  }

  /**
   * Start the animation/render loop
   */
  startRenderLoop(): void {
    const loop = () => {
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
    Logger.info('Render loop started');
  }

  /**
   * Stop the animation/render loop
   */
  stopRenderLoop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      Logger.info('Render loop stopped');
    }
  }

  // =========================================================================
  // STATE GETTERS
  // =========================================================================

  getState(): Readonly<MapState> {
    return { ...this.state };
  }

  isReady(): boolean {
    return this.state.isReady;
  }

  getZoom(): number {
    return this.state.zoom;
  }

  getPan(): { x: number; y: number } {
    return { x: this.state.panX, y: this.state.panY };
  }

  getCoordinateSystem(): CoordinateSystem | null {
    return this.coordinateSystem;
  }

  // =========================================================================
  // EVENT SYSTEM
  // =========================================================================

  /**
   * Subscribe to map events
   */
  on(eventType: MapEventType, listener: (event: MapEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.eventListeners.get(eventType)?.delete(listener);
    };
  }

  /**
   * Dispatch an event to all listeners
   */
  private dispatchEvent(event: MapEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Cleanup and teardown
   */
  destroy(): void {
    this.stopRenderLoop();
    this.eventListeners.clear();
    Logger.info('MapEngine destroyed');
  }
}

export default MapEngine;
