import {ObjectWatcher} from "../core/ObjectWatcher";

export interface DeltaWatchInternals {
  watcher: ObjectWatcher
  type: string
}

export function makeAccessorHandler(mutatorMethods: string[]) {
  return {
    get: function (obj: Date, prop: PropertyKey) {
      if (prop in obj) {
        let field = (obj as any)[prop];
        if (typeof field === 'function') {
          if (mutatorMethods.indexOf(prop as string) !== -1) {
            throw Error("Cannot access a mutator method on an Accessor object.");
          }
          field = field.bind(obj);
        }
        return field;
      }
    },
    set: function () {
      throw Error("Cannot set a value on the Accessor object.");
    }
  };
}

export function makeMutationHandler<T extends object>(internals: DeltaWatchInternals,
                                                      mutatorMethods: string[],
                                                      settableProps: string[] | string = null): ProxyHandler<T> {
  return {
    get: function (_: T, prop: PropertyKey) {
      if (prop === "__DeltaWatchInternals") {
        return internals;
      }

      if (prop in internals.watcher._data) {
        let field = (internals.watcher._data as any)[prop];
        if (typeof field === 'function') {
          field = field.bind(internals.watcher._data);
          if (mutatorMethods.indexOf(prop as string) !== -1) {
            return function (...args: any[]) {
              let result = field(...args);
              internals.watcher._notifySubscribers(true, true, true);
              return result;
            }
          }
        } else {
          // let fieldMutator = ObjectWatcher.getMutator(self._watcher, field);
          // return fieldMutator == null ? self._watcher._properties[field]._data : fieldMutator;
          let fieldMutator = ObjectWatcher.getMutator(internals.watcher, prop);
          if (fieldMutator !== null && typeof fieldMutator !== 'undefined') {
            return fieldMutator;
          }
        }
        return field;
      }
    },
    set: function (_: T, prop: PropertyKey, value: any): boolean {
      if (prop === "__DeltaWatchInternals") {
        throw Error("Cannot set value of __DeltaWatchInternals");
      }

      // If any prop should be accepted as settable
      // or settableProps contains the given prop
      if (settableProps === "*" ||
        (settableProps !== null && settableProps.indexOf(prop as string) !== -1)) {
        // Need to mutate before array check,
        // because watcher's make mutator uses current value to determine
        // to make Object or Array mutator
        internals.watcher._data[prop] = value;
        let fieldMutator = ObjectWatcher.getMutator(internals.watcher, prop);
        let type = internals.watcher.typeRegistry.getTypeForValue(value);

        if (Array.isArray(value) &&
          (fieldMutator === null || typeof fieldMutator === 'undefined'
            || (fieldMutator as any).__DeltaWatchInternals.type !== type)) {
          // if mutator hasn't been initialized
          // or the type of the mutator doesn't match the new value
          // make a new mutator for it
          internals.watcher._makeMutator(prop);
        }

        let watcherProperties = internals.watcher._properties[prop];
        if (watcherProperties) {
          watcherProperties._notifySubscribers(true, true);
        }
        return true;
      }

      throw Error(`${prop} not settable on Mutator of type ${internals.type}`)
    }
  };
}