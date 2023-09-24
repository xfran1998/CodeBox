import type { Point } from "../../interfaces/Point";
import type { Circle } from "../../interfaces/Circle";
import Component from "./Component";

export default class CircleComponent extends Component implements Circle {
  private _center: Point;
  private _radius: number;
  private _cuadDistToCenter: number;

  constructor(center: Point, radius: number) {
    super();
    this._center = center;
    this._radius = radius;

    this._cuadDistToCenter = this._radius * this._radius;
  }

  // Implementación de la interfaz Rectangle
  get center(): Point {
    return this._center;
  }

  set center(value: Point) {
    this._center = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }

  // Getters y setters
  get _x(): number {
    return this._center.x;
  }

  get _y(): number {
    return this._center.y;
  }

  public isTriggered(clickWorldPos: Point): boolean {
    const distToCenterQuad = (clickWorldPos.x - this._center.x) * (clickWorldPos.x - this._center.x) + (clickWorldPos.y - this._center.y) * (clickWorldPos.y - this._center.y);

    return distToCenterQuad <= this._cuadDistToCenter;
  }

  draw(ctx: CanvasRenderingContext2D, offset: Point): void {
    // draw a circle
    ctx.beginPath();
    ctx.arc(this.center.x + offset.x, this.center.y + offset.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeStyle = "#CCC";
    ctx.stroke();
    ctx.fillStyle = "#555";
    ctx.fill();
  }
}