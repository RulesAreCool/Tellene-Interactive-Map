/**
 * Application Entry Point
 * 
 * Initializes the entire map application by:
 * 1. Setting up the canvas
 * 2. Creating the map engine
 * 3. Loading the map image
 * 4. Setting up input handling
 * 5. Creating the UI
 * 6. Starting the render loop
 * 
 * This is where everything comes together
 */

import Logger from '@utils/Logger';
import { MAP_CONFIG } from '@utils/Constants';
import MapEngine from '@core/MapEngine';
import InputManager from '@input/InputManager';
import UIController from '@ui/UIController';
import DataManager from '@data/DataManager';

/**
 * Main application class
 * Orchestrates all systems
 */
class TelleneMapApplication {
  private canvas: HTMLCanvasElement;
  private mapEngine: MapEngine;
  private inputManager: InputManager;
  private uiController: UIController;
  private dataManager: DataManager;

  constructor(canvasId: string = 'map-canvas') {
    Logger.info('Initializing Tellene Interactive Map Application');

    // Get or create canvas
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      document.body.appendChild(canvas);
    }
    this.canvas = canvas;

    // Initialize core systems
    this.mapEngine = new MapEngine(canvas);
    this.dataManager = new DataManager();
    this.inputManager = new InputManager(canvas, this.mapEngine);
    this.uiController = new UIController(canvas, this.mapEngine, this.inputManager);
  }

  /**
   * Initialize the application with a map image
   * @param mapImageUrl - URL to the map image
   */
  async initialize(mapImageUrl: string = MAP_CONFIG.defaultMapImagePath): Promise<void> {
    try {
      Logger.info('Initializing application');

      // Setup canvas
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // Initialize map engine
      await this.mapEngine.initialize(mapImageUrl);

      // Start rendering
      this.mapEngine.startRenderLoop();

      // Show UI
      this.uiController.showAll();

      Logger.info('Application initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize application', { error });
      throw error;
    }
  }

  /**
   * Handle canvas resize
   */
  private resizeCanvas(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = this.mapEngine['renderer']; // Access private renderer
    if (renderer && renderer.resizeCanvas) {
      renderer.resizeCanvas(width, height);
    }
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Get public API for accessing the application
   */
  getAPI(): {
    mapEngine: MapEngine;
    dataManager: DataManager;
    uiController: UIController;
  } {
    return {
      mapEngine: this.mapEngine,
      dataManager: this.dataManager,
      uiController: this.uiController,
    };
  }

  /**
   * Shutdown the application
   */
  destroy(): void {
    Logger.info('Shutting down application');
    this.mapEngine.stopRenderLoop();
    this.inputManager.destroy();
    this.uiController.destroy();
    this.mapEngine.destroy();
  }
}

// Export the application class
export default TelleneMapApplication;

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = new TelleneMapApplication('map-canvas');
    await app.initialize();

    // Make app available globally for debugging
    (window as any).TelleneMap = {
      app,
      api: app.getAPI(),
    };

    Logger.info('Application ready! Access via window.TelleneMap');
  } catch (error) {
    Logger.error('Failed to start application', { error });
  }
});
