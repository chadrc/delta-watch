import * as React from 'react';
import {WatchStore} from "../store";
import TodoList from "./TodoList";
import SelectedTodo from "./SelectedTodo";

const WatcherTodoList = WatchStore((watcher: any) => ({
  items: watcher.todoLists,
  selectedList: watcher.selectedList
}))(TodoList);

const WatcherSelectedTodo = WatchStore(
  (watcher: any) => ({
    selectedList: watcher.selectedList
  }),
  (accessor: any, props: any) => ({
    selectedTodo: accessor.todoLists[accessor.selectedList]
  })
)(SelectedTodo);

const Todo = () => (
  <section>
    <h1 className="center-align">Todo</h1>
    <section className="row">
      <div className="col s4">
        <h5>
          Lists
          <a href="#" className="btn btn-small waves-effect right button-icon">
            <i className="material-icons">add</i>
          </a>
        </h5>
        <WatcherTodoList/>
      </div>
      <div className="col s8">
        <WatcherSelectedTodo/>
      </div>
    </section>
  </section>
);

export default Todo;