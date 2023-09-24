import BoxDialog from "../Box/BoxDialog";
import VariableComponent from "../Box/Components/VariableComponent";
import { Statement } from "../Enums/Statements";
import type { Point } from "../interfaces/Point";
import type { Size } from "../interfaces/Size";
import type Component from "../Box/Components/Component";
import { Variable } from "../Enums/Variable";

export default class If extends BoxDialog{
  private _components: Array<Component> = [];
  
  constructor(
    position: Point,
    size: Size,
    borderRadius: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    fillColor: string = 'white',
  ) {    
    const _size = { w: 200, h: 100 };

    super(position, _size, borderRadius, canvas, ctx, fillColor, Statement.If);

    const testComponent = new VariableComponent({ x: 20, y: 50 }, 10, Variable.In);
    const testComponent2 = new VariableComponent({ x: 180, y: 50 }, 10, Variable.Out);
    this._components.push(testComponent);
    this._components.push(testComponent2);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    const viewPoint = this.getViewPos();

    this._components.forEach((component) => {
      console.log(component);
      component.draw(ctx, viewPoint);
    });
  }
}