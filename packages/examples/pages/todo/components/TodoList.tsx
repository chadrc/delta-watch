import * as React from 'react';
import * as PropTypes from 'prop-types';
import {TodoList} from "../types";

interface TodoListProps {
  items: TodoList[]
}

const TodoList = (props: TodoListProps) => (
  <ul>
    {props.items.map((item: TodoList) => (
      <li>{item.name}</li>
    ))}
  </ul>
);

(TodoList as any).propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  }))
};

(TodoList as any).defaultProps = {
  items: []
};

export default TodoList;