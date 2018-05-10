import * as React from 'react';
import {TodoList} from "../types";
import {selectTodoList} from "../actions";

interface TodoListProps {
  items: TodoList[]
  selectedList: number
}

const TodoList = ({items = [], selectedList}: TodoListProps) => (
  <ul>
    {items.map((item: TodoList, index: number) => (
      <li className="collection-item valign-wrapper">
        <a href="#"
           onClick={() => selectTodoList(index)}
           className={`orange-text text-accent-2 valign-wrapper${selectedList === index ? ' selected' : ''}`}>
          {item.name}
          {selectedList === index ? (
            <i className={`material-icons`}>arrow_forward</i>
          ): ''}
        </a>
      </li>
    ))}
  </ul>
);

export default TodoList;