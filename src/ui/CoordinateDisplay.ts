/**
 * Coordinate Display
 * 
 * UI component that shows the current cursor position in world coordinates
 * Updates as the player moves the cursor and respects configuration settings
 */

import Logger from '@utils/Logger';
import { UI_CONFIG } from '@utils/Constants';
import MapEngine from '@core/MapEngine';
import InputManager from '@input/InputManager';

class CoordinateDisplay {
  private container: HTMLDivElement;
  private mapEngine: MapEngine;
  private inputManager: InputManager;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(
    containerId: string,
    mapEngine: MapEngine,
    inputManager: InputManager
  ) {
    this.mapEngine = mapEngine;
    this.inputManager = inputManager;

    // Get or create container
    let container = document.getElementById(containerId) as HTMLDivElement;
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    this.container = container;
    this.setupStyles();
    this.startUpdating();

    Logger.info('CoordinateDisplay initialized');
  }

  private setupStyles(): void {
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: ${UI_CONFIG.cursorCoordinateColor};
      padding: 10px 15px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      pointer-events: none;
      z-index: 1000;
    `;
  }

  private startUpdating(): void {
    if (!UI_CONFIG.showCoordinateDisplay) {
      this.container.style.display = 'none';
      return;
    }

    this.updateInterval = setInterval(() => {
      this.update();
    }, UI_CONFIG.updateCoordinateFrequency);
  }

  private update(): void {
    const worldCoords = this.inputManager.getWorldMousePosition();
    const mousePos = this.inputManager.getMousePosition();

    if (worldCoords) {
      this.container.innerHTML = `
        <div>World: (${worldCoords.x.toFixed(1)}, ${worldCoords.y.toFixed(1)})</div>
        <div>Screen: (${mousePos.x.toFixed(0)}, ${mousePos.y.toFixed(0)})</div>
        <div>Zoom: ${(this.mapEngine.getZoom() * 100).toFixed(0)}%</div>
      `;
    }
  }

  show(): void {
    this.container.style.display = 'block';
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.container.remove();
    Logger.info('CoordinateDisplay destroyed');
  }
}

export default CoordinateDisplay;
