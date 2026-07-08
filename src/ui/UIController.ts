/**
 * UI Controller
 * 
 * Manages all UI components and integrates them with the map engine
 * Provides a clean interface for showing/hiding UI elements
 */

import Logger from '@utils/Logger';
import MapEngine from '@core/MapEngine';
import InputManager from '@input/InputManager';
import ControlPanel from './ControlPanel';
import CoordinateDisplay from './CoordinateDisplay';

class UIController {
  private mapEngine: MapEngine;
  private inputManager: InputManager;
  private controlPanel: ControlPanel;
  private coordinateDisplay: CoordinateDisplay;

  constructor(
    canvasElement: HTMLCanvasElement,
    mapEngine: MapEngine,
    inputManager: InputManager
  ) {
    this.mapEngine = mapEngine;
    this.inputManager = inputManager;

    // Initialize UI components
    this.controlPanel = new ControlPanel('map-control-panel', mapEngine);
    this.coordinateDisplay = new CoordinateDisplay(
      'map-coordinate-display',
      mapEngine,
      inputManager
    );

    this.setupPageStyles();
    Logger.info('UIController initialized');
  }

  /**
   * Setup page-level styles
   */
  private setupPageStyles(): void {
    // Set up body styles
    document.body.style.cssText = `
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #000;
      font-family: Arial, sans-serif;
    `;

    // Set up main container if needed
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
    }
  }

  /**
   * Show all UI elements
   */
  showAll(): void {
    this.controlPanel.show();
    this.coordinateDisplay.show();
  }

  /**
   * Hide all UI elements
   */
  hideAll(): void {
    this.controlPanel.hide();
    this.coordinateDisplay.hide();
  }

  /**
   * Get the control panel for adding custom buttons
   */
  getControlPanel(): ControlPanel {
    return this.controlPanel;
  }

  /**
   * Cleanup and teardown
   */
  destroy(): void {
    this.controlPanel.destroy();
    this.coordinateDisplay.destroy();
    Logger.info('UIController destroyed');
  }
}

export default UIController;
