import {Accessor, Mutator} from "./store";
import {TodoList} from "./types";

export const selectTodoList = (index: number) => {
  Mutator.selectedList = index;
};

export const toggleCompletedForTodo = (index: number) => {
  let current = Accessor.todoLists[Accessor.selectedList].todos[index].completed;
  Mutator.todoLists[Accessor.selectedList].todos[index].completed = !current;
};

export const openNewTodoListModal = () => {
  Mutator.creatingTodoList = true;
};

export const closeNewTodoListModal = () => {
  Mutator.creatingTodoList = false;
};

export const updateNewTodoListName = (name: string) => {
  Mutator.newTodoListName = name;
};

export const createNewTodoList = () => {
  let newTodoList: TodoList = {
    name: Accessor.newTodoListName,
    todos: []
  };

  Mutator.todoLists.push(newTodoList);
  Mutator.creatingTodoList = false;
  Mutator.newTodoListName = '';
};