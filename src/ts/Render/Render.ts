import type BoxDialog from "../Box/BoxDialog";
import type Grid from "../Grid/Grid";
import type { Point } from "../interfaces/Point";
import type { Rectangle } from "../interfaces/Rectangle";
import type { Size } from "../interfaces/Size";
import type Camera from "./Camera";

export default class Render {
  private static _topLeftCell: Rectangle;
  private static _numRowsRender: number;
  private static _numColumnsRender: number;
  private static _renderBoxes: Array<BoxDialog> = [];
  private static _mainCamera: Camera;
  private static readonly offserRenderCells: number = 2; // number of cells to render outside the camera (in case a box is bigger than a cell and its outside the camera)

  public static readonly zoomFactor: number = 1.0;

  private static _cellSize: Size;
  private static readonly _extraRenderCells: number = 2;

  public static init(
    topLeft: Point,
    cellSize: Size,
    canvaSize: Size,
    refGrid: Grid,
    camera: Camera
  ): void {
    console.log("Render init");
    Render._mainCamera = camera;

    Render._numRowsRender =
      Math.ceil(canvaSize.h / (cellSize.h * Render.zoomFactor)) +
      Render._extraRenderCells;
    Render._numColumnsRender =
      Math.ceil(canvaSize.w / (cellSize.w * Render.zoomFactor)) +
      Render._extraRenderCells;

    Render._cellSize = cellSize;

    Render._renderBoxes = [];
    Render._topLeftCell = {
      topLeft: topLeft,
      size: cellSize
    };
  }

  public static updateRenderBoxes(refGrid: Grid, hardReload: boolean = false): void {
    let topLeftCell: Point = Render._mainCamera.getTopLeftCell().topLeft;
    console.log("topLeftCell: ", topLeftCell);
    
    // add the offset to the topLeftCell
    topLeftCell.x -= Render.offserRenderCells;
    topLeftCell.y -= Render.offserRenderCells;
    
    // check if the topLeftCell is the same in case not update the renderBoxes
    if (topLeftCell.x === Render._topLeftCell.topLeft.x && topLeftCell.y === Render._topLeftCell.topLeft.y && !hardReload) {
      return;
    }
    
    Render._renderBoxes = [];

    console.log("updateRenderBoxes");

    // iterate over the rows and columns to get all the boxes inside the render area
    for (let i = Render._numRowsRender+Render.offserRenderCells; i >= 0; i--) {
      for (let j = Render._numColumnsRender+Render.offserRenderCells; j >= 0; j--) {
        const key: string = `${i + topLeftCell.y}-${
          j + topLeftCell.x
          }`;
        
        console.log("key: ", key);
        if (refGrid.grid.has(key)) {
          Render._renderBoxes.push(...refGrid.grid.get(key)!);
        }
      }
    }

    Render._topLeftCell.topLeft = topLeftCell;
    console.log(refGrid.grid);
    console.log("Render._renderBoxes: ", Render._renderBoxes);
  }

  public static drawGrid(ctx: CanvasRenderingContext2D, grid: Grid): void {
    // Draw the grid
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    const startLeft = -Render._mainCamera.position.x % Render._cellSize.w;
    const startTop = -Render._mainCamera.position.y % Render._cellSize.h;

    // Cambia el color de las líneas
    ctx.strokeStyle = "#ddd5"; // Por ejemplo, "red", "#00ff00", "rgba(255, 0, 0, 0.5)"

    // Cambia el grosor de las líneas
    ctx.lineWidth = 1; // Por ejemplo, 2, 3, 5, etc.

    // Dibuja las filas
    for (let i = 0; i < Render._numRowsRender; i++) {
      ctx.beginPath();
      ctx.moveTo(0, startTop + i * Render._cellSize.h);
      ctx.lineTo(Render._mainCamera.size.w, startTop + i * Render._cellSize.h);
      ctx.stroke();
    }

    // Dibuja las columnas
    for (let i = 0; i < Render._numRowsRender; i++) {
      ctx.beginPath();
      ctx.moveTo(startLeft + i * Render._cellSize.w, 0);
      ctx.lineTo(startLeft + i * Render._cellSize.w, Render._mainCamera.size.h);
      ctx.stroke();
    }

    // console.log(grid);
  }

  public static drawBoxes(ctx: CanvasRenderingContext2D, grid: Grid, camera: Camera): void {
    // Draw the boxes
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    for (const box of Render._renderBoxes) {
      console.log("box: ", box);
      box.draw(ctx);
    }
  }

  public static getBoxesRender(): Array<BoxDialog> {
    return Render._renderBoxes;
  }

  public static viewToWorld(screenPosition: Point): Point {
    return {
      x: screenPosition.x + Render._mainCamera.position.x - Render._mainCamera.size.w / 2,
      y: screenPosition.y + Render._mainCamera.position.y - Render._mainCamera.size.h / 2,
    };
  }

  public static worldToView(worldPosition: Point): Point {
    return {
      x: worldPosition.x - Render._mainCamera.position.x + Render._mainCamera.size.w / 2,
      y: worldPosition.y - Render._mainCamera.position.y + Render._mainCamera.size.h / 2,
    };
  }
}
