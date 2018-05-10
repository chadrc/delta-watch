import DeltaWatchReact from 'delta-watch-react';

const {WatchStore: Watch, Store: {Mutator: StoreMutator, Watcher: StoreWatcher, Accessor: StoreAccessor}} = DeltaWatchReact.MakeStore({
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
  selectedList: -1,
  creatingTodoList: false,
  newTodoListName: '',
  newTodoName: '',
});

export const WatchStore = Watch;
export const Mutator = StoreMutator;
export const Accessor = StoreAccessor;