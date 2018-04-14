import {ObjectWatcher} from "./ObjectWatcher";
import {makeAccessorHandler, makeMutationHandler} from "./utils";

export const arrayMutatorMethods = [
  'push',
  'unshift',
  'pop',
  'shift',
  'splice',
  'fill',
  'sort',
  'copyWithin',
  'reverse'
];

export function makeGetOnlyArrayProxy(ary: any): any {
  return new Proxy(ary, makeAccessorHandler(arrayMutatorMethods));
}

export function makeArrayMutator(watcher: ObjectWatcher): any {
  let internals = {
    watcher: watcher,
    type: "Array"
  };

  return new Proxy({}, makeMutationHandler(internals, arrayMutatorMethods));
}
