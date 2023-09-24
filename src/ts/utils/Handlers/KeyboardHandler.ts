import type { Point } from "../../interfaces/Point";
import Camera from "../../Render/Camera";
import Grid from "../../Grid/Grid";
import Render from "../../Render/Render";
import type { Rectangle } from "../../interfaces/Rectangle";

export class KeyboardHandler {
  private _camera: Camera;
  private _grid: Grid;
  private _draw: () => void;
  private handleDragWithKeyboard: (move: Point) => void;

  constructor(camera: Camera, grid: Grid, draw: () => void, handleDragWithKeyboard: (move: Point) => void) {
    this._camera = camera;
    this._grid = grid;
    this._draw = draw;
    this.handleDragWithKeyboard = handleDragWithKeyboard;
  }

  public handleKeyDown(event: KeyboardEvent): void {
    // Check if the user pressed the delete key
    if (event.key === "Delete") {
    }

    let topLeftCell: Rectangle = null;

    const speed = 30;
    let move : Point = null;

    // Check is its left, right, up or down
    if (event.key === "ArrowLeft") {
      move = { x: -speed, y: 0 };
    } else if (event.key === "ArrowRight") {
      move = { x: speed, y: 0 };
    } else if (event.key === "ArrowUp") {
      move = { x: 0, y: -speed };
    } else if (event.key === "ArrowDown") {
      move = { x: 0, y: speed };
    }
    
    if (move) {
      topLeftCell = this._camera.move(move);
      
      this.handleDragWithKeyboard(move);
    }

    // Check if the camera moved
    if (topLeftCell) {
      // Update the render
      Render.updateRenderBoxes(this._grid);
    }

    // Redraw the grid
    this._draw();
  }
}