import * as React from 'react';
import {TodoList} from "../types";
import {toggleCompletedForTodo} from "../actions";

interface SelectedTodoProps {
  selectedTodo: TodoList
}

const SelectedTodo = ({selectedTodo = null}: SelectedTodoProps) => !selectedTodo ? null : (
  <section>
    <h4>{selectedTodo.name}</h4>
    <ul>
      {selectedTodo.todos.map((todo, index) => (
        <li>
          <label>
            <input type='checkbox' checked={todo.completed} onChange={() => toggleCompletedForTodo(index)} />
            <span>{todo.text}</span>
          </label>
        </li>
      ))}
    </ul>
  </section>
);

export default SelectedTodo;