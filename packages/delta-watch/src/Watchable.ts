import {MakeObjectWatcher, ObjectWatcher} from "./ObjectWatcher";
import {ObjectMutator, makeGetOnlyProxy} from "./ObjectMutator";

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

export interface WatcherArgs {
  change: Function
}

export interface ArrayWatcherArgs {
  change?: Function
  add?: Function
  remove?: Function
}

export class Watchable implements Subscribable {
  static watch(watchable: Subscribable, cb: Function) {
    watchable._subscribe(new WatcherOptions(cb));
  }

  static unwatch(watchable: Subscribable, cb: Function) {
    watchable._unsubscribe(new WatcherOptions(cb));
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
    this._accessor = makeGetOnlyProxy(data);
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

  get _data() {
    return this._dataValue;
  }
}