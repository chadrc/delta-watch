import {DeltaWatch, DynamicProperties, Watchable, WatcherOptions} from "./DeltaWatch";
import {TypeRegistry} from "./types/TypeRegistry";

const ObjectWatcherHandler: ProxyHandler<ObjectWatcher> = {
  get: function (obj: ObjectWatcher, prop: PropertyKey) {
    // Intercept any get to an undefined property as creating a new watchable property on the object
    if (!(prop in obj)) {

      // Trying to access a field on an undefined data
      // Make data an object and create a dynamic property on it
      if (typeof obj._data === 'undefined') {
        obj._parent._data[obj._parentKey] = {};
        if (obj._parent instanceof ObjectWatcher) {
          obj._parent._makeMutator(obj._parentKey);
        }
      }

      obj._makeProperty(prop);
      return (obj as any)._childProperties[prop];
    }

    return (obj as any)[prop];
  }
};

export function MakeObjectWatcher(parent: DeltaWatch | ObjectWatcher,
                                  parentKey?: PropertyKey,
                                  skipChildren: boolean = false): ObjectWatcher {
  return new Proxy<ObjectWatcher>(new ObjectWatcher(parent, parentKey, skipChildren), ObjectWatcherHandler);
}

export class ObjectWatcher implements Watchable, DynamicProperties {
  static getMutator(watcher: ObjectWatcher, field: PropertyKey): any {
    return watcher._mutators[field] || null;
  }

  readonly _parent: DeltaWatch | ObjectWatcher;
  readonly _parentKey: PropertyKey;
  protected _subscriberOptions: WatcherOptions[] = [];
  protected _lastValue: any;
  private readonly _childProperties: { [key: string]: ObjectWatcher };
  private readonly _mutators: { [key: string]: any };

  constructor(parent: DeltaWatch | ObjectWatcher,
              parentKey?: PropertyKey,
              skipChildren: boolean = false) {
    this._parent = parent;
    this._parentKey = parentKey;
    this._lastValue = this._data;
    this._childProperties = {};
    this._mutators = {};

    // Don't make any properties
    // Proxy will handle their dynamic creation if it happens
    if (this._data !== null && typeof this._data !== 'undefined' && !skipChildren) {
      for (let field of Object.keys(this._data)) {
        this._makeProperty(field);
      }
    }
  }

  _addWatcher(options: WatcherOptions): void {
    this._subscriberOptions.push(options);
  }

  _removeWatcher(options: WatcherOptions): void {
    let index = this._subscriberOptions.findIndex(opt => opt.change === options.change);
    if (index > -1) {
      this._subscriberOptions.splice(index, 1);
    }
  }

  _makeMutator(field: PropertyKey) {
    let watcher = this._properties[field];
    let makeMutator = this.typeRegistry.getMakeMutatorForValue(this._data[field]);
    if (makeMutator) {
      this._mutators[field] = makeMutator(watcher);
    }
  }

  _makeProperty(field: PropertyKey) {
    let self = this;
    let dataType = typeof this._data[field];
    if (this._data[field] !== null && dataType === "object") {
      this._properties[field] = MakeObjectWatcher(this, field);
      this._makeMutator(field);
    } else {
      this._properties[field] = MakeObjectWatcher(this, field, true);
    }

    // Create watcher property
    // Getter returns WatchableProperty that can be used to subscribe to
    Object.defineProperty(this, field, {
      get(): any {
        return self._properties[field]
      }
    });
  }

  _notifySubscribers(notifyParent: boolean = false, notifyChildren: boolean = false, fromChangedChild: boolean = false): boolean {

    let hasChildren = Object.keys(this._childProperties).length !== 0;
    let childrenChanged = false;

    if (notifyChildren) {
      for (let childKey of Object.keys(this._childProperties)) {
        // Continue notification downstream
        let changed = this._childProperties[childKey]._notifySubscribers(false, true);
        if (changed) {
          childrenChanged = true;
        }
      }
    }

    // Changed if value has changed
    let changed = (this._lastValue !== this._data);

    // If their are children, it doesn't matter if our value has changed
    // If any child has changed this object will notify subscribers
    if (hasChildren) {
      changed = childrenChanged;
    }

    // If the call was from a changed child, force a change (this being the parent of the changed child)
    changed = changed || fromChangedChild;

    if (changed) {
      for (let subscriber of this._subscriberOptions) {
        if (typeof subscriber.change === 'function') {
          subscriber.change(this._data);
        }
      }

      this._lastValue = this._data;
    }

    if (notifyParent && changed) {
      if (this._parent instanceof ObjectWatcher) {
        // Continue the notification upstream
        this._parent._notifySubscribers(true, false, true);
      }
    }

    return changed;
  }

  get _data(): any {
    if (this._parent._data === null || typeof this._parent._data === 'undefined') {
      return;
    }
    return this._parentKey === null || typeof this._parentKey === 'undefined' ? this._parent._data : this._parent._data[this._parentKey];
  }

  get _subscribers(): WatcherOptions[] {
    return this._subscriberOptions;
  }

  get _properties() {
    return this._childProperties;
  }

  get typeRegistry(): TypeRegistry {
    return this._parent.typeRegistry;
  }
}