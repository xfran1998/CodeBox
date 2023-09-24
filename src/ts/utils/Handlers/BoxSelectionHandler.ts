import BoxDialog from "../../Box/BoxDialog";
import type { Point } from "../../interfaces/Point";
import Grid from "../../Grid/Grid";
import Render from "../../Render/Render";

export class BoxSelectionHandler {
  private _grid: Grid;
  private _activeBox: BoxDialog = null;

  constructor(grid: Grid) {
    this._grid = grid;
  }

  public deselectBox(): void {
    if (!this._activeBox) return;

    this._activeBox.isSelected = false;
    this._activeBox = null;
  }

  public selectBox(box: BoxDialog): void {
    // deselect last box
    this.deselectBox();

    this._activeBox = box;
    this._activeBox.isSelected = true;
  }

  public getBoxFromClick(clickPos: Point): BoxDialog {
    // Iterate over the render boxes
    for (let i = Render.renderBoxes.length-1; i >= 0; i--) {
      const box = Render.renderBoxes[i];

      // Check if the click is inside the box
      if (box.isTriggered(clickPos)) {
        return box;
      }
    }

    // Iterate over the buffer render boxes
    for (let i = Render.bufferRenderBoxes.length - 1; i >= 0; i--) {
      const box = Render.bufferRenderBoxes[i];

      // Check if the click is inside the box
      if (box.isTriggered(clickPos)) {
        return box;
      }
    }

    return null;
  }
}