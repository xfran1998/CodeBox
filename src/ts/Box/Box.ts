import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";
import BoxComponent from "./Components/BoxComponent";

export default class Box extends BoxComponent {
  private _isSelected: boolean = false;

  constructor(topLeft: Point, size: Size) {
    super(topLeft, size);
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
  }

  public move(deltaPosition: Point): void {
    // Change current position
    this.changePosition({ x: this.topLeft.x + deltaPosition.x, y: this.topLeft.y + deltaPosition.y });
  }

  public changePosition(newPosition: Point): void {
    this.topLeft = newPosition;
  }

  public isTriggered(clickWorldPos: Point): boolean {
    return (
      clickWorldPos.x >= this.topLeft.x &&
      clickWorldPos.x <= this.topLeft.x + this.size.w &&
      clickWorldPos.y >= this.topLeft.y &&
      clickWorldPos.y <= this.topLeft.y + this.size.h
    );
  }
}




