<script lang="ts">
  import StatementSelector from './lib/StatementSelector.svelte'
  import Canvas from './lib/Canvas.svelte'
</script>

<main>
  <div class="container-row">
     <div class="card">
       <StatementSelector />
      </div>
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

  .container-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>

