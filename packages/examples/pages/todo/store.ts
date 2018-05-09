import DeltaWatch from 'delta-watch';
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
  selectedList: -1
});

DeltaWatch.Watch(StoreWatcher.selectedList, (selected: number) => console.log('selected', selected));

export const WatchStore = Watch;
export const Mutator = StoreMutator;
export const Accessor = StoreAccessor;