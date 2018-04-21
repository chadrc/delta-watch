import {NoteCollection} from "./utils";

declare const M: any; // Materialize CSS global

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                mutator: any) => {

  let collectionNameModalInstance = M.Modal.init(elements.collectionNameModal, {});

  elements.createCollectionBtn.addEventListener('click', () => {
    collectionNameModalInstance.open();
  });

  elements.collectionNameInput.addEventListener('input', (event) => {
    let element = event.target as HTMLInputElement;
    mutator.collectionName = element.value;
  });

  elements.collectionNameSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    let newCollection: NoteCollection = {
      name: accessor.collectionName,
      notes: []
    };

    mutator.collectionName = '';
    mutator.noteCollections.push(newCollection);

    collectionNameModalInstance.close();
  });
}