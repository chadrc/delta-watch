import {ObjectWatcher} from "./ObjectWatcher";
import {arrayMutatorMethods} from "./ArrayMutator";

const getOnlyProxyHandler = {
  get: function (obj: ObjectWatcher, prop: PropertyKey) {
    if (prop in obj) {
      let val = (obj as any)[prop];
      if (typeof val === "object") {
        return Array.isArray(val) ? makeGetOnlyArrayProxy(val) : makeGetOnlyProxy(val);
      } else {
        return val;
      }
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

const getOnlyArrayProxyHandler = {
  get: function (obj: any[], prop: PropertyKey) {
    if (prop in obj) {
      if (typeof prop === 'string' && arrayMutatorMethods.indexOf(prop) !== -1) {
        throw Error("Cannot access a mutator method on a the Accessor object.");
      }
      return (obj as any)[prop];
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

function makeGetOnlyArrayProxy(ary: any[]): any {
  return new Proxy(ary, getOnlyArrayProxyHandler);
}

export function makeGetOnlyProxy(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}