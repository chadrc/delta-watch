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

  /**
   * Mutation and access tests for mutation methods
   */
  it(`Calling setDate on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 25, 2018 00:00:00');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setDate(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setDate on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setDate(25);
    expect(func).to.throw();
  });

  it(`Calling setFullYear on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2020 00:00:00');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setFullYear(2020);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setFullYear on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setFullYear(2020);
    expect(func).to.throw();
  });

  it(`Calling setHours on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 20:00:00');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setHours(20);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setHours on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setHours(20);
    expect(func).to.throw();
  });

  it(`Calling setMilliseconds on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getMilliseconds()).to.equal(200);
      watcherCalled = true;
    });

    watchable.Mutator.date.setMilliseconds(200);
    expect(watchable.Accessor.date.getMilliseconds()).to.equal(200);
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMilliseconds on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMilliseconds(20);
    expect(func).to.throw();
  });

  it(`Calling setMinutes on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 00:25:00');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setMinutes(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMinutes on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMinutes(25);
    expect(func).to.throw();
  });

  it(`Calling setMonth on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('May 1, 2018 00:00:00');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setMonth(4);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMonth on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMonth(4);
    expect(func).to.throw();
  });

  it(`Calling setSeconds on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 00:00:34');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setSeconds(34);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setSeconds on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setSeconds(34);
    expect(func).to.throw();
  });

  it(`Calling setTime on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('June 13, 2018 04:39:27');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setTime(expectedDate.getTime());
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setTime on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setTime(new Date('June 13, 2018 04:39:27').getTime());
    expect(func).to.throw();
  });

  it(`Calling setUTCDate on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 25, 2018 00:00:00 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCDate(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCDate on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCDate(25);
    expect(func).to.throw();
  });

  it(`Calling setUTCFullYear on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2020 00:00:00 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCFullYear(2020);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCFullYear on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCFullYear(2020);
    expect(func).to.throw();
  });

  it(`Calling setUTCHours on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 20:00:00 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCHours(20);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCHours on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCHours(20);
    expect(func).to.throw();
  });

  it(`Calling setUTCMilliseconds on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getMilliseconds()).to.equal(200);
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMilliseconds(200);
    expect(watchable.Accessor.date.getMilliseconds()).to.equal(200);
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMilliseconds on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMilliseconds(20);
    expect(func).to.throw();
  });

  it(`Calling setUTCMinutes on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 00:25:00 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMinutes(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMinutes on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMinutes(25);
    expect(func).to.throw();
  });

  it(`Calling setUTCMonth on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('May 1, 2018 00:00:00 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMonth(4);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMonth on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMonth(4);
    expect(func).to.throw();
  });

  it(`Calling setUTCSeconds on Date mutator calls callback`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 00:00:34 GMT-0000');
    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCSeconds(34);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCSeconds on Date accessor throws error`, () => {
    let watchable = new Watchable({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCSeconds(34);
    expect(func).to.throw();
  });
});