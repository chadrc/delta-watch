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
    set: function (): boolean {
      throw Error("Date has no settable values");
    }
  };
}

const dateMutatorMethods = [
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setUTCTime',
];

export function makeDateMutator(watcher: ObjectWatcher) {
  let internals = {
    watcher: watcher
  };

  return new Proxy(watcher._data, makeHandler<Date>(internals, dateMutatorMethods));
}

const getOnlyDateProxyHandler: ProxyHandler<Date> = {
  get: function (obj: Date, prop: PropertyKey) {
    if (prop in obj) {
      let field = (obj as any)[prop];
      if (typeof field === 'function') {
        if (dateMutatorMethods.indexOf(prop as string) !== -1) {
          throw Error("Cannot access a mutator method on an Accessor object.");
        }
        field = field.bind(obj);
      }
      return field;
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

export function makeGetOnlyDateProxy(date: Date): any {
  return new Proxy(date, getOnlyDateProxyHandler);
}