import {ArrayWatcherOptions, DynamicProperties, Mutator, WatcherOptions} from "./Watchable";
import {ObjectWatcher} from "./ObjectWatcher";

export const arrayNonMutatorMethods = [
  'concat',
  'entries',
  'every',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'reduce',
  'reduceRight',
  'slice',
  'some',
  'toLocaleString',
  'values' // not in nodejs, but should be in browsers
];

export const arrayMutatorMethods = [
  'push',
  'unshift',
  'pop',
  'shift',
  'splice',
  'fill',
  'sort',
  'copyWithin',
  'reverse'
];

const getOnlyArrayProxyHandler = {
  get: function (obj: any[], prop: PropertyKey) {
    if (prop in obj) {
      if (arrayMutatorMethods.indexOf(prop as string) !== -1) {
        throw Error("Cannot access a mutator method on an Accessor object.");
      }
      return (obj as any)[prop];
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

export function makeGetOnlyArrayProxy(ary: any[]): any {
  return new Proxy(ary, getOnlyArrayProxyHandler);
}

export interface AddInfo {
  start: number
  count: number
}

export interface RemoveInfo extends AddInfo {

}

/**
 * Specialized Mutator for arrays
 * Acts as a proxy for the watched array
 * Wraps array methods that modify the underlying array in order to invoke callbacks for additions and removals
 * Any other method is implemented as a pass through
 */
export class ArrayMutator implements DynamicProperties, Mutator {
  private readonly _watcher: ObjectWatcher;

  constructor(watcher: ObjectWatcher) {
    this._watcher = watcher;
    this._watcher._mutator = this;

    let self = this;
    for (let method of arrayNonMutatorMethods) {
      (this as any)[method] = function (...args: any[]) {
        return self._watcher._data[method](...args);
      }
    }
  }

  _makeProperty(field: PropertyKey): void {

  }

  /**
   * Gets a Mutator for a specified index
   * A Mutator will only exist if the array was of objects
   * @param {number} index
   * @returns {Mutator}
   */
  at(index: number): Mutator {
    return ObjectWatcher.getMutator(this._watcher, index);
  }

  /**
   * Calls underlying push method and raises add and change callbacks
   * @param values
   * @returns {number}
   */
  push(...values: any[]): number {
    let addInfo: AddInfo = {
      start: this.data.length,
      count: values.length
    };
    let length = this.data.push(...values);
    this.callAdd(values, addInfo);
    return length;
  }

  /**
   * Calls underlying unshift method and raises add and change callbacks
   * @param values
   * @returns {number}
   */
  unshift(...values: any[]): number {
    let addInfo: AddInfo = {
      start: 0,
      count: values.length
    };
    let length = this.data.unshift(...values);
    this.callAdd(values, addInfo);
    return length;
  }

  /**
   * Calls underlying pop method and raises remove and change callbacks
   * @returns {any}
   */
  pop(): any {
    let index = this.data.length - 1;
    let removed = this.data.pop();
    let removeInfo: RemoveInfo = {
      start: index,
      count: 1
    };
    this.callRemove([removed], removeInfo);
    return removed;
  }

  /**
   * Calls underlying shift method and raises remove and change callbacks
   * @returns {any}
   */
  shift(): any {
    let removed = this.data.shift();
    let removeInfo: RemoveInfo = {
      start: 0,
      count: 1
    };
    this.callRemove([removed], removeInfo);
    return removed;
  }

  /**
   * Calls underlying splice method
   * Raises add callback if deleteCount is not provided
   * Raises remove callback if items are not provided
   * Raises neither add nor remove if both deleteCount and items are provided
   * Raises change always
   * @param {number} start
   * @param {number} deleteCount
   * @param items
   * @returns {any[]}
   */
  splice(start: number, deleteCount: number, ...items: any[]): any[] {
    if (deleteCount === null || typeof deleteCount === 'undefined') {
      deleteCount = 0;
    }

    let removed = this.data.splice(start, deleteCount, ...items);

    if (deleteCount === 0) {
      // Only Adding
      let addInfo: AddInfo = {
        start: start,
        count: items.length
      };
      this.callAdd(items, addInfo);
    } else if (typeof items === 'function' || items.length === 0) {
      // Only Removing
      let removeInfo: RemoveInfo = {
        start: start,
        count: deleteCount
      };
      this.callRemove(removed, removeInfo);
    } else {
      // Added and Removed
      // just raise array changed
      this.callChange();
    }

    return removed;
  }

  /**
   * Calls underlying fill method and raises the change callback
   * @param value
   * @param {number} start
   * @param {number} end
   * @returns {any[]}
   */
  fill(value: any, start: number, end: number): any[] {
    let filled = this.data.fill(value, start, end);
    this.callChange();
    return filled;
  }

  sort(compareFunction: (a: any, b: any) => number): any[] {
    let sorted = this.data.sort(compareFunction);
    this.callChange();
    return sorted;
  }

  copyWithin(target: number, start: number, end: number): any[] {
    let modified = this.data.copyWithin(target, start, end);
    this.callChange();
    return modified;
  }

  /**
   * Calls the add method of any listener that has one
   * Calls change method of any listener that has one
   * @param {any[]} values
   * @param {AddInfo} addInfo
   */
  private callAdd(values: any[], addInfo: AddInfo) {
    for (let options of this.listeners) {
      if (options instanceof ArrayWatcherOptions) {
        if (typeof options.add === 'function') {
          options.add(values, addInfo, this.data);
        }
      }
    }
    this.callChange();
  }

  /**
   * Calls the remove method of any listener that has one
   * Calls change method of any listener that has one
   * @param removed
   * @param {RemoveInfo} removeInfo
   */
  private callRemove(removed: any, removeInfo: RemoveInfo) {
    for (let options of this.listeners) {
      if (options instanceof ArrayWatcherOptions) {
        if (typeof options.remove === 'function') {
          options.remove(removed, removeInfo, this.data);
        }
      }
    }
    this.callChange();
  }

  /**
   * Calls the change method of any listener that has one
   */
  private callChange() {
    this._watcher._notifySubscribers(true, true, true);
  }

  /**
   * Convenience getter for this watchable's data
   * @returns {any[]}
   */
  private get data(): any[] {
    return this._watcher._data
  }

  /**
   * Convenience getter for this watchable's listeners
   * @returns {WatcherOptions[]}
   */
  private get listeners(): WatcherOptions[] {
    return this._watcher._subscribers || [];
  }
}