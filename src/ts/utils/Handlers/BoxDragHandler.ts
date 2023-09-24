import BoxDialog from "../../Box/BoxDialog";
import type { Point } from "../../interfaces/Point";
import Grid from "../../Grid/Grid";
import Render from "../../Render/Render";

export class BoxDragHandler {
  private _grid: Grid;
  private _dragBox: BoxDialog = null;

  constructor(grid: Grid) {
    this._grid = grid;
  }

  public startDrag(viewPos: Point, box: BoxDialog): void {
    this._dragBox = box;
    this._dragBox.startDrag(viewPos);    

    // remove from the grid array
    this._grid.removeBox(box);

    this._setBoxToBufferRender(box);
  }

  public endDrag() : void {
    if (!this._dragBox) return;
    
    console.log("Ending box drag, pos: ", this._dragBox._x, this._dragBox._y);

    // Add the box to the grid
    this._grid.addBox(this._dragBox);

    this._setBoxToRender(this._dragBox);

    this._dragBox = null;
  }

  public handleDrag(event: MouseEvent) : void {
    if (!this._dragBox) return;

    this._dragBox.handleDrag(event);
  }

  public handleDragWithKeyboard(move: Point): void {
    if (!this._dragBox) return;

    this._dragBox.move(move);
  }
  

  private _setBoxToBufferRender(box: BoxDialog): void {
    // remove it from the render array
    Render.removeBox(box);

    // add it to the buffer array
    Render.addBufferBox(box);
  }

  private _setBoxToRender(box: BoxDialog): void {
    // remove it from the buffer array
    Render.removeBufferBox(box);

    // add it to the render array
    Render.addBox(box);
  }
}