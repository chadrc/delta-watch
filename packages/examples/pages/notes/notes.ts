import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
declare const M: any; // Materialize CSS global

window.addEventListener('load', () => {
  const elements = {
    noteList: document.getElementById('todoList'),
    selectedNoteName: document.getElementById('selectedNoteName'),
    selectedNoteText: document.getElementById('selectedNoteText'),
    noteTemplate: document.getElementById('noteTemplate') as HTMLTemplateElement,
    noteCollectionTemplate: document.getElementById('noteCollectionTemplate') as HTMLTemplateElement,
    collectionNameModal: document.getElementById('collectionNameModal'),
    collectionNameInput: document.getElementById('collectionNameInput'),
    collectionNameSubmitBtn: document.getElementById('collectionNameSubmitBtn'),
    createCollectionBtn: document.getElementById('createCollectionBtn'),
  };

  const collectionElements: Node[] = [];

  M.Collapsible.init(elements.noteList, {});

  const {Watcher, Mutator, Accessor} = DeltaWatch.Watchable({
    noteCollections: [],
    selectedTodoList: null,
    selectedTodo: null,
    collectionName: ''
  });

  const methods = {
    createCollectionItem: () => {
      let clone = document.importNode(elements.noteCollectionTemplate.content, true);
      let header = clone.querySelector('.collapsible-header');
      let list = clone.querySelector('.collapsible-body ul');

      DeltaWatch.Watch(Watcher.noteCollections[collectionElements.length].name, (name: string) => {
        header.innerHTML = name;
      });

      collectionElements.push(clone);
      elements.noteList.appendChild(clone);
    }
  };

  setupWatches(elements, methods, Accessor, Watcher);
  setupMutations(elements, methods, Accessor, Mutator);
});