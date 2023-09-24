<script lang="ts">
  import { statementStore } from './store'
  import { Statement } from "../ts/Enums/Statements";

  const arrStatesTypes: Array<Statement> = Object.values(Statement);
  console.log('arrStatesTypes: ', arrStatesTypes);
</script>


<main class="statement-container">
  {#each arrStatesTypes as state}
    <button on:click={()=> {statementStore.setState(state)}}>{state}</button>
  {/each}
</main>

<style>
  .statement-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
  }
</style>