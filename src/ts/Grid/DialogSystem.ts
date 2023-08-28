import BoxDialog from "../Box/BoxDialog";
import Camera from "../Render/Camera";
import Render from "../Render/Render";
import type { Rectangle } from "../interfaces/Rectangle";
import Grid from "./Grid";

export default class DialogSystem {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _grid: Grid;
  private _camera: Camera;

  // for moving the grid
  private _isDragging: boolean = false;
  private _offsetX: number = 0;
  private _offsetY: number = 0;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._camera = new Camera({ x: 0, y: 0 }, { w: canvas.width, h: canvas.height }, { w: 100, h: 100 });
    
    this._grid = new Grid({ w: canvas.width, h: canvas.height });
    
    Render.init({ x:  canvas.width/2, y: canvas.height/2 }, { w: 100, h: 100 }, { w: canvas.width, h: canvas.height }, this._grid, this._camera);
    this.draw();
  }

  public startDrag(event: MouseEvent) : void {
    this._isDragging = true;
    this._offsetX = event.offsetX;
    this._offsetY = event.offsetY;
  }

  public endDrag() : void {
    this._isDragging = false;
  }

  public handleDrag(event: MouseEvent) : void {
    if (!this._isDragging) return;

    // Calculate the new position of the grid
    const deltaPos = {
      x: event.offsetX - this._offsetX,
      y: event.offsetY - this._offsetY,
    };

    // Move the grid
    this._grid.move(deltaPos);

    // Update the offset
    this._offsetX = event.offsetX;
    this._offsetY = event.offsetY;
  }

  public draw(): void {
    // Clear the canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw the grid
    Render.drawGrid(this._ctx, this._grid);
    
    // Draw the boxes
    Render.drawBoxes(this._ctx, this._grid, this._camera);
  }

  public handleRightClick(event: MouseEvent): void {
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);

    console.log('worldPos: ', worldPos)

    const boxTest = new BoxDialog( worldPos, {w: 100, h: 100}, 10, this._canvas, this._ctx);

    // TEST, add a box to the grid
    this._grid.addBox(boxTest, worldPos);

    // update the render
    Render.updateRenderBoxes(this._grid, true);

    // Redraw the grid
    this.draw();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    // Check if the user pressed the delete key
    if (event.key === "Delete") {
    }

    let topLeftCell: Rectangle = null;

    // Check is its left, right, up or down
    if (event.key === "ArrowLeft") {
      topLeftCell = this._camera.move({ x: -10, y: 0 });
    } else if (event.key === "ArrowRight") {
      topLeftCell = this._camera.move({ x: 10, y: 0 });
    } else if (event.key === "ArrowUp") {
      topLeftCell = this._camera.move({ x: 0, y: -10 });
    } else if (event.key === "ArrowDown") {
      topLeftCell = this._camera.move({ x: 0, y: 10 });
    }

    // Check if the camera moved
    if (topLeftCell) {
      // Update the render
      Render.updateRenderBoxes(this._grid);

    }

    // Redraw the grid
    this.draw();
  }
//   public addBoxDialog(boxDialog: BoxDialog) : void{
//     this._grid.addBoxDialog(boxDialog);
//   }
}