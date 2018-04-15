import {DeltaWatch} from "../DeltaWatch";
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled} from "./utils";

describe(`Date Type`, () => {
  it(`Can watch, mutate, and access Date objects`, () => {
    let now = new Date();
    let watchable = new DeltaWatch({
      date: now
    });

    let newNow = new Date();

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
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

  it(`Setting a value on a Date object throws error`, () => {
    let now = new Date();
    let watchable = new DeltaWatch({
      date: now
    });

    let func = () => watchable.Mutator.date.fakeValue = "0";
    expect(func).to.throw();
  });

  /**
   * Mutation and access tests for mutation methods
   */
  it(`Calling setDate on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 25, 2018 00:00:00');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setDate(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setDate on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setDate(25);
    expect(func).to.throw();
  });

  it(`Calling setFullYear on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2020 00:00:00');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setFullYear(2020);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setFullYear on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setFullYear(2020);
    expect(func).to.throw();
  });

  it(`Calling setHours on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 20:00:00');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setHours(20);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setHours on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setHours(20);
    expect(func).to.throw();
  });

  it(`Calling setMilliseconds on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getMilliseconds()).to.equal(200);
      watcherCalled = true;
    });

    watchable.Mutator.date.setMilliseconds(200);
    expect(watchable.Accessor.date.getMilliseconds()).to.equal(200);
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMilliseconds on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMilliseconds(20);
    expect(func).to.throw();
  });

  it(`Calling setMinutes on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 00:25:00');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setMinutes(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMinutes on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMinutes(25);
    expect(func).to.throw();
  });

  it(`Calling setMonth on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('May 1, 2018 00:00:00');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setMonth(4);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setMonth on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setMonth(4);
    expect(func).to.throw();
  });

  it(`Calling setSeconds on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('January 1, 2018 00:00:34');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setSeconds(34);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setSeconds on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setSeconds(34);
    expect(func).to.throw();
  });

  it(`Calling setTime on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let expectedDate = new Date('June 13, 2018 04:39:27');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setTime(expectedDate.getTime());
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setTime on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00')
    });

    let func = () => watchable.Accessor.date.setTime(new Date('June 13, 2018 04:39:27').getTime());
    expect(func).to.throw();
  });

  it(`Calling setUTCDate on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 25, 2018 00:00:00 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCDate(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCDate on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCDate(25);
    expect(func).to.throw();
  });

  it(`Calling setUTCFullYear on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2020 00:00:00 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCFullYear(2020);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCFullYear on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCFullYear(2020);
    expect(func).to.throw();
  });

  it(`Calling setUTCHours on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 20:00:00 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCHours(20);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCHours on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCHours(20);
    expect(func).to.throw();
  });

  it(`Calling setUTCMilliseconds on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getMilliseconds()).to.equal(200);
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMilliseconds(200);
    expect(watchable.Accessor.date.getMilliseconds()).to.equal(200);
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMilliseconds on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMilliseconds(20);
    expect(func).to.throw();
  });

  it(`Calling setUTCMinutes on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 00:25:00 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMinutes(25);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMinutes on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMinutes(25);
    expect(func).to.throw();
  });

  it(`Calling setUTCMonth on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('May 1, 2018 00:00:00 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCMonth(4);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCMonth on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCMonth(4);
    expect(func).to.throw();
  });

  it(`Calling setUTCSeconds on Date mutator calls callback`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let expectedDate = new Date('January 1, 2018 00:00:34 GMT-0000');
    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.date, (value: Date) => {
      expect(value.getTime()).to.equal(expectedDate.getTime());
      watcherCalled = true;
    });

    watchable.Mutator.date.setUTCSeconds(34);
    expect(watchable.Accessor.date.getTime()).to.equal(expectedDate.getTime());
    assertWatcherCalled(watcherCalled);
  });

  it(`Calling setUTCSeconds on Date accessor throws error`, () => {
    let watchable = new DeltaWatch({
      date: new Date('January 1, 2018 00:00:00 GMT-0000')
    });

    let func = () => watchable.Accessor.date.setUTCSeconds(34);
    expect(func).to.throw();
  });

  /**
   * Mutator and Accessor usage of non mutating methods
   */

  it(`Calling getDate on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getDate()).to.equal(27);
    expect(watchable.Mutator.date.getDate()).to.equal(27);
  });

  it(`Calling getDay on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59');
    let theDay = date.getDay();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getDay()).to.equal(theDay);
    expect(watchable.Mutator.date.getDay()).to.equal(theDay);
  });

  it(`Calling getFullYear on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getFullYear()).to.equal(2018);
    expect(watchable.Mutator.date.getFullYear()).to.equal(2018);
  });

  it(`Calling getHours on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getHours()).to.equal(19);
    expect(watchable.Mutator.date.getHours()).to.equal(19);
  });

  it(`Calling getMilliseconds on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59');
    let ms = date.getMilliseconds();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getMilliseconds()).to.equal(ms);
    expect(watchable.Mutator.date.getMilliseconds()).to.equal(ms);
  });

  it(`Calling getMinutes on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getMinutes()).to.equal(34);
    expect(watchable.Mutator.date.getMinutes()).to.equal(34);
  });

  it(`Calling getMonth on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getMonth()).to.equal(3);
    expect(watchable.Mutator.date.getMonth()).to.equal(3);
  });

  it(`Calling getSeconds on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59')
    });

    expect(watchable.Accessor.date.getSeconds()).to.equal(59);
    expect(watchable.Mutator.date.getSeconds()).to.equal(59);
  });

  it(`Calling getTime on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59');
    let sec = date.getTime();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getTime()).to.equal(sec);
    expect(watchable.Mutator.date.getTime()).to.equal(sec);
  });

  it(`Calling getTimezoneOffset on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59');
    let timeZone = date.getTimezoneOffset();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getTimezoneOffset()).to.equal(timeZone);
    expect(watchable.Mutator.date.getTimezoneOffset()).to.equal(timeZone);
  });

  it(`Calling getUTCDate on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCDate()).to.equal(27);
    expect(watchable.Mutator.date.getUTCDate()).to.equal(27);
  });

  it(`Calling getUTCDay on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let theDay = date.getUTCDay();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getUTCDay()).to.equal(theDay);
    expect(watchable.Mutator.date.getUTCDay()).to.equal(theDay);
  });

  it(`Calling getUTCFullYear on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCFullYear()).to.equal(2018);
    expect(watchable.Mutator.date.getUTCFullYear()).to.equal(2018);
  });

  it(`Calling getUTCHours on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCHours()).to.equal(22);
    expect(watchable.Mutator.date.getUTCHours()).to.equal(22);
  });

  it(`Calling getUTCMilliseconds on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let ms = date.getUTCMilliseconds();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.getUTCMilliseconds()).to.equal(ms);
    expect(watchable.Mutator.date.getUTCMilliseconds()).to.equal(ms);
  });

  it(`Calling getUTCMinutes on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCMinutes()).to.equal(34);
    expect(watchable.Mutator.date.getUTCMinutes()).to.equal(34);
  });

  it(`Calling getUTCMonth on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCMonth()).to.equal(3);
    expect(watchable.Mutator.date.getUTCMonth()).to.equal(3);
  });

  it(`Calling getUTCSeconds on Accessor and Mutator Date object return normal value`, () => {
    let watchable = new DeltaWatch({
      date: new Date('April 27, 2018 19:34:59 GMT-0300')
    });

    expect(watchable.Accessor.date.getUTCSeconds()).to.equal(59);
    expect(watchable.Mutator.date.getUTCSeconds()).to.equal(59);
  });

  it(`Calling toDateString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toDateString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toDateString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toDateString()).to.equal(expectedString);
  });

  it(`Calling toISOString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toISOString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toISOString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toISOString()).to.equal(expectedString);
  });

  it(`Calling toJSON on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toJSON();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toJSON()).to.equal(expectedString);
    expect(watchable.Mutator.date.toJSON()).to.equal(expectedString);
  });

  it(`Calling toLocaleDateString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toLocaleDateString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toLocaleDateString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toLocaleDateString()).to.equal(expectedString);
  });

  it(`Calling toLocaleString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toLocaleString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toLocaleString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toLocaleString()).to.equal(expectedString);
  });

  it(`Calling toLocaleTimeString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toLocaleTimeString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toLocaleTimeString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toLocaleTimeString()).to.equal(expectedString);
  });

  it(`Calling toString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toString()).to.equal(expectedString);
  });

  it(`Calling toTimeString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toTimeString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toTimeString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toTimeString()).to.equal(expectedString);
  });

  it(`Calling toUTCString on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedString = date.toUTCString();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.toUTCString()).to.equal(expectedString);
    expect(watchable.Mutator.date.toUTCString()).to.equal(expectedString);
  });

  it(`Calling valueOf on Accessor and Mutator Date object return normal value`, () => {
    let date = new Date('April 27, 2018 19:34:59 GMT-0300');
    let expectedValue = date.valueOf();
    let watchable = new DeltaWatch({
      date: date
    });

    expect(watchable.Accessor.date.valueOf()).to.equal(expectedValue);
    expect(watchable.Mutator.date.valueOf()).to.equal(expectedValue);
  });
});