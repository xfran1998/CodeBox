import type BoxDialog from "../Box/BoxDialog";
import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";


// Grid es un rectángulo que contiene una serie de cajas de diálogo
// se encarga de posicionar las cajas de diálogo en el canvas y proporcinar las cajas de diálogo que se encuentran a la vista y sus posiciones
export default class Grid {
  // For positioning the boxes in the system
  private _topLeft: Point; // Top left corner of the whole grid
  private _bottomRight: Point; // Bottom right corner of the whole grid

  // For displaying only the boxes that are in the view
  private _currentTopLeft: Point; // Top left corner of the current view

  
  private _size: Size; // Size of the screen (canvas)

  // For Drawing the grid
  private _numRows: number = 0; // Number of rows in the grid
  private _numColumns: number = 0; // Number of columns in the grid

  // Grid layout
  private _rowSize: number = 210; // Height of each row in pixels
  private _columnSize: number = 210; // Width of each column in pixels
  private _grid = new Map<string, Array<BoxDialog>>(); // Map of the grid, each key is a string with the format "row-column" and each value is an array of boxes

  constructor(sizeCanvas: Size) {
    this._topLeft = { x: 0, y: 0 };
    this._bottomRight = { x: 0, y: 0 };

    this._currentTopLeft = { x: 0, y: 0 };
    this._size = sizeCanvas;

    this._numColumns = Math.ceil(this._size.w / this._columnSize);
    this._numRows = Math.ceil(this._size.h / this._rowSize);
  }

  private _addToGrid(box: BoxDialog): void {
    // Calculate the row and column of the box
    const row: number = Math.floor(box._y / this._rowSize);
    const column: number = Math.floor(box._x / this._columnSize);

    // Add the box to the grid
    const key: string = `${row}-${column}`;
    if (this._grid.has(key)) {
      this._grid.get(key)?.push(box);
    } else {
      this._grid.set(key, [box]);
    }
  }

  public get grid() : Map<string, Array<BoxDialog>> {
    return this._grid;
  }

  public move(deltaPosition: Point): void {
    // Change current position
    this._currentTopLeft.x += deltaPosition.x;
    this._currentTopLeft.y += deltaPosition.y;
  }


  // Add a box to the grid
  // Change the position of the box to the grid position knowing the spawn position and the _currentTopLeft position
  public addBox(box: BoxDialog, worldPos: Point): void {
    this._addToGrid(box);
  }
}