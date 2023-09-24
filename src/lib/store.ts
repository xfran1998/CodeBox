import { writable, type Writable, derived } from "svelte/store";
import { Statement } from "../ts/Enums/Statements";


function createStatementStore() {
  const { subscribe, set, update } = writable<Statement | null>(null);

  return {
    subscribe,
    setState: (state: Statement) => set(state),
    reset: () => set(null),
  };
}



export const statementStore = createStatementStore();