import * as React from 'react';
import {WatchStore} from "../store";
import TodoList from "./TodoList";
import SelectedTodo from "./SelectedTodo";

const WatcherTodoList = WatchStore((watcher: any) => ({
  items: watcher.todoLists,
  selectedList: watcher.selectedList
}))(TodoList);

interface WatcherSelectedTodoProps {
  selectedList: number
}

const WatcherSelectedTodo = WatchStore(
  (watcher: any, props: WatcherSelectedTodoProps) => ({
    selectedTodo: watcher.todoLists[props.selectedList]
  })
)(SelectedTodo);

interface TodoProps {
  selectedList: number
}

const Todo = ({selectedList}: TodoProps) => (
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
        <WatcherSelectedTodo selectedList={selectedList}/>
      </div>
    </section>
  </section>
);

const WatcherTodo = WatchStore(
  (watcher: any) => ({
    selectedList: watcher.selectedList
  })
)(Todo);

export default WatcherTodo;