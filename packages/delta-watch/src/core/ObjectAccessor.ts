import {TypeRegistry} from "../types/TypeRegistry";

function makeObjectAccessorHandler(typeRegistry: TypeRegistry) {
    return {
        get: function (obj: any, prop: PropertyKey) {
            if (prop in obj) {
                let val = (obj as any)[prop];
                let makeAccessor = typeRegistry.getMakeAccessorForValue(val);
                let proxy = makeAccessor ? makeAccessor(val, typeRegistry) : null;
                return proxy === null ? val : proxy;
            }
        },
        set: function () {
            throw Error("Cannot set a value on the Accessor object.");
        }
    };
}

export function makeObjectAccessor(obj: any, typeRegistry: TypeRegistry): any {
    return new Proxy(obj, makeObjectAccessorHandler(typeRegistry));
}