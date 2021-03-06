import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {makeObjectMutator} from "./ObjectMutator";
import {makeObjectAccessor} from "./ObjectAccessor";
import {TypeRegistry} from "../types/TypeRegistry";

export interface Watchable {
  _addWatcher(cb: WatcherOptions): void;
  _removeWatcher(cb: WatcherOptions): void;
  _typeRegistry: TypeRegistry;
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

export class DeltaWatch<T> implements Watchable {
  static watch(watchable: Watchable | any, cb: Function) {
    watchable._addWatcher(new WatcherOptions(cb));
  }

  static unwatch(watchable: Watchable | any, cb: Function) {
    watchable._removeWatcher(new WatcherOptions(cb));
  }

  private readonly _watcher: ObjectWatcher;
  private readonly _mutator: any;
  private _dataValue: { [key: string]: any };
  private readonly _rootTypeRegistry: TypeRegistry;

  constructor(data: T) {
    if (data === null || typeof data === 'undefined') {
      throw new TypeError("data must be an object or array");
    }

    this._rootTypeRegistry = TypeRegistry.defaultTypeRegistry;
    this._dataValue = data;
    this._watcher = MakeObjectWatcher(this);
    this._mutator = makeObjectMutator(this._watcher);
  }

  get Watcher(): T {
    return this._watcher as any;
  }

  get Accessor(): T {
    return makeObjectAccessor(this._dataValue, this._typeRegistry);
  }

  get Mutator(): T {
    return this._mutator;
  }

  set Mutator(data: T) {
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

  get _typeRegistry(): TypeRegistry {
    return this._rootTypeRegistry;
  }

  get _data() {
    return this._dataValue;
  }
}