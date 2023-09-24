import type { Point } from "../../interfaces/Point";
import Camera from "../../Render/Camera";
import Grid from "../../Grid/Grid";
import Render from "../../Render/Render";

export class GridDragHandler {
  private _camera: Camera;
  private _grid: Grid;
  private _draggingGrid: boolean = false;

  constructor(camera: Camera, grid: Grid) {
    this._camera = camera;
    this._grid = grid;
  }

  public startDrag(viewPost: Point): void {
    this._draggingGrid = true;

    this._camera.deltaPosition = viewPost;
  }

  public endDrag(): void {
    this._draggingGrid = false;
  }

  public handleDrag(event: MouseEvent): void {
    if (!this._draggingGrid) return;

    // Calculate the delta position
    const deltaPosition = {
      x: -(event.offsetX - this._camera.deltaPosition.x),
      y: -(event.offsetY - this._camera.deltaPosition.y),
    };

    // Move the camera
    this._camera.move(deltaPosition);

    this._camera.deltaPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };

    // Update the render
    Render.updateRenderBoxes(this._grid);
  }

  public isDragging(): boolean {
    return this._draggingGrid;
  }
}