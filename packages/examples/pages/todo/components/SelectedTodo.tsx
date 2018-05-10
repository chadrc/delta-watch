import * as React from 'react';
import {TodoList} from "../types";
import {addNewTodo, toggleCompletedForTodo, updateNewTodoName} from "../actions";
import {ChangeEvent} from "react";

interface SelectedTodoProps {
  selectedTodo: TodoList
  newTodoName: string
}

const SelectedTodo = ({selectedTodo = null, newTodoName = ''}: SelectedTodoProps) => !selectedTodo ? null : (
  <section>
    <h4>{selectedTodo.name}</h4>
    <form>
      <div className="row">
        <div className="input-field col s9">
          <input placeholder="New Todo"
                 type="text"
                 value={newTodoName}
                 onChange={(event: ChangeEvent<HTMLInputElement>) => updateNewTodoName(event.target.value)}/>
            <label/>
        </div>
        <div className="col s3">
          <button className="btn btn-large waves-effect waves-light right"
                  disabled={newTodoName.trim() === ''}
                  type="submit"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();

                    addNewTodo();
                  }}>
            Add
          </button>
        </div>
      </div>
    </form>
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