import DeltaWatchReact from 'delta-watch-react';

const {WatchStore: Watch, Store: {Mutator: StoreMutator}} = DeltaWatchReact.MakeStore({
  todoLists: [
    {
      name: "My Todos",
      todos: [
        {
          text: "Watch Star Wars",
          completed: false
        }
      ]
    }
  ],
  selectedTodo: -1
});

export const WatchStore = Watch;
export const Mutator = StoreMutator;