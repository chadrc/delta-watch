import {DeltaWatch, Watchable} from './core/DeltaWatch';
import {TypeRegistry} from "./types/TypeRegistry";

export default {
  Watchable: (data: object, typeRegistry?: TypeRegistry): DeltaWatch => {
    return new DeltaWatch(data, typeRegistry);
  },
  Watch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.watch(watchable, cb);
  },
  Unwatch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.unwatch(watchable, cb);
  },
  get DefaultTypeRegistry(): TypeRegistry {
    return TypeRegistry.defaultTypeRegistry;
  },
  get NewTypeRegistry(): TypeRegistry {
    return new TypeRegistry([]);
  }
}