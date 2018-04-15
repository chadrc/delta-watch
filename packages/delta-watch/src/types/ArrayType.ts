import {ObjectWatcher} from "../core/ObjectWatcher";
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

  return new Proxy({}, makeMutationHandler(
    internals,
    arrayMutatorMethods,
    (prop: PropertyKey) => {
      let val = prop;
      if (typeof prop === 'string') {
        try {
          val = parseInt(prop);
        } catch (e) {
          return false;
        }
      }

      if (typeof val === 'number') {
        return true;
      }
    })
  );
}

export const ArrayTypeInfo = {
  makeMutator: makeArrayMutator,
  makeAccessor: makeGetOnlyArrayProxy,
  handlesValue: (value: any) => {
    return Array.isArray(value);
  },
  type: "Array"
};