import type { Variable } from "../../Enums/Variable";
import type { Point } from "../../interfaces/Point";
import type { Size } from "../../interfaces/Size";
import Box from "../Box";
import CircleComponent from "./CircleComponent";

export default class VariableComponent extends CircleComponent {
  private type: Variable;

  constructor(center: Point, radius: number, type: Variable) {
    super(center, radius);

    this.type = type;
  }

  draw(ctx: CanvasRenderingContext2D, offset: Point) {
    super.draw(ctx, offset);
  }
}