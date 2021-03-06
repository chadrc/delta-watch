import DeltaWatch from "delta-watch";
import {NoteCollection} from "./utils";

export default (elements: { [key: string]: HTMLElement },
                methods: { [key: string]: Function},
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