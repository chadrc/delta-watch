import * as React from 'react';
import {TodoList} from "../types";

interface SelectedTodoProps {
  selectedTodo: TodoList
}

const SelectedTodo = ({selectedTodo = null}: SelectedTodoProps) => !selectedTodo ? null : (
  <section>
    <h4>{selectedTodo.name}</h4>
    <ul>
      {selectedTodo.todos.map((todo) => (
        <li>
          <label>
            <input type='checkbox' checked={todo.completed} />
            <span>{todo.text}</span>
          </label>
        </li>
      ))}
    </ul>
  </section>
);

export default SelectedTodo;