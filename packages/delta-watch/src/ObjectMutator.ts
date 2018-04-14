import {DynamicProperties, Mutator} from "./Watchable";
import {ObjectWatcher} from "./ObjectWatcher";
import {makeGetOnlyArrayProxy} from "./ArrayMutator";
import {makeGetOnlyDateProxy} from "./DateMutator";

function getProxyForValue(value: any): any {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return makeGetOnlyArrayProxy(value);
    } else if (value instanceof Date) {
      return makeGetOnlyDateProxy(value);
    } else {
      return makeGetOnlyProxy(value);
    }
  }
  return null;
}

const getOnlyProxyHandler = {
  get: function (obj: any, prop: PropertyKey) {
    if (prop in obj) {
      let val = (obj as any)[prop];
      let proxy = getProxyForValue(val);
      return proxy === null ? val : proxy;
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

export function makeGetOnlyProxy(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}

export function makeObjectMutator(watcher: ObjectWatcher): ObjectMutator {
  return new ObjectMutator(watcher);
}

export class ObjectMutator implements DynamicProperties, Mutator {
  private readonly _watcher: ObjectWatcher;

  constructor(watcher: ObjectWatcher) {
    this._watcher = watcher;
    this._watcher._mutator = this;

    for (let field of Object.keys(this._watcher._data)) {
      this._makeProperty(field);
    }
  }

  _makeProperty(field: PropertyKey) {
    let self = this;
    Object.defineProperty(this, field, {
      get(): any | ObjectMutator {
        let fieldMutator = ObjectWatcher.getMutator(self._watcher, field);
        return fieldMutator == null ? self._watcher._properties[field]._data : fieldMutator;
      },
      set(value: any) {
        // Need to mutate before array check,
        // because watcher's make mutator uses current value to determine
        // to make Object or Array mutator
        self._watcher._data[field] = value;
        let fieldMutator = ObjectWatcher.getMutator(self._watcher, field);
        if (Array.isArray(value) &&
          (fieldMutator === null || typeof fieldMutator === 'undefined'
            || (fieldMutator as any).__DeltaWatchInternals.type !== "Array")) {
          // setting this field to an array but doesn't have an array mutator associated with it
          self._watcher._makeMutator(field);
        }
        self._watcher._properties[field]._notifySubscribers(true, true);
      }
    });
  }
}