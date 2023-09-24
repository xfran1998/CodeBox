<script lang="ts">
  import { statementStore } from './store'
  import { Statement } from "../ts/Enums/Statements";

  export let state: Statement;

  function setState () {
    statementStore.setState(state);
  }
</script>

<button on:click={setState}>{state}</button>