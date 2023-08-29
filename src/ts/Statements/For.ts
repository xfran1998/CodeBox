import BoxDialog from "../Box/BoxDialog";
import { Statement } from "../Enums/Statements";
import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";

export default class For extends BoxDialog{
  constructor(
    position: Point,
    size: Size,
    borderRadius: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    fillColor: string = 'white',
  ) {
    super(position, size, borderRadius, canvas, ctx, fillColor, Statement.For);
  }
}