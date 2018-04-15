import {DeltaWatch, Watchable} from './core/DeltaWatch';

export default {
  Make: (data: object): DeltaWatch => {
    return new DeltaWatch(data);
  },
  Watch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.watch(watchable, cb);
  },
  Unwatch: (watchable: Watchable, cb: Function) => {
    return DeltaWatch.unwatch(watchable, cb);
  }
}