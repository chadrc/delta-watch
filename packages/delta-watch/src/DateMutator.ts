import {ObjectWatcher} from "./ObjectWatcher";

function makeHandler<T extends object>(internals: any, mutatorMethods: string[]): ProxyHandler<T> {
  return {
    get: function (target: T, prop: PropertyKey) {
      if (prop === "__DeltaWatchInternals") {
        return internals;
      }

      if (prop in target) {
        let field = (target as any)[prop];
        if (typeof field === 'function') {
          field = field.bind(target);
          if (mutatorMethods.indexOf(prop as string) !== -1) {
            return function (...args: any[]) {
              let result = field(...args);
              internals.watcher._notifySubscribers(true, true, true);
              return result;
            }
          }
        }
        return field;
      }
    },
    set: function (target: T, prop: PropertyKey, value: any): boolean {
      return true;
    }
  };
}

export const dateMutatorMethods = [
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
];

export function makeDateMutator(watcher: ObjectWatcher) {
  let internals = {
    watcher: watcher
  };

  return new Proxy(watcher._data, makeHandler<Date>(internals, dateMutatorMethods));
}