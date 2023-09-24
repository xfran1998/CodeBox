import type { Point } from "../../interfaces/Point";
import type { Size } from "../../interfaces/Size";
import Box from "../Box";

export default class ActionComponent extends Box {
  constructor(topLeft: Point, size: Size) {
    super(topLeft, size);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    console.log("ActionComponent draw", ctx);
  }
}