import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from "./components/Main";

window.addEventListener('load', () => {
  ReactDOM.render(
    React.createElement(Main),
    document.getElementById('content')
  );
});