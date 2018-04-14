import {ObjectWatcher} from "./ObjectWatcher";

const getOnlyProxyHandler = {
  get: function (obj: ObjectWatcher, prop: PropertyKey) {
    if (prop in obj) {
      let val = (obj as any)[prop];
      if (typeof val === "object") {
        return makeGetOnlyProxyHandler(val);
      } else {
        return val;
      }
    }
  }
};

export function makeGetOnlyProxyHandler(obj: any): any {
  return new Proxy(obj, getOnlyProxyHandler);
}