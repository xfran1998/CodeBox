import type { Point } from "../../interfaces/Point";
import type { Rectangle } from "../../interfaces/Rectangle";
import type { Size } from "../../interfaces/Size";
import Component from "./Component";

export default class BoxComponent extends Component implements Rectangle {
  private _topLeft: Point;
  private _size: Size;

  constructor(topLeft: Point, size: Size) {
    super();
    this._topLeft = topLeft;
    this._size = size;
  }

  // Implementación de la interfaz Rectangle
  get topLeft(): Point {
    return this._topLeft;
  }

  set topLeft(value: Point) {
    this._topLeft = value;
  }

  get size(): Size {
    return this._size;
  }

  set size(value: Size) {
    this._size = value;
  }

  // Getters y setters
  get _x(): number {
    return this._topLeft.x;
  }

  get _y(): number {
    return this._topLeft.y;
  }

  get _w(): number {
    return this._size.w;
  }

  get _h(): number {
    return this._size.h;
  }

  public isTriggered(clickWorldPos: Point): boolean {
    return (
      clickWorldPos.x >= this._topLeft.x &&
      clickWorldPos.x <= this._topLeft.x + this._size.w &&
      clickWorldPos.y >= this._topLeft.y &&
      clickWorldPos.y <= this._topLeft.y + this._size.h
    );
  }
}