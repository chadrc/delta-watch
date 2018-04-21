import DeltaWatch from 'delta-watch';
declare const M: any; // Materialize CSS global

window.addEventListener('load', () => {
  const elements = {
    todoList: document.getElementById('todoList')
  };

  M.Collapsible.init(elements.todoList, {});
});