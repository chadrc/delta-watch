import * as React from 'react';
import * as PropTypes from 'prop-types';
import {TodoList} from "../types";

interface SelectedTodoProps {
  selectedTodo: TodoList
}

const SelectedTodo = (props: SelectedTodoProps) => !props.selectedTodo ? null : (
  <section>
    <h4>{props.selectedTodo.name}</h4>
    <ol>
      {props.selectedTodo.todos.map((todo) => (
        <li>
          {todo.text}<input type='checkbox' checked={todo.completed} />
        </li>
      ))}
    </ol>
  </section>
);

(SelectedTodo as any).propTypes = {
  selectedTodo: PropTypes.shape({
    name: PropTypes.string,
    todos: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      complete: PropTypes.bool
    }))
  })
};

export default SelectedTodo;