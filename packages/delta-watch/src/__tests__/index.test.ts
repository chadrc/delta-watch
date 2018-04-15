import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled} from "./utils";
import DeltaWatch from '../index';

describe(`Testing package exports`, () => {
  it(`Work just like their internal counterparts`, () => {
    let watchable = DeltaWatch.Watchable({
      value: "Starting Value"
    });

    let watcherCalled = false;
    DeltaWatch.Watch(watchable.Watcher.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    watchable.Mutator.value = "New Value";

    expect(watchable.Accessor.value).to.equal("New Value");
    assertWatcherCalled(watcherCalled);
  });
});