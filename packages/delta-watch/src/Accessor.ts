import {makeGetOnlyArrayProxy} from "./ArrayMutator";
import {makeGetOnlyDateProxy} from "./DateMutator";

function getProxyForValue(value: any): any {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return makeGetOnlyArrayProxy(value);
    } else if (value instanceof Date) {
      return makeGetOnlyDateProxy(value);
    } else {
      return makeGetOnlyProxy(value);
    }
  }
  return null;
}

const getOnlyProxyHandler = {
  get: function (obj: any, prop: PropertyKey) {
    if (prop in obj) {
      let val = (obj as any)[prop];
      let proxy = getProxyForValue(val);
      return proxy === null ? val : proxy;
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

export function makeGetOnlyProxy(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}