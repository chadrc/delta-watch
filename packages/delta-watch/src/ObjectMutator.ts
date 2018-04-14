import {DynamicProperties, Mutator} from "./Watchable";
import {ObjectWatcher} from "./ObjectWatcher";
import {ArrayMutator} from "./ArrayMutator";

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
        // Need to mutate before array check, because watcher's make mutator uses current value to determine
        // to make Object or Array mutator
        self._watcher._data[field] = value;
        let fieldMutator = ObjectWatcher.getMutator(self._watcher, field);
        if (Array.isArray(value) && !(fieldMutator instanceof ArrayMutator)) {
          // setting this field to an array but doesn't have an array mutator associated with it
          self._watcher._makeMutator(field);
        }
        self._watcher._properties[field]._notifySubscribers(true, true);
      }
    });
  }
}