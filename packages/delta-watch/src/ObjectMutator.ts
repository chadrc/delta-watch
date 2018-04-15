import {ObjectWatcher} from "./ObjectWatcher";
import {makeMutationHandler} from "./utils";
import {TypeRegister} from "./Watchable";

function makeObjectAccessorHandler(register: TypeRegister) {
  return {
    get: function (obj: any, prop: PropertyKey) {
      if (prop in obj) {
        let val = (obj as any)[prop];
        let proxy = register.getAccessorForValue(val);
        return proxy === null ? val : proxy;
      }
    },
    set: function () {
      throw Error("Cannot set a value on the Accessor object.");
    }
  };
}

export function makeObjectAccessor(obj: any, typeRegister: TypeRegister): any {
  return new Proxy(obj, makeObjectAccessorHandler(typeRegister));
}

export function makeObjectMutator(watcher: ObjectWatcher): any {
  let internals = {
    watcher: watcher,
    type: "Object"
  };
  return new Proxy({}, makeMutationHandler(internals, [], "*"));
}