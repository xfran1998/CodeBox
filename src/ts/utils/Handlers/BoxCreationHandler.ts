import BoxDialog from "../../Box/BoxDialog";
import { Statement } from "../../Enums/Statements";
import type { Point } from "../../interfaces/Point";
import Grid from "../../Grid/Grid";
import If from "../../Statements/If";
import For from "../../Statements/For";

export class BoxCreationHandler {
  private _grid: Grid;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(grid: Grid, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this._grid = grid;
    this._canvas = canvas;
    this._ctx = ctx;
  }

  public createBox(type: Statement, position: Point): BoxDialog {

    const size = { w: 100, h: 100 };
    const borderRadius = 10;
  
/*
export enum Statement {
  If = "If",
  While = "While",
  For = "For",
  Switch = "Switch",
  Function = "Function",
  Class = "Class",
  // Interface = "Interface",
  // Enum = "Enum",
  // Variable = "Variable",
  // Constant = "Constant",
  // Comment = "Comment",
}*/

    switch (type) {
      case Statement.If:
        return new If(position, size, borderRadius, this._canvas, this._ctx);
      case Statement.For:
        return new For(position, size, borderRadius, this._canvas, this._ctx);
      // Add more cases for other statement types if needed
      default:
        throw new Error(`Unsupported statement type: ${type}`);
    }
  }
}