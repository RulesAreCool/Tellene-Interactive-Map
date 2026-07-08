/**
 * Input Manager
 * 
 * Centralizes all input handling
 * Manages mouse, touch, and keyboard inputs
 */

import Logger from '@utils/Logger';
import MapEngine from '@core/MapEngine';
import MouseHandler from './MouseHandler';
import TouchHandler from './TouchHandler';

class InputManager {
  private mapEngine: MapEngine;
  private mouseHandler: MouseHandler;
  private touchHandler: TouchHandler;
  private canvas: HTMLCanvasElement;

  constructor(canvasElement: HTMLCanvasElement, mapEngine: MapEngine) {
    this.canvas = canvasElement;
    this.mapEngine = mapEngine;

    this.mouseHandler = new MouseHandler(canvasElement, mapEngine);
    this.touchHandler = new TouchHandler(canvasElement, mapEngine);

    this.setupKeyboardInput();
    Logger.info('InputManager initialized');
  }

  // =========================================================================
  // KEYBOARD INPUT
  // =========================================================================

  private setupKeyboardInput(): void {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      // Reset view
      case 'r':
      case 'R':
        this.mapEngine.resetView();
        break;

      // Zoom in
      case '+':
      case '=':
        event.preventDefault();
        this.mapEngine.zoom(1.2);
        break;

      // Zoom out
      case '-':
      case '_':
        event.preventDefault();
        this.mapEngine.zoom(0.8);
        break;

      // Arrow keys for panning (if enabled)
      case 'ArrowUp':
        event.preventDefault();
        this.mapEngine.pan(0, 20);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.mapEngine.pan(0, -20);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.mapEngine.pan(20, 0);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.mapEngine.pan(-20, 0);
        break;
    }
  }

  // =========================================================================
  // GETTERS
  // =========================================================================

  /**
   * Get current mouse position
   */
  getMousePosition(): { x: number; y: number } {
    return this.mouseHandler.getMousePosition();
  }

  /**
   * Get current mouse position in world coordinates
   */
  getWorldMousePosition(): { x: number; y: number } | null {
    return this.mouseHandler.getWorldMousePosition();
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  destroy(): void {
    this.mouseHandler.destroy();
    this.touchHandler.destroy();
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
    Logger.info('InputManager destroyed');
  }
}

export default InputManager;
