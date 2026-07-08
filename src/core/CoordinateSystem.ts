/**
 * Coordinate System Manager
 * 
 * Manages the mapping between world coordinates and screen coordinates.
 * This is the foundation for all location, marker, and measurement systems.
 * 
 * Key responsibilities:
 * - Convert between world space (map image pixels) and screen space (viewport)
 * - Track current camera position (pan) and zoom level
 * - Validate coordinates are within map bounds
 */

import Logger from '@utils/Logger';
import * as MathUtils from '@utils/MathUtils';
import { COORDINATE_CONFIG, MAP_CONFIG } from '@utils/Constants';
import {
  WorldCoordinate,
  ScreenCoordinate,
  WorldBounds,
} from '@data/Types';

class CoordinateSystem {
  // Map dimensions (in pixels, from the actual image)
  private mapWidth: number = 0;
  private mapHeight: number = 0;

  constructor(mapWidth: number, mapHeight: number) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    Logger.info('CoordinateSystem initialized', {
      mapWidth,
      mapHeight,
    });
  }

  // =========================================================================
  // COORDINATE CONVERSION
  // =========================================================================

  /**
   * Convert world coordinates to screen coordinates
   * @param world - World coordinate
   * @param panX - Current pan offset X (in pixels)
   * @param panY - Current pan offset Y (in pixels)
   * @param zoom - Current zoom level
   */
  worldToScreen(
    world: WorldCoordinate,
    panX: number,
    panY: number,
    zoom: number
  ): ScreenCoordinate {
    return MathUtils.worldToScreen(
      world.x,
      world.y,
      panX,
      panY,
      zoom
    );
  }

  /**
   * Convert screen coordinates to world coordinates
   * @param screen - Screen coordinate
   * @param panX - Current pan offset X (in pixels)
   * @param panY - Current pan offset Y (in pixels)
   * @param zoom - Current zoom level
   */
  screenToWorld(
    screen: ScreenCoordinate,
    panX: number,
    panY: number,
    zoom: number
  ): WorldCoordinate {
    const world = MathUtils.screenToWorld(
      screen.x,
      screen.y,
      panX,
      panY,
      zoom
    );
    return {
      x: MathUtils.roundTo(world.x, 2),
      y: MathUtils.roundTo(world.y, 2),
    };
  }

  // =========================================================================
  // BOUNDS AND VALIDATION
  // =========================================================================

  /**
   * Get the full map bounds in world coordinates
   */
  getMapBounds(): WorldBounds {
    return {
      x: 0,
      y: 0,
      width: this.mapWidth,
      height: this.mapHeight,
    };
  }

  /**
   * Check if a world coordinate is within the map
   */
  isWithinBounds(world: WorldCoordinate): boolean {
    return (
      world.x >= 0 &&
      world.x <= this.mapWidth &&
      world.y >= 0 &&
      world.y <= this.mapHeight
    );
  }

  /**
   * Clamp a world coordinate to map bounds
   */
  clampToBounds(world: WorldCoordinate): WorldCoordinate {
    return {
      x: MathUtils.clamp(world.x, 0, this.mapWidth),
      y: MathUtils.clamp(world.y, 0, this.mapHeight),
    };
  }

  /**
   * Get the visible world bounds given camera position and zoom
   * Useful for culling and determining what needs to be rendered
   */
  getVisibleBounds(
    canvasWidth: number,
    canvasHeight: number,
    panX: number,
    panY: number,
    zoom: number
  ): WorldBounds {
    // Convert screen corners to world space
    const topLeft = this.screenToWorld(
      { x: 0, y: 0 },
      panX,
      panY,
      zoom
    );
    const bottomRight = this.screenToWorld(
      { x: canvasWidth, y: canvasHeight },
      panX,
      panY,
      zoom
    );

    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Calculate distance between two world coordinates
   * Returns distance in world units (pixels)
   */
  distance(from: WorldCoordinate, to: WorldCoordinate): number {
    return MathUtils.distance(from.x, from.y, to.x, to.y);
  }

  /**
   * Get map dimensions
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.mapWidth,
      height: this.mapHeight,
    };
  }

  /**
   * Get the aspect ratio of the map
   */
  getAspectRatio(): number {
    return this.mapWidth / this.mapHeight;
  }

  /**
   * Format a world coordinate as a readable string
   * Useful for UI display
   */
  formatCoordinate(world: WorldCoordinate): string {
    return `(${MathUtils.roundTo(world.x, 1)}, ${MathUtils.roundTo(world.y, 1)})`;
  }
}

export default CoordinateSystem;
