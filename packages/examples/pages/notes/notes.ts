import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
declare const M: any; // Materialize CSS global

window.addEventListener('load', () => {
  const elements = {
    todoList: document.getElementById('todoList'),
    selectedNoteName: document.getElementById('selectedNoteName'),
    selectedNoteText: document.getElementById('selectedNoteText')
  };

  M.Collapsible.init(elements.todoList, {});

  const {Watcher, Mutator, Accessor} = DeltaWatch.Watchable({

  });

  setupWatches(elements, Accessor, Watcher);
  setupMutations(elements, Accessor, Mutator);
});