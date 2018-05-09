import {Mutator} from "./store";

export const selectTodoList = (index: number) => {
  Mutator.selectedList = index;
};