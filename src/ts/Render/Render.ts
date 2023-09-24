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
  private static _bufferRenderBoxes: Array<BoxDialog> = [];
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
    // console.log("Render init");
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

  public static get renderBoxes(): Array<BoxDialog> {
    return Render._renderBoxes;
  }

  public static get topLeftCell(): Rectangle {
    return Render._topLeftCell;
  }

  public static get numRowsRender(): number {
    return Render._numRowsRender;
  }

  public static get numColumnsRender(): number {
    return Render._numColumnsRender;
  }

  public static get cellSize(): Size {
    return Render._cellSize;
  }

  public static get mainCamera(): Camera {
    return Render._mainCamera;
  }

  public static get bufferRenderBoxes(): Array<BoxDialog> {
    return Render._bufferRenderBoxes;
  }

  public static updateRenderBoxes(refGrid: Grid, hardReload: boolean = false): void {
    let topLeftCell: Point = Render._mainCamera.getTopLeftCell().topLeft;
    
    // Calcula el nuevo topLeftCell aplicando el offset
    topLeftCell.x -= Render.offserRenderCells;
    topLeftCell.y -= Render.offserRenderCells;
    
    // Si el topLeftCell no cambió y no hay necesidad de recarga forzada, no es necesario realizar cambios
    if (topLeftCell.x === Render._topLeftCell.topLeft.x && topLeftCell.y === Render._topLeftCell.topLeft.y && !hardReload) {
      return;
    }

    // Utiliza un set para mantener un registro eficiente de los nuevos boxes
    const newRenderBoxesSet = new Set<BoxDialog>();

    // Itera sobre las celdas en el área de renderizado
    for (let i = Render._numRowsRender + Render.offserRenderCells; i >= 0; i--) {
      for (let j = Render._numColumnsRender + Render.offserRenderCells; j >= 0; j--) {
        const key: string = `${i + topLeftCell.y}-${j + topLeftCell.x}`;
        
        if (refGrid.grid.has(key)) {
          const boxesInCell = refGrid.grid.get(key)!;
          // Agrega los boxes de esta celda al conjunto
          for (const box of boxesInCell) {
            newRenderBoxesSet.add(box);
          }
        }
      }
    }    

    // Convierte el set de nuevos boxes en un array y ordena los elementos según el orden original
    const newRenderBoxesArray = Array.from(newRenderBoxesSet);
    newRenderBoxesArray.sort((box1, box2) => {
        const index1 = Render._renderBoxes.indexOf(box1);
        const index2 = Render._renderBoxes.indexOf(box2);
        return index1 - index2;
    });

    // Actualiza Render._renderBoxes con los nuevos boxes
    Render._renderBoxes = newRenderBoxesArray;

    // Actualiza topLeftCell en Render._topLeftCell
    Render._topLeftCell.topLeft = topLeftCell;
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
    for (let i = 0; i < Render._numColumnsRender; i++) {
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
      box.draw(ctx);
    }

    // Draw the buffer boxes
    for (const box of Render._bufferRenderBoxes) {
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

  public static setLastBox(box: BoxDialog): void {
    const index = Render._renderBoxes.indexOf(box);

    if (index === -1) {
      return;
    }

    Render._renderBoxes.splice(index, 1);
    Render._renderBoxes.push(box);    
  }

  public static addBox(box: BoxDialog): void {
    // check if the box is already in the array
    if (Render._renderBoxes.indexOf(box) !== -1) {
      return;
    }

    Render._renderBoxes.push(box);
  }

  public static removeBox(box: BoxDialog): void {
    const index = Render._renderBoxes.indexOf(box);

    if (index === -1) {
      return;
    }

    Render._renderBoxes.splice(index, 1);
  }

  public static addBufferBox(box: BoxDialog): void {
    Render._bufferRenderBoxes.push(box);
  }

  public static removeBufferBox(box: BoxDialog): void {
    const index = Render._bufferRenderBoxes.indexOf(box);

    if (index === -1) {
      return;
    }

    Render._bufferRenderBoxes.splice(index, 1);
  }
}
