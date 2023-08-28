<script lang="ts">
  import { onMount } from 'svelte';
  import BoxDialog from '../ts/Box/BoxDialog';
  import Grid from '../ts/Grid/Grid';
  import DialogState from '../ts/Grid/DialogSystem';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;


  // let box1;
  // let GridTest;
  let DialogSystem;

  const initializeCanvas = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 600;
    canvas.height = 600;

    // box1 = new BoxDialog(430, 100, 220, 150, 5, canvas, ctx, '#ddd');
    // box1.drawRectangle();
    

    // GridTest = new Grid({w: canvas.width, h: canvas.height});
    // GridTest.drawGrid(ctx);

    DialogSystem = new DialogState(canvas, ctx);
  };

  onMount(() => {

    document.addEventListener('keydown', (event) => {
      DialogSystem.handleKeyDown(event);
    });

    initializeCanvas();

    canvas.addEventListener('mousedown', (event) => {
      
    });

    canvas.addEventListener('mouseup', () => {
      // box1.endDrag();
    });

    canvas.addEventListener('mousemove', (event) => {
      // box1.handleDrag(event);
    });

    // right mouse button
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      DialogSystem.handleRightClick(event);
    });
  });
</script>

<canvas id="canvas"></canvas>

<style>
  canvas {
    border: 1px solid #000;
  }
</style>
