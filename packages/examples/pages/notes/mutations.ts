declare const M: any; // Materialize CSS global

export default (elements: { [key: string]: HTMLElement },
                methods: { [key: string]: Function},
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

    methods.createCollectionItem(accessor.collectionName);

    mutator.collectionName = '';

    collectionNameModalInstance.close();
  });
}