import {ObjectWatcher} from "./ObjectWatcher";
import {makeMutationHandler} from "../types/utils";

export function makeObjectMutator(watcher: ObjectWatcher): any {
  let internals = {
    watcher: watcher,
    type: "Object"
  };
  return new Proxy({}, makeMutationHandler(internals, [], true));
}