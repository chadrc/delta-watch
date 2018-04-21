import DeltaWatch from "delta-watch";

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                watcher: any) => {

  DeltaWatch.Watch(watcher.collectionName, (name: string) => {
    if (name.length === 0) {
      elements.collectionNameSubmitBtn.setAttribute('disabled', '');
    } else {
      elements.collectionNameSubmitBtn.removeAttribute('disabled');
    }
  });


}