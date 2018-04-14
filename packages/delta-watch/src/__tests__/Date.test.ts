import {Watchable} from "../Watchable";
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled, assertWatcherNotCalled} from "./utils";

describe(`Dates`, () => {
  it(`Can watch, mutate, and access Date objects`, () => {
    let now = new Date();
    let watchable = new Watchable({
      date: now
    });

    let newNow = new Date();

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value).to.equal(newNow);
      watcherCalled = true;
    });

    watchable.Mutator.date = newNow;
    let date = watchable.Accessor.date;
    // Because we create a proxy for object types and proxy !== target
    // other means of comparison are required
    expect(watchable.Accessor.date.getTime()).to.equal(newNow.getTime());
    assertWatcherCalled(watcherCalled);
  });
});