import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {ObjectMutator} from "./ObjectMutator";

export interface Subscribable {
  _subscribe(cb: WatcherOptions): void;

  _unsubscribe(cb: WatcherOptions): void;
}

export interface DynamicProperties {
  [key: string]: any
}

export interface Mutator {
  _makeProperty(field: PropertyKey): void;
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

/**
 * Extension container for add and remove functions that get called when arrays are added or removed to
 */
export class ArrayWatcherOptions extends WatcherOptions {
  private readonly _add: Function;
  private readonly _remove: Function;

  constructor(change: Function, add: Function, remove: Function) {
    super(change);
    this._add = add;
    this._remove = remove;
  }

  get add() {
    return this._add;
  }

  get remove() {
    return this._remove;
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

/**
 * Creates a an options instance for listening to watchables
 * @param {WatcherArgs} options
 * @returns {WatcherOptions}
 * @constructor
 */
export function Watcher(options: WatcherArgs): WatcherOptions {
  return new WatcherOptions(options.change);
}

/**
 * Creates an options instance for array type watchables
 * @param {ArrayWatcherArgs} options
 * @returns {ArrayWatcherOptions}
 * @constructor
 */
export function ArrayWatcher(options: ArrayWatcherArgs): ArrayWatcherOptions {
  return new ArrayWatcherOptions(options.change, options.add, options.remove);
}

const getOnlyProxyHandler = {
  get: function (obj: ObjectWatcher, prop: PropertyKey) {
    if (prop in obj) {
      let val = (obj as any)[prop];
      if (typeof val === "object") {
        return makeGetOnlyProxyHandler(val);
      } else {
        return val;
      }
    }
  }
};

function makeGetOnlyProxyHandler(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}

export class Watchable implements Subscribable {
  static watch(watchable: Subscribable, cb: Function | WatcherOptions) {
    if (cb instanceof WatcherOptions) {
      watchable._subscribe(cb);
    } else {
      watchable._subscribe(new WatcherOptions(cb));
    }
  }

  static unwatch(watchable: Subscribable, cb: Function | WatcherOptions) {
    if (cb instanceof WatcherOptions) {
      watchable._unsubscribe(cb);
    } else {
      watchable._unsubscribe(new WatcherOptions(cb));
    }
  }

  static valueOf(watchable: ObjectWatcher) {
    return watchable._data;
  }

  private readonly _watcher: ObjectWatcher;
  private readonly _mutator: ObjectMutator;
  private readonly _accessor: any;
  private _dataValue: { [key: string]: any };

  constructor(data: object) {
    if (data === null || typeof data === 'undefined') {
      throw new TypeError("data must be an object or array");
    }

    this._dataValue = data;
    this._watcher = MakeObjectWatcher(this);
    this._mutator = new ObjectMutator(this._watcher);
    this._accessor = makeGetOnlyProxyHandler(data);
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

  _subscribe(cb: Function | WatcherOptions): void {
    Watchable.watch(this._watcher, cb);
  }

  _unsubscribe(cb: Function | WatcherOptions): void {
    Watchable.unwatch(this._watcher, cb);
  }

  get _data() {
    return this._dataValue;
  }
}