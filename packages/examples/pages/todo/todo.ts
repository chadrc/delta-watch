import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Todo from "./components/Todo";

window.addEventListener('load', () => {
  ReactDOM.render(
    React.createElement(Todo),
    document.getElementById('content')
  );
});