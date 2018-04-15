import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {makeObjectAccessor, makeObjectMutator} from "./ObjectMutator";
import {DateTypeInfo} from "./DateMutator";
import {ArrayTypeInfo} from "./ArrayMutator";

export interface Subscribable {
  _subscribe(cb: WatcherOptions): void;

  _unsubscribe(cb: WatcherOptions): void;
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
 * Container for change function that gets called when values in a Watchable are modified
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

export interface WatcherArgs {
  change: Function
}

export interface ArrayWatcherArgs {
  change?: Function
  add?: Function
  remove?: Function
}

export class Watchable implements Subscribable, TypeRegister {
  static watch(watchable: Subscribable, cb: Function) {
    watchable._subscribe(new WatcherOptions(cb));
  }

  static unwatch(watchable: Subscribable, cb: Function) {
    watchable._unsubscribe(new WatcherOptions(cb));
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

  _subscribe(cb: WatcherOptions): void {
    this._watcher._subscribe(cb);
  }

  _unsubscribe(cb: WatcherOptions): void {
    this._watcher._unsubscribe(cb);
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