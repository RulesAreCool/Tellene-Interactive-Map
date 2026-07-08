/**
 * Mouse Input Handler
 * 
 * Handles all mouse-based interactions:
 * - Pan/drag with left mouse button
 * - Zoom with mouse wheel or right click
 * - Coordinate tracking for UI display
 */

import Logger from '@utils/Logger';
import { INPUT_CONFIG } from '@utils/Constants';
import MapEngine from '@core/MapEngine';

class MouseHandler {
  private mapEngine: MapEngine;
  private canvas: HTMLCanvasElement;
  private isPanning: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(canvasElement: HTMLCanvasElement, mapEngine: MapEngine) {
    this.canvas = canvasElement;
    this.mapEngine = mapEngine;

    this.setupEventListeners();
    Logger.info('MouseHandler initialized');
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  private onMouseDown(event: MouseEvent): void {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    // Left button for panning
    if (event.button === INPUT_CONFIG.panButton) {
      this.isPanning = true;
      this.canvas.style.cursor = 'grabbing';
    }
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;

    if (this.isPanning) {
      const deltaX = event.clientX - this.lastMouseX;
      const deltaY = event.clientY - this.lastMouseY;

      this.mapEngine.pan(
        deltaX * INPUT_CONFIG.panSensitivity,
        deltaY * INPUT_CONFIG.panSensitivity
      );

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (event.button === INPUT_CONFIG.panButton) {
      this.isPanning = false;
      this.canvas.style.cursor = 'grab';
    }
  }

  private onMouseLeave(): void {
    this.isPanning = false;
    this.canvas.style.cursor = 'default';
  }

  private onMouseWheel(event: WheelEvent): void {
    event.preventDefault();

    // Determine zoom direction
    const direction = event.deltaY > 0 ? -1 : 1;
    const zoomFactor = 1 + direction * INPUT_CONFIG.wheelZoomSensitivity;

    // Zoom towards mouse position
    const rect = this.canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    this.mapEngine.zoom(zoomFactor, screenX, screenY);
  }

  // =========================================================================
  // GETTERS
  // =========================================================================

  /**
   * Get current mouse position on canvas (screen space)
   */
  getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  /**
   * Get current mouse position in world space
   */
  getWorldMousePosition(): { x: number; y: number } | null {
    const coords = this.mapEngine.getWorldCoordinates(this.mouseX, this.mouseY);
    return coords ? { x: coords.x, y: coords.y } : null;
  }

  /**
   * Check if currently panning
   */
  isPanningActive(): boolean {
    return this.isPanning;
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('wheel', this.onMouseWheel.bind(this));
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    Logger.info('MouseHandler destroyed');
  }
}

export default MouseHandler;
