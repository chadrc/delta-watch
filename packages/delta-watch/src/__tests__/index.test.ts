import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled, assertWatcherNotCalled} from "./utils";
import DeltaWatch from '../index';

describe(`Testing package exports`, () => {
  it(`Can watch, mutate, and access just like internal counterparts`, () => {
    let watchable = DeltaWatch.Watchable({
      value: "Starting Value"
    });

    let watcherCalled = false;
    const cb = (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    };

    DeltaWatch.Watch(watchable.Watcher.value, cb);

    watchable.Mutator.value = "New Value";

    expect(watchable.Accessor.value).to.equal("New Value");
    assertWatcherCalled(watcherCalled);

    DeltaWatch.Unwatch(watchable.Watcher.value, cb);

    watcherCalled = false;

    watchable.Mutator.value = "Next Value";

    assertWatcherNotCalled(watcherCalled);
  });
});