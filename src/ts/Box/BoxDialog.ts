import type Camera from "../Render/Camera";
import Render from "../Render/Render";
import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";
import Box from "./Box";

class BoxDialog extends Box {
  private _borderRadius: number;
  private _fillColor: string;
  private _offsetX: number = 0;
  private _offsetY: number = 0;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(
    position: Point,
    size: Size,
    borderRadius: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    fillColor: string = 'white',
  ) {
    super(position, size);
    this._borderRadius = borderRadius;
    this._fillColor = fillColor;
    this._canvas = canvas;
    this._ctx = ctx;

    console.log('BoxDialog created');
  }

  public startDrag(viewPos: Point) {
    this._offsetX = viewPos.x;
    this._offsetY = viewPos.y;
  }

  public handleDrag(event: MouseEvent) {
    this.changePosition({ x: this.topLeft.x + (event.offsetX - this._offsetX), y: this.topLeft.y + (event.offsetY - this._offsetY) });
    
    this._offsetX = event.offsetX;
    this._offsetY = event.offsetY;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Get world position
    const viewPos = Render.worldToView(this.topLeft);
    
    // draw a rectangle with rounded corners
    ctx.beginPath();
    ctx.moveTo(viewPos.x + this._borderRadius, viewPos.y);
    ctx.moveTo(viewPos.x + this._borderRadius, viewPos.y);
    ctx.lineTo(viewPos.x + this._w - this._borderRadius, viewPos.y);
    ctx.quadraticCurveTo(viewPos.x + this._w, viewPos.y, viewPos.x + this._w, viewPos.y + this._borderRadius);
    ctx.lineTo(viewPos.x + this._w, viewPos.y + this._h - this._borderRadius);
    ctx.quadraticCurveTo(viewPos.x + this._w, viewPos.y + this._h, viewPos.x + this._w - this._borderRadius, viewPos.y + this._h);
    ctx.lineTo(viewPos.x + this._borderRadius, viewPos.y + this._h);
    ctx.quadraticCurveTo(viewPos.x, viewPos.y + this._h, viewPos.x, viewPos.y + this._h - this._borderRadius);
    ctx.lineTo(viewPos.x, viewPos.y + this._borderRadius);
    ctx.quadraticCurveTo(viewPos.x, viewPos.y, viewPos.x + this._borderRadius, viewPos.y);
    ctx.stroke();
    ctx.fillStyle = this._fillColor;
    ctx.fill();
  }

  public isDraggableBarClicked(event: MouseEvent) {
    return (
      event.offsetX > this._x &&
      event.offsetX < this._x + this._w &&
      event.offsetY > this._y &&
      event.offsetY < this._y + this._h
    );
  }
}

export default BoxDialog;