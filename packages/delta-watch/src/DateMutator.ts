import {ObjectWatcher} from "./ObjectWatcher";
import {makeMutationHandler} from "./utils";

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

export function makeDateMutator(watcher: ObjectWatcher): any {
  let internals = {
    watcher: watcher,
    type: "Date"
  };

  return new Proxy({}, makeMutationHandler<Date>(internals, dateMutatorMethods));
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