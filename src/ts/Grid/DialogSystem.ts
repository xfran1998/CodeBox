import BoxDialog from "../Box/BoxDialog";
import { Statement } from "../Enums/Statements";
import Camera from "../Render/Camera";
import Render from "../Render/Render";
import type { Point } from "../interfaces/Point";
import type { Rectangle } from "../interfaces/Rectangle";
import Grid from "./Grid";
import { BoxDragHandler } from "../utils/Handlers/BoxDragHandler";
import { GridDragHandler } from "../utils/Handlers/GridDragHandler";
import { BoxSelectionHandler } from "../utils/Handlers/BoxSelectionHandler";
import { BoxCreationHandler } from "../utils/Handlers/BoxCreationHandler";
import { KeyboardHandler } from "../utils/Handlers/KeyboardHandler";

export default class DialogSystem {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _grid: Grid;
  private _camera: Camera;
  private _currentDialogType: Statement | null = null

  private _boxDragHandler: BoxDragHandler;
  private _gridDragHandler: GridDragHandler;
  private _boxSelectionHandler: BoxSelectionHandler;
  private _boxCreationHandler: BoxCreationHandler;
  private _keyboardHandler: KeyboardHandler;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._camera = new Camera({ x: 0, y: 0 }, { w: canvas.width, h: canvas.height }, { w: 100, h: 100 });
    
    this._grid = new Grid({ w: canvas.width, h: canvas.height });
    
    Render.init({ x:  canvas.width/2, y: canvas.height/2 }, { w: 100, h: 100 }, { w: canvas.width, h: canvas.height }, this._grid, this._camera);
    this.draw();

    this._boxDragHandler = new BoxDragHandler(this._grid);
    this._gridDragHandler = new GridDragHandler(this._camera, this._grid);
    this._boxSelectionHandler = new BoxSelectionHandler(this._grid);
    this._boxCreationHandler = new BoxCreationHandler(this._grid, this._canvas, this._ctx);
    this._keyboardHandler = new KeyboardHandler(this._camera, this._grid, this.draw.bind(this), this._boxDragHandler.handleDragWithKeyboard.bind(this._boxDragHandler));
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

    // console.log(`length boxes: ${Render.getBoxesRender().length}`)
    // console.log(`length buffer boxes: ${Render.getBufferBoxesRender().length}`)
  }

  public handleLeftClick(event: MouseEvent): void {
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);

    // Check if the user clicked on a box
    const box = this._boxSelectionHandler.getBoxFromClick(worldPos);

    if (!box) {
      this._boxSelectionHandler.deselectBox();
      
      this._gridDragHandler.startDrag(viewPos);

      this.draw();
      return;
    }

    this._boxSelectionHandler.selectBox(box);    

    this._boxDragHandler.startDrag(viewPos, box);
    // Redraw the grid
    this.draw();
  }

  public handleLeftClickUp(event: MouseEvent): void {
    if (this._gridDragHandler.isDragging()) {
      this._gridDragHandler.endDrag();
      return;
    }

    this._boxDragHandler.endDrag();
  }

  public handleMouseMove(event: MouseEvent): void {
    if (this._gridDragHandler.isDragging()) {
      this._gridDragHandler.handleDrag(event);
      this.draw();
      return;
    }

    this._boxDragHandler.handleDrag(event);
    this.draw();
  }

  public handleRightClick(event: MouseEvent): void {
    // Calculate the position of the click
    const viewPos = {
      x: event.offsetX,
      y: event.offsetY,
    };

    const worldPos = Render.viewToWorld(viewPos);
    
    let box = this._boxCreationHandler.createBox(this._currentDialogType, worldPos);
    
    this._boxSelectionHandler.selectBox(box);

    // add a box to the grid
    this._grid.addBox(box);

    // add it to the render boxes
    Render.addBox(box);
    
    // Redraw the grid
    this.draw();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    this._keyboardHandler.handleKeyDown(event);
  }

  public 
}