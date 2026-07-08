/**
 * Touch Input Handler
 * 
 * Handles touch-based interactions for mobile/tablet:
 * - Single finger drag to pan
 * - Two finger pinch to zoom
 * - Double tap to zoom in
 * - Long press for context menu (future)
 */

import Logger from '@utils/Logger';
import { INPUT_CONFIG } from '@utils/Constants';
import * as MathUtils from '@utils/MathUtils';
import MapEngine from '@core/MapEngine';

class TouchHandler {
  private mapEngine: MapEngine;
  private canvas: HTMLCanvasElement;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private lastTouchDistance: number = 0;
  private lastTouchTime: number = 0;
  private doubleTapTimer: NodeJS.Timeout | null = null;

  constructor(canvasElement: HTMLCanvasElement, mapEngine: MapEngine) {
    this.canvas = canvasElement;
    this.mapEngine = mapEngine;

    this.setupEventListeners();
    Logger.info('TouchHandler initialized');
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
  }

  // =========================================================================
  // TOUCH CALCULATIONS
  // =========================================================================

  /**
   * Calculate distance between two touch points
   */
  private getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get center point between two touches
   */
  private getTouchCenterPoint(
    touch1: Touch,
    touch2: Touch
  ): { x: number; y: number } {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  private onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.lastTouchTime = Date.now();

    // Check for double tap
    if (Date.now() - this.lastTouchTime < 300) {
      this.handleDoubleTap(event);
    }

    if (event.touches.length === 2) {
      // Two fingers - prepare for pinch zoom
      this.lastTouchDistance = this.getTouchDistance(
        event.touches[0],
        event.touches[1]
      );
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 1) {
      // Single finger pan
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      this.mapEngine.pan(deltaX, deltaY);

      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    } else if (event.touches.length === 2) {
      // Two finger pinch zoom
      const currentDistance = this.getTouchDistance(
        event.touches[0],
        event.touches[1]
      );

      if (this.lastTouchDistance > INPUT_CONFIG.touchZoomMinDistance) {
        const zoomFactor = currentDistance / this.lastTouchDistance;
        const centerPoint = this.getTouchCenterPoint(
          event.touches[0],
          event.touches[1]
        );
        const rect = this.canvas.getBoundingClientRect();

        this.mapEngine.zoom(
          zoomFactor,
          centerPoint.x - rect.left,
          centerPoint.y - rect.top
        );
      }

      this.lastTouchDistance = currentDistance;
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    // Touch ended - nothing to do for now
    this.lastTouchTime = Date.now();
  }

  /**
   * Handle double tap zoom
   */
  private handleDoubleTap(event: TouchEvent): void {
    if (this.doubleTapTimer) {
      clearTimeout(this.doubleTapTimer);
    }

    const touch = event.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const screenX = touch.clientX - rect.left;
    const screenY = touch.clientY - rect.top;

    this.mapEngine.zoom(INPUT_CONFIG.doubleTapZoomFactor, screenX, screenY);

    this.doubleTapTimer = setTimeout(() => {
      this.doubleTapTimer = null;
    }, 300);
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  destroy(): void {
    this.canvas.removeEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this));
    if (this.doubleTapTimer) {
      clearTimeout(this.doubleTapTimer);
    }
    Logger.info('TouchHandler destroyed');
  }
}

export default TouchHandler;
