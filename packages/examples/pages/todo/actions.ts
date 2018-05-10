import {Accessor, Mutator} from "./store";

export const selectTodoList = (index: number) => {
  Mutator.selectedList = index;
};

export const toggleCompletedForTodo = (index: number) => {
  let current = Accessor.todoLists[Accessor.selectedList].todos[index].completed;
  Mutator.todoLists[Accessor.selectedList].todos[index].completed = !current;
};