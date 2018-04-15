import {ObjectWatcher} from "./ObjectWatcher";
import {makeAccessorHandler, makeMutationHandler} from "./utils";

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

export function makeGetOnlyDateProxy(date: Date): any {
  return new Proxy(date, makeAccessorHandler(dateMutatorMethods));
}

export const DateTypeInfo = {
  makeMutator: makeDateMutator,
  makeAccessor: makeGetOnlyDateProxy,
  handlesValue: (value: any) => {
    return value instanceof Date;
  }
};