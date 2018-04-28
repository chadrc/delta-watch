import * as React from 'react';
import * as PropTypes from 'prop-types';
import {TodoList} from "../types";
import {selectTodoList} from "../actions";

interface TodoListProps {
  items: TodoList[]
  selectedList: number
}

const TodoList = (props: TodoListProps) => (
  <ul>
    {props.items.map((item: TodoList, index: number) => (
      <li className="collection-item valign-wrapper">
        <a href="#"
           onClick={() => selectTodoList(index)}
           className={`orange-text text-accent-2${props.selectedList === index ? ' selected' : ''}`}>
          {item.name}
          {props.selectedList === index ? (
            <i className={`material-icons`}>arrow_forward</i>
          ): ''}
        </a>
      </li>
    ))}
  </ul>
);

(TodoList as any).propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  })),
  selectedItem: PropTypes.number
};

(TodoList as any).defaultProps = {
  items: []
};

export default TodoList;