<script lang="ts">
  const res = true;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (res)
        resolve('This is done!');
      else
        reject(new Error('Error...'));
    }, 2000);
  });

  // mouse test
  let x = 0;
  let y = 0;
  const handleMove = (e) => {
    x = e.clientX;
    y = e.clientY;
  }
</script>

{#await promise}
<p>...waiting</p>
{:then value}
<div on:pointermove|once={handleMove}>
  <p class="success">MouseX: {x}</p>
  <p class="success">MouseY: {y}</p>
</div>
{:catch error}
<p class="error">{error.message}</p>
{/await}

<style>
  div {
    width: 100%;
    height: 100%;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
</style>