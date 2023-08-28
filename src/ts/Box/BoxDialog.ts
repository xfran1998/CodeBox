import type Camera from "../Render/Camera";
import Render from "../Render/Render";
import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";
import Box from "./Box";

class BoxDialog extends Box {
  private _borderRadius: number;
  private _fillColor: string;
  private _isDragging: boolean = false;
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

  public startDrag(event: MouseEvent) {
    this._isDragging = true;
    this._offsetX = event.offsetX - this._x;
    this._offsetY = event.offsetY - this._y;
  }

  public endDrag() {
    this._isDragging = false;
  }

  public handleDrag(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    if (this._isDragging) {
      this.changePosition({ x: event.offsetX - this._offsetX, y: event.offsetY - this._offsetY });

      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this.draw(ctx);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    // Get world position
    const worldPos = Render.worldToView(this.topLeft);
    
    // draw a rectangle with rounded corners
    ctx.beginPath();
    ctx.moveTo(worldPos.x + this._borderRadius, worldPos.y);
    ctx.moveTo(worldPos.x + this._borderRadius, worldPos.y);
    ctx.lineTo(worldPos.x + this._w - this._borderRadius, worldPos.y);
    ctx.quadraticCurveTo(worldPos.x + this._w, worldPos.y, worldPos.x + this._w, worldPos.y + this._borderRadius);
    ctx.lineTo(worldPos.x + this._w, worldPos.y + this._h - this._borderRadius);
    ctx.quadraticCurveTo(worldPos.x + this._w, worldPos.y + this._h, worldPos.x + this._w - this._borderRadius, worldPos.y + this._h);
    ctx.lineTo(worldPos.x + this._borderRadius, worldPos.y + this._h);
    ctx.quadraticCurveTo(worldPos.x, worldPos.y + this._h, worldPos.x, worldPos.y + this._h - this._borderRadius);
    ctx.lineTo(worldPos.x, worldPos.y + this._borderRadius);
    ctx.quadraticCurveTo(worldPos.x, worldPos.y, worldPos.x + this._borderRadius, worldPos.y);
    ctx.stroke();
    ctx.fillStyle = this._fillColor;
    ctx.fill();

    // console.log('BoxDialog drawn');
    // console.log('BoxDialog position: ', this._x, this._y)
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