/**
 * Control Panel
 * 
 * UI component containing buttons and controls for the map
 * Includes zoom controls and other interactive elements
 * Designed to be easily extended with new tools in future phases
 */

import Logger from '@utils/Logger';
import { MAP_CONFIG, UI_CONFIG } from '@utils/Constants';
import MapEngine from '@core/MapEngine';

class ControlPanel {
  private container: HTMLDivElement;
  private mapEngine: MapEngine;

  constructor(containerId: string, mapEngine: MapEngine) {
    this.mapEngine = mapEngine;

    // Get or create container
    let container = document.getElementById(containerId) as HTMLDivElement;
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    this.container = container;
    this.setupStyles();
    this.createControls();

    Logger.info('ControlPanel initialized');
  }

  private setupStyles(): void {
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 15px;
      z-index: 1000;
    `;
  }

  private createControls(): void {
    // Title
    const title = document.createElement('div');
    title.style.cssText = `
      color: #FFFFFF;
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
    `;
    title.textContent = 'Map Controls';
    this.container.appendChild(title);

    // Zoom in button
    const zoomInBtn = this.createButton('Zoom In (+)', () => {
      this.mapEngine.zoom(1 + UI_CONFIG.zoomButtonStep);
    });
    this.container.appendChild(zoomInBtn);

    // Zoom out button
    const zoomOutBtn = this.createButton('Zoom Out (-)', () => {
      this.mapEngine.zoom(1 - UI_CONFIG.zoomButtonStep);
    });
    this.container.appendChild(zoomOutBtn);

    // Reset view button
    const resetBtn = this.createButton('Reset View (R)', () => {
      this.mapEngine.resetView();
    });
    this.container.appendChild(resetBtn);

    // Divider
    const divider = document.createElement('hr');
    divider.style.cssText = `
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      margin: 10px 0;
    `;
    this.container.appendChild(divider);

    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      line-height: 1.4;
    `;
    instructions.innerHTML = `
      <div><strong>Controls:</strong></div>
      <div>Left Click + Drag: Pan</div>
      <div>Mouse Wheel: Zoom</div>
      <div>Arrow Keys: Pan</div>
      <div>+/- Keys: Zoom</div>
      <div>R Key: Reset</div>
    `;
    this.container.appendChild(instructions);

    // Placeholder section for future tools
    const futureSection = document.createElement('div');
    futureSection.style.cssText = `
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
    `;
    futureSection.innerHTML = `
      <div><em>Future tools will appear here:</em></div>
      <div>• Marker placement</div>
      <div>• Location naming</div>
      <div>• Measurement tool</div>
      <div>• Campaign state</div>
    `;
    this.container.appendChild(futureSection);
  }

  private createButton(
    text: string,
    onclick: () => void
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = onclick;
    btn.style.cssText = `
      padding: 8px 12px;
      background: rgba(100, 150, 255, 0.8);
      color: white;
      border: 1px solid rgba(100, 150, 255, 1);
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    `;

    btn.onmouseover = () => {
      btn.style.background = 'rgba(100, 150, 255, 1)';
    };

    btn.onmouseout = () => {
      btn.style.background = 'rgba(100, 150, 255, 0.8)';
    };

    return btn;
  }

  /**
   * Add a new tool button to the panel
   * Used by future phases to extend the UI
   */
  addToolButton(label: string, callback: () => void): HTMLButtonElement {
    const btn = this.createButton(label, callback);
    this.container.appendChild(btn);
    return btn;
  }

  show(): void {
    this.container.style.display = 'flex';
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  destroy(): void {
    this.container.remove();
    Logger.info('ControlPanel destroyed');
  }
}

export default ControlPanel;
