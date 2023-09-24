<script lang="ts">
  import { onMount } from 'svelte';
  import BoxDialog from '../ts/Box/BoxDialog';
  import Grid from '../ts/Grid/Grid';
  import DialogSystem from '../ts/Grid/DialogSystem';

  import { statementStore } from './store'

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;


  // let box1;
  // let GridTest;
  let DS: DialogSystem;

  const initializeCanvas = () => {
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 1200;
    canvas.height = 900;

    // box1 = new BoxDialog(430, 100, 220, 150, 5, canvas, ctx, '#ddd');
    // box1.drawRectangle();
    

    // GridTest = new Grid({w: canvas.width, h: canvas.height});
    // GridTest.drawGrid(ctx);

    DS = new DialogSystem(canvas, ctx);

    statementStore.subscribe((value) => {
      console.log('value: ', value);
      DS.currentDialogType = value;
    });    
  };

  onMount(() => {
    document.addEventListener('keydown', (event) => {
      DS.handleKeyDown(event);
    });

    initializeCanvas();

    DS.currentDialogType = $statementStore;

    canvas.addEventListener('mousedown', (event) => {
      // check if left mouse button
      if (event.button !== 0) return;

      DS.handleLeftClick(event);
    });

    canvas.addEventListener('mouseup', () => {
      DS.handleLeftClickUp();
    });

    canvas.addEventListener('mousemove', (event) => {
      DS.handleMouseMove(event);
    });

    // right mouse button
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      DS.handleRightClick(event);
    });
  });
</script>

<canvas id="canvas"></canvas>

<style>
  canvas {
    border: 1px solid #000;
  }
</style>
