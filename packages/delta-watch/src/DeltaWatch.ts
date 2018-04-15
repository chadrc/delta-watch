import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {makeObjectAccessor, makeObjectMutator} from "./ObjectMutator";
import {DateTypeInfo} from "./types/DateType";
import {ArrayTypeInfo} from "./types/ArrayType";

export interface Watchable {
  _addWatcher(cb: WatcherOptions): void;
  _removeWatcher(cb: WatcherOptions): void;
}

export interface TypeRegister {
  _typeRegistry: TypeInfo[];

  getMutatorForValue(value: any, watcher: ObjectWatcher): any
  getAccessorForValue(value: any): any
  getTypeForValue(value: any): string
}

export interface DynamicProperties {
  [key: string]: any
}

export interface Mutator {
  _makeProperty(field: PropertyKey): void;
}

export interface TypeInfo {
  makeMutator: (watcher: ObjectWatcher) => any
  makeAccessor: (obj: any, typeRegister: TypeRegister) => any
  handlesValue: (value: any) => boolean
  type: string
}

export interface DeltaWatchInternals {
  watcher: ObjectWatcher
  type: string
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

export class DeltaWatch implements Watchable, TypeRegister {
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
  private readonly _types: TypeInfo[];

  constructor(data: object) {
    if (data === null || typeof data === 'undefined') {
      throw new TypeError("data must be an object or array");
    }

    this._types = [
      DateTypeInfo,
      ArrayTypeInfo
    ];
    this._dataValue = data;
    this._watcher = MakeObjectWatcher(this);
    this._mutator = makeObjectMutator(this._watcher);
    this._accessor = makeObjectAccessor(data, this);
  }

  get Watcher(): ObjectWatcher & DynamicProperties {
    return this._watcher;
  }

  get Mutator(): DynamicProperties {
    return this._mutator;
  }

  get Accessor(): any {
    return this._accessor;
  }

  set Mutator(data: DynamicProperties) {
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

  getAccessorForValue(value: any): any {
    let accessor = null;
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        accessor = info.makeAccessor(value, this);
        break;
      }
    }

    if (accessor === null && typeof value === "object") {
      return makeObjectAccessor(value, this);
    }

    return accessor;
  }

  getMutatorForValue(value: any, watcher: ObjectWatcher): any {
    let mutator = null;
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        mutator = info.makeMutator(watcher);
      }
    }

    if (mutator === null && typeof value === 'object') {
      mutator = makeObjectMutator(watcher);
    }

    return mutator;
  }

  getTypeForValue(value: any): string {
    let type = "";
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        type = info.type
      }
    }
    if (type === "" && typeof value === "object") {
      type = "Object";
    }
    return type;
  }

  get _typeRegistry(): TypeInfo[] {
    return this._types;
  }

  get _data() {
    return this._dataValue;
  }
}