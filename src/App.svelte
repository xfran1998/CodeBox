<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import AwaitPomise from './lib/AwaitPromise.svelte'
  import Canvas from './lib/Canvas.svelte'
  $: count = 0;
</script>

<main>
  <!-- <div class="card">
    <Counter {count} />
    p: {count}
  </div>

  <div class="card">
    <SumArray />
  </div>

  <div class="card">
    <AwaitPomise />
  </div> -->

  <div class="card">
    <Canvas />
  </div>

</main>

<style>
  main {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    font-size: 2rem;
  }
</style>

