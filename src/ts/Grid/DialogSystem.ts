import BoxDialog from "../Box/BoxDialog";
import { Statement } from "../Enums/Statements";
import Camera from "../Render/Camera";
import Render from "../Render/Render";
import For from "../Statements/For";
import If from "../Statements/If";
import type { Point } from "../interfaces/Point";
import type { Rectangle } from "../interfaces/Rectangle";
import Grid from "./Grid";

export default class DialogSystem {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _grid: Grid;
  private _camera: Camera;
  private _currentDialogType: Statement = Statement.For;

  // for moving the grid
  private _dragBox: BoxDialog = null; // for dragging a box
  private _activeBox: BoxDialog = null; // for special actions on a active box

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

    if (!box) {
      this._deselectBox();
      this.draw();

      return;
    }

    this._selectBox(box);    

    this._startDrag(viewPos, box);
    Render.setLastBox(box); // adding to the render but not to the grid
    // Redraw the grid
    this.draw();
  }

  private _deselectBox(): void {
    if (!this._activeBox) return;

    this._activeBox.isSelected = false;
    this._activeBox = null;
  }

  private _selectBox(box: BoxDialog): void {
    // deselect last box
    this._deselectBox();

    this._activeBox = box;
    this._activeBox.isSelected = true;
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
    
    let box = this._createBox(this._currentDialogType, worldPos);
    
    this._selectBox(box);
    
    // TEST, add a box to the grid
    this._grid.addBox(box);

    // add it to the render boxes
    Render.addBox(box);
    

    // Redraw the grid
    this.draw();

    // TESTING ONLY
    if (this._currentDialogType === Statement.For) {
      this._currentDialogType = Statement.If;
    } else {
      this._currentDialogType = Statement.For;
    }
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
    this._dragBox = box;
    this._dragBox.startDrag(viewPos);    

    // remove from the grid array
    this._grid.removeBox(box);

    this.draw();
  }

  private _endDrag() : void {
    if (!this._dragBox) return;
    
    // Add the box to the grid
    this._grid.addBox(this._dragBox);
    
    this._dragBox = null;
  }

  private _handleDrag(event: MouseEvent) : void {
    if (!this._dragBox) return;

    this._dragBox.handleDrag(event);
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

  private _createBox(type: Statement, position: Point): BoxDialog {

    const size = { w: 100, h: 100 };
    const borderRadius = 10;
  
    switch (type) {
      case Statement.If:
        return new If(position, size, borderRadius, this._canvas, this._ctx);
      case Statement.For:
        return new For(position, size, borderRadius, this._canvas, this._ctx);
      // Add more cases for other statement types if needed
      default:
        throw new Error(`Unsupported statement type: ${type}`);
    }
  }
  
}