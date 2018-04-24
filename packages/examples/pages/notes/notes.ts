import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
import {NoteCollection} from "./utils";
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

  M.Collapsible.init(elements.noteList, {});

  const {Watcher, Mutator, Accessor} = DeltaWatch.Watchable({
    noteCollections: [],
    selectedTodoList: null,
    selectedTodo: null,
    collectionName: ''
  });

  const methods = {
    createCollectionItem: (name: string) => {
      let newCollection: NoteCollection = {
        name: name,
        notes: []
      };

      let clone = document.importNode(elements.noteCollectionTemplate.content, true);
      let header = clone.querySelector('.collapsible-header > .note-text');
      let deleteBtn = clone.querySelector('.collapsible-header > a');
      let list = clone.querySelector('.collapsible-body ul');
      let index = Accessor.noteCollections.length;

      DeltaWatch.Watch(Watcher.noteCollections[index].name, (name: string) => {
        header.innerHTML = name;
      });

      deleteBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        Mutator.noteCollections.splice(index, 1);
        elements.noteList.removeChild(elements.noteList.children[elements.noteList.children.length - 1]);
      });

      elements.noteList.appendChild(clone);
      Mutator.noteCollections.push(newCollection);
    }
  };

  setupWatches(elements, methods, Accessor, Watcher);
  setupMutations(elements, methods, Accessor, Mutator);
});