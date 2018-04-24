import DeltaWatch from 'delta-watch';
import setupMutations from './mutations';
import setupWatches from './watches';
import {Note, NoteCollection} from "./utils";
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
    collectionName: '',
    newNoteInputsByIndex: {}
  });

  function createNote(collectionIndex: number, name: string) {
    let newNote: Note = {
      name: name,
      text: ''
    };

    console.log('adding note', newNote);

    let clone = document.importNode(elements.noteTemplate.content, true);
    let link = clone.querySelector('a');
    let index = Accessor.noteCollections[collectionIndex].notes.length;

    DeltaWatch.Watch(Watcher.noteCollections[collectionIndex].notes[index].name, (name: string) => {
      link.innerHTML = name;
    });
  }

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
      let newNoteInput = clone.querySelector('.collapsible-body ul li:last-of-type input') as HTMLInputElement;
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

      newNoteInput.addEventListener('input', (event) => {
        let t = event.target as HTMLInputElement;
        Mutator.newNoteInputsByIndex[index] = t.value;
      });

      newNoteInput.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.code === "Enter") {
          let newNoteName = Accessor.newNoteInputsByIndex[index];
          createNote(index, newNoteName);
          newNoteInput.value = '';
          Mutator.newNoteInputsByIndex[index] = '';
        }
      });

      elements.noteList.appendChild(clone);
      Mutator.noteCollections.push(newCollection);
    }
  };

  setupWatches(elements, methods, Accessor, Watcher);
  setupMutations(elements, methods, Accessor, Mutator);
});