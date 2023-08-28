import BoxDialog from "../Box/BoxDialog";
import Camera from "../Render/Camera";
import Render from "../Render/Render";
import type { Point } from "../interfaces/Point";
import type { Rectangle } from "../interfaces/Rectangle";
import Grid from "./Grid";

export default class DialogSystem {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _grid: Grid;
  private _camera: Camera;

  // for moving the grid
  private _activeBox: BoxDialog = null;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._camera = new Camera({ x: 0, y: 0 }, { w: canvas.width, h: canvas.height }, { w: 100, h: 100 });
    
    this._grid = new Grid({ w: canvas.width, h: canvas.height });
    
    Render.init({ x:  canvas.width/2, y: canvas.height/2 }, { w: 100, h: 100 }, { w: canvas.width, h: canvas.height }, this._grid, this._camera);
    this.draw();
  }

  public draw(): void {
    // Clear the canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw the grid
    Render.drawGrid(this._ctx, this._grid);
    
    // Draw the boxes
    Render.drawBoxes(this._ctx, this._grid, this._camera);
  }

  public handleLeftClick(event: MouseEvent): void {
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);

    // Check if the user clicked on a box
    const box = this._getBoxFromClick(worldPos);

    if (!box) return;

    this._startDrag(viewPos, box);
    Render.setLastBox(box); // adding to the render but not to the grid
    // Redraw the grid
    this.draw();
  }

  public handleLeftClickUp(event: MouseEvent): void {
    this._endDrag();
    // console.log(Render.renderBoxes);
  }

  public handleMouseMove(event: MouseEvent): void {
    this._handleDrag(event);
    // console.log(Render.renderBoxes);
  }

  public handleRightClick(event: MouseEvent): void {
    console.log('Right click');
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);

    console.log('worldPos: ', worldPos)
    
    const box = new BoxDialog( worldPos, {w: 100, h: 100}, 10, this._canvas, this._ctx);
    
    // TEST, add a box to the grid
    this._grid.addBox(box);

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

    const speed = 30;

    // Check is its left, right, up or down
    if (event.key === "ArrowLeft") {
      topLeftCell = this._camera.move({ x: -speed, y: 0 });
    } else if (event.key === "ArrowRight") {
      topLeftCell = this._camera.move({ x: speed, y: 0 });
    } else if (event.key === "ArrowUp") {
      topLeftCell = this._camera.move({ x: 0, y: -speed });
    } else if (event.key === "ArrowDown") {
      topLeftCell = this._camera.move({ x: 0, y: speed });
    }

    // Check if the camera moved
    if (topLeftCell) {
      // Update the render
      Render.updateRenderBoxes(this._grid);

    }

    // Redraw the grid
    this.draw();
  }

  private _startDrag(viewPos: Point, box: BoxDialog): void {
    this._activeBox = box;
    this._activeBox.startDrag(viewPos);    

    // remove from the grid array
    this._grid.removeBox(box);

    this.draw();
  }

  private _endDrag() : void {
    if (!this._activeBox) return;
    
    // Add the box to the grid
    this._grid.addBox(this._activeBox);
    
    this._activeBox = null;
  }

  private _handleDrag(event: MouseEvent) : void {
    if (!this._activeBox) return;

    this._activeBox.handleDrag(event);
    this.draw();
  }

  private _getBoxFromClick(clickPos: Point): BoxDialog {
    // Iterate over the render boxes
    for (let i = Render.renderBoxes.length-1; i >= 0; i--) {
      const box = Render.renderBoxes[i];

      // Check if the click is inside the box
      if (box.isTriggered(clickPos)) {
        return box;
      }
    }

    return null;
  }
}