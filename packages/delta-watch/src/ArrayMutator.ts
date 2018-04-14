import {Mutator} from "./Watchable";
import {ObjectWatcher} from "./ObjectWatcher";
import {makeHandler} from "./DateMutator";

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

const getOnlyArrayProxyHandler = {
  get: function (obj: any[], prop: PropertyKey) {
    if (prop in obj) {
      if (arrayMutatorMethods.indexOf(prop as string) !== -1) {
        throw Error("Cannot access a mutator method on an Accessor object.");
      }
      return (obj as any)[prop];
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

export function makeGetOnlyArrayProxy(ary: any[]): any {
  return new Proxy(ary, getOnlyArrayProxyHandler);
}

export function makeArrayMutator(watcher: ObjectWatcher): Mutator {
  let internals = {
    watcher: watcher,
    type: "Array"
  };

  return new Proxy(watcher._data, makeHandler<Date>(internals, arrayMutatorMethods));
}
