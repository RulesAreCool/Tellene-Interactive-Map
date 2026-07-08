/**
 * Map Renderer
 * 
 * Handles all rendering operations on the canvas.
 * Separates rendering logic from game logic and input handling.
 * 
 * Responsibilities:
 * - Clear canvas
 * - Draw map image
 * - Draw debug information
 * - Apply transformations (pan, zoom)
 */

import Logger from '@utils/Logger';
import { CanvasInfo } from '@data/Types';
import { DEBUG_CONFIG } from '@utils/Constants';

class MapRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private mapImage: HTMLImageElement | null = null;
  private isMapImageLoaded: boolean = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.context = ctx;

    Logger.info('MapRenderer initialized');
  }

  // =========================================================================
  // MAP IMAGE LOADING
  // =========================================================================

  /**
   * Load a map image
   * @param imageUrl - URL to the map image
   * @returns Promise that resolves when image is loaded
   */
  async loadMapImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.mapImage = img;
        this.isMapImageLoaded = true;
        Logger.info('Map image loaded successfully', {
          width: img.width,
          height: img.height,
        });
        resolve();
      };

      img.onerror = () => {
        Logger.error('Failed to load map image', { url: imageUrl });
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Check if map image is loaded
   */
  isReady(): boolean {
    return this.isMapImageLoaded && this.mapImage !== null;
  }

  /**
   * Get loaded map image dimensions
   */
  getMapImageDimensions(): { width: number; height: number } | null {
    if (!this.mapImage) return null;
    return {
      width: this.mapImage.width,
      height: this.mapImage.height,
    };
  }

  // =========================================================================
  // RENDERING
  // =========================================================================

  /**
   * Clear the canvas
   */
  clear(backgroundColor: string = '#1a1a1a'): void {
    this.context.fillStyle = backgroundColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the map image with current transformations
   * @param panX - Pan offset X
   * @param panY - Pan offset Y
   * @param zoom - Zoom level
   */
  drawMap(panX: number, panY: number, zoom: number): void {
    if (!this.isMapImageLoaded || !this.mapImage) {
      Logger.warn('Attempted to draw map but image not loaded');
      return;
    }

    this.context.save();

    // Apply camera transformations
    this.context.translate(panX, panY);
    this.context.scale(zoom, zoom);

    // Draw the map image at origin
    this.context.drawImage(this.mapImage, 0, 0);

    this.context.restore();
  }

  /**
   * Draw a debug grid on the map
   * Useful for visualizing the coordinate system
   */
  drawDebugGrid(
    gridSize: number,
    panX: number,
    panY: number,
    zoom: number,
    color: string = 'rgba(255, 255, 255, 0.1)'
  ): void {
    if (!DEBUG_CONFIG.renderCoordinateGrid) return;

    const mapDims = this.getMapImageDimensions();
    if (!mapDims) return;

    this.context.save();

    this.context.translate(panX, panY);
    this.context.scale(zoom, zoom);

    this.context.strokeStyle = color;
    this.context.lineWidth = 1 / zoom; // Keep lines thin regardless of zoom

    // Draw vertical lines
    for (let x = 0; x <= mapDims.width; x += gridSize) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, mapDims.height);
      this.context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= mapDims.height; y += gridSize) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(mapDims.width, y);
      this.context.stroke();
    }

    this.context.restore();
  }

  /**
   * Draw debug bounding boxes
   * Useful for visualizing regions
   */
  drawDebugBoundingBox(
    x: number,
    y: number,
    width: number,
    height: number,
    panX: number,
    panY: number,
    zoom: number,
    color: string = 'rgba(255, 0, 0, 0.3)'
  ): void {
    if (!DEBUG_CONFIG.showBoundingBoxes) return;

    this.context.save();

    this.context.translate(panX, panY);
    this.context.scale(zoom, zoom);

    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);

    this.context.restore();
  }

  // =========================================================================
  // CANVAS MANAGEMENT
  // =========================================================================

  /**
   * Get canvas info
   */
  getCanvasInfo(): CanvasInfo {
    const pixelRatio = window.devicePixelRatio || 1;
    return {
      canvas: this.canvas,
      context: this.context,
      width: this.canvas.width,
      height: this.canvas.height,
      pixelRatio,
    };
  }

  /**
   * Resize canvas to fit container
   * Should be called on window resize
   */
  resizeCanvas(width: number, height: number): void {
    const pixelRatio = window.devicePixelRatio || 1;

    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;

    // Scale context to account for pixel ratio
    this.context.scale(pixelRatio, pixelRatio);

    Logger.debug('Canvas resized', {
      width: width,
      height: height,
      pixelRatio,
    });
  }
}

export default MapRenderer;
