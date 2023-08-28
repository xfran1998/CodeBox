import type { Point } from "../interfaces/Point";
import type { Rectangle } from "../interfaces/Rectangle";
import type { Size } from "../interfaces/Size";

/*

<-------------- width------------->
|---------------------------------|   ^
|                                 |   |
|                                 |   |
|                                 |   |
|                                 |   |
|           (Camera pos)          |   |
|                x                | Height
|                                 |   |
|                                 |   |
|                                 |   |
|                                 |   |
|                                 |   |
|---------------------------------|   v

*/
export default class Camera {
  private _position: Point;
  private _size: Size;
  private _cellSize: Size;

  constructor(position: Point, size: Size, cellSize: Size) {
    this._position = position;
    this._size = size;
    this._cellSize = cellSize;
  }

  public get position(): Point {
    return this._position;
  }

  public get size(): Size {
    return this._size;
  }

  public get cellSize(): Size {
    return this._cellSize;
  }

  public getTopLeftCell(): Rectangle {
    const centerCameraCell: Point = {
      x: Math.floor(this._position.x / this._cellSize.w),
      y: Math.floor(this._position.y / this._cellSize.h),
    };

    const topLeftCell: Point = {
      x: centerCameraCell.x - Math.floor(this._size.w / 2 / this._cellSize.w),
      y: centerCameraCell.y - Math.floor(this._size.h / 2 / this._cellSize.h),
    };

    // console.log('position: ', this.position);
    // console.log('topLeftCell: ', topLeftCell);

    return {
      topLeft: topLeftCell,
      size: this._size,
    };
  }

  public move(deltaPosition: Point): Rectangle {
    this._position.x += deltaPosition.x;
    this._position.y += deltaPosition.y;

    return this.getTopLeftCell();
  }
}