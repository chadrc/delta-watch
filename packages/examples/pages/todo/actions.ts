import {Mutator, Accessor, Watcher} from "./store";

export const selectTodoList = (index: number) => {
  console.log('selecting', index);
  console.log(Accessor);
  Mutator.selectedList = index;
  console.log(Accessor.selectedList);
  console.log(Watcher);
};