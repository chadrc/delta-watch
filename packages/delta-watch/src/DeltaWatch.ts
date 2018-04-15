import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {makeObjectAccessor, makeObjectMutator} from "./ObjectMutator";
import {TypeRegistry} from "./types/TypeRegistry";

export interface Watchable {
  _addWatcher(cb: WatcherOptions): void;
  _removeWatcher(cb: WatcherOptions): void;
  typeRegistry: TypeRegistry;
}

/**
 * Container for change function that gets called when values in a DeltaWatch are modified
 */
export class WatcherOptions {
  private readonly _change: Function;

  constructor(change: Function) {
    this._change = change;
  }

  get change() {
    return this._change;
  }
}

export class DeltaWatch implements Watchable {
  static watch(watchable: Watchable, cb: Function) {
    watchable._addWatcher(new WatcherOptions(cb));
  }

  static unwatch(watchable: Watchable, cb: Function) {
    watchable._removeWatcher(new WatcherOptions(cb));
  }

  private readonly _watcher: ObjectWatcher;
  private readonly _mutator: any;
  private readonly _accessor: any;
  private _dataValue: { [key: string]: any };
  private readonly _typeRegistry: TypeRegistry;

  constructor(data: object) {
    if (data === null || typeof data === 'undefined') {
      throw new TypeError("data must be an object or array");
    }

    this._typeRegistry = TypeRegistry.defaultTypeRegistry;
    this._dataValue = data;
    this._watcher = MakeObjectWatcher(this);
    this._mutator = makeObjectMutator(this._watcher);
    this._accessor = makeObjectAccessor(data, this.typeRegistry);
  }

  get Watcher(): ObjectWatcher & any {
    return this._watcher;
  }

  get Accessor(): any {
    return this._accessor;
  }

  get Mutator(): any {
    return this._mutator;
  }

  set Mutator(data: any) {
    this._dataValue = data;
    // No need to notify parent since it is the top
    this._watcher._notifySubscribers(false, true);
  }

  _addWatcher(cb: WatcherOptions): void {
    this._watcher._addWatcher(cb);
  }

  _removeWatcher(cb: WatcherOptions): void {
    this._watcher._removeWatcher(cb);
  }

  get typeRegistry(): TypeRegistry {
    return this._typeRegistry;
  }

  get _data() {
    return this._dataValue;
  }
}