import {DeltaWatch, Watchable} from './core/DeltaWatch';

export default {
  Watchable: <T> (data: T): DeltaWatch<T> => {
    return new DeltaWatch<T>(data);
  },
  Watch: <T> (watchable: T, cb: (value: T) => void) => {
    return DeltaWatch.watch(watchable, cb);
  },
  Unwatch: <T> (watchable: T, cb: (value: T) => void) => {
    return DeltaWatch.unwatch(watchable, cb);
  }
}