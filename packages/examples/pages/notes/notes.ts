import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
declare const M: any; // Materialize CSS global

window.addEventListener('load', () => {
  const elements = {
    noteList: document.getElementById('todoList'),
    selectedNoteName: document.getElementById('selectedNoteName'),
    selectedNoteText: document.getElementById('selectedNoteText'),
    noteTemplate: document.getElementById('noteTemplate'),
    noteCollectionTemplate: document.getElementById('noteCollectionTemplate'),
    collectionNameModal: document.getElementById('collectionNameModal'),
    collectionNameInput: document.getElementById('collectionNameInput'),
    collectionNameSubmitBtn: document.getElementById('collectionNameSubmitBtn'),
    createCollectionBtn: document.getElementById('createCollectionBtn'),
  };

  M.Collapsible.init(elements.noteList, {});

  const {Watcher, Mutator, Accessor} = DeltaWatch.Watchable({
    noteCollections: [],
    selectedTodoList: null,
    selectedTodo: null,
    collectionName: ''
  });

  setupWatches(elements, Accessor, Watcher);
  setupMutations(elements, Accessor, Mutator);
});