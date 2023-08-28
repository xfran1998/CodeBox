import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";
import type { Rectangle } from "../interfaces/Rectangle";

export default class Box implements Rectangle {
  private _topLeft: Point;
  private _size: Size;
  private _isSelected: boolean = false;

  constructor(topLeft: Point, size: Size) {
    this._topLeft = topLeft;
    this._size = size;
  }

  // Implementación de la interfaz Rectangle
  get topLeft(): Point {
    return this._topLeft;
  }

  get size(): Size {
    return this._size;
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

  public changePosition(newPosition: Point): void {
    this._topLeft = newPosition;
  }

  public isTriggered(clickPos: Point): boolean {
    return (
      clickPos.x >= this._topLeft.x &&
      clickPos.x <= this._topLeft.x + this._size.w &&
      clickPos.y >= this._topLeft.y &&
      clickPos.y <= this._topLeft.y + this._size.h
    );
  }
}




