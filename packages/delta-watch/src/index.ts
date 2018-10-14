import {DeltaWatch, Watchable} from './core/DeltaWatch';

export default {
  Watchable: <T> (data: T): DeltaWatch<T> => {
    return new DeltaWatch<T>(data);
  },
  Watch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.watch(watchable, cb);
  },
  Unwatch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.unwatch(watchable, cb);
  }
}