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
  private _currentDialogType: Statement | null = null

  // for moving the box in the grid
  private _dragBox: BoxDialog = null; // for dragging a box
  private _activeBox: BoxDialog = null; // for special actions on a active box

  // for drawing the grid
  private _draggingGrid: boolean = false;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._camera = new Camera({ x: 0, y: 0 }, { w: canvas.width, h: canvas.height }, { w: 100, h: 100 });
    
    this._grid = new Grid({ w: canvas.width, h: canvas.height });
    
    Render.init({ x:  canvas.width/2, y: canvas.height/2 }, { w: 100, h: 100 }, { w: canvas.width, h: canvas.height }, this._grid, this._camera);
    this.draw();
  }

  set currentDialogType(type: Statement | null) {
    this._currentDialogType = type;
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
      
      this._startDrag(viewPos);

      this.draw();
      return;
    }

    this._selectBox(box);    

    this._startBoxDrag(viewPos, box);
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
    if (this._draggingGrid) {
      this._endDrag();
      return;
    }

    this._endBoxDrag();
  }

  public handleMouseMove(event: MouseEvent): void {
    if (this._draggingGrid) {
      this._handleDrag(event);
      return;
    }

    this._handleBoxDrag(event);

       
  }

  public handleRightClick(event: MouseEvent): void {
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);
    
    let box = this._createBox(this._currentDialogType, worldPos);
    
    this._selectBox(box);

    // add a box to the grid
    this._grid.addBox(box);

    // add it to the render boxes
    Render.addBox(box);
    
    // Redraw the grid
    this.draw();
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
      
      if (this._dragBox) {
        this._dragBox.move(move);
      }
    }

    // Check if the camera moved
    if (topLeftCell) {
      // Update the render
      Render.updateRenderBoxes(this._grid);
    }

    // Redraw the grid
    this.draw();
  }

  private _startDrag(viewPost: Point): void {
    this._draggingGrid = true;

    this._camera.deltaPosition = viewPost;
  }

  private _startBoxDrag(viewPos: Point, box: BoxDialog): void {
    this._dragBox = box;
    this._dragBox.startDrag(viewPos);    

    // remove from the grid array
    this._grid.removeBox(box);

    this._setBoxToBufferRender(box);

    this.draw();
  }

  private _endDrag(): void {
    this._draggingGrid = false;
  }

  private _endBoxDrag() : void {
    if (!this._dragBox) return;
    
    console.log("Ending box drag");

    // Add the box to the grid
    this._grid.addBox(this._dragBox);

    this._setBoxToRender(this._dragBox);

    this._dragBox = null;
  }

  private _handleDrag(event: MouseEvent): void {
    if (!this._draggingGrid) return;

    // Calculate the delta position
    const deltaPosition = {
      x: -(event.offsetX - this._camera.deltaPosition.x),
      y: -(event.offsetY - this._camera.deltaPosition.y),
    };

    // Move the camera
    this._camera.move(deltaPosition);

    if (this._dragBox) {
      this._dragBox.move(deltaPosition);
    }

    this._camera.deltaPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };

    // Update the render
    Render.updateRenderBoxes(this._grid);

    // Redraw the grid
    this.draw();
  }

  private _handleBoxDrag(event: MouseEvent) : void {
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

    // Iterate over the buffer render boxes
    for (let i = Render.bufferRenderBoxes.length - 1; i >= 0; i--) {
      const box = Render.bufferRenderBoxes[i];

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
  
/*
export enum Statement {
  If = "If",
  While = "While",
  For = "For",
  Switch = "Switch",
  Function = "Function",
  Class = "Class",
  // Interface = "Interface",
  // Enum = "Enum",
  // Variable = "Variable",
  // Constant = "Constant",
  // Comment = "Comment",
}*/

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