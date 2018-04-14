import {arrayMutatorMethods} from "./ArrayMutator";

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

const getOnlyArrayProxyHandler = {
  get: function (obj: any[], prop: PropertyKey) {
    if (prop in obj) {
      if (arrayMutatorMethods.indexOf(prop as string) !== -1) {
        throw Error("Cannot access a mutator method on a the Accessor object.");
      }
      return (obj as any)[prop];
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

const getOnlyDateProxyHandler: ProxyHandler<Date> = {
  get: function (obj: Date, prop: PropertyKey) {
    if (prop in obj) {
      let field = (obj as any)[prop];
      if (typeof field === 'function') {
        field = field.bind(obj);
      }
      return field;
    }
  },
  set: function () {
    throw Error("Cannot set a value on the Accessor object.");
  }
};

function makeGetOnlyDateProxy(date: Date): any {
  return new Proxy(date, getOnlyDateProxyHandler);
}

function makeGetOnlyArrayProxy(ary: any[]): any {
  return new Proxy(ary, getOnlyArrayProxyHandler);
}

export function makeGetOnlyProxy(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}