import * as React from 'react';
import Todo from './Todo';
import CreateTodoListModal from "./CreateTodoListModal";

const Main = () => (
  <React.Fragment>
    <Todo/>
    <CreateTodoListModal/>
  </React.Fragment>
);

export default Main;