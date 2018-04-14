import {expect} from 'chai';
import 'jest';
import {Watchable} from "../Watchable";
import {assertWatcherCalled} from "./utils";

describe(`Array Mutator`, () => {
  it('calls array callback when push to array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["one", "two", "three"]);
      watcherCalled = true;
    });

    watchable.Mutator.items.push("three");

    expect(watchable.Accessor.items).to.deep.equal(["one", "two", "three"]);
    assertWatcherCalled(watcherCalled);
  });

  it('calls array callback when unshift to array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["zero", "one", "two"]);
      watcherCalled = true;
    });

    watchable.Mutator.items.unshift("zero");

    expect(watchable.Accessor.items).to.deep.equal(["zero", "one", "two"]);
    assertWatcherCalled(watcherCalled);
  });

  it('calls array change callback when popping from array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["one", "two"]);
      watcherCalled = true;
    });

    let removed = watchable.Mutator.items.pop();

    expect(removed).to.equal("three");
    expect(watchable.Accessor.items).to.deep.equal(["one", "two"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls array change callback when shifting from array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["two", "three"]);
      watcherCalled = true;
    });

    let removed = watchable.Mutator.items.shift();

    expect(removed).to.equal("one");
    expect(watchable.Accessor.items).to.deep.equal(["two", "three"]);

    assertWatcherCalled(watcherCalled);
  });

  it('call array callback when splice with both deleteCount and items arguments', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["1", "2", "3", "three"]);
      watcherCalled = true;
    });

    let removed = watchable.Mutator.items.splice(0, 2, "1", "2", "3");

    expect(removed).to.deep.equal(["one", "two"]);
    expect(watchable.Accessor.items).to.deep.equal(["1", "2", "3", "three"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls array callback when fill is called', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three",
        "four"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal([0, 0, 0, 0]);
      watcherCalled = true;
    });

    let filled = watchable.Mutator.items.fill(0);

    expect(filled).to.deep.equal([0, 0, 0, 0]);
    expect(watchable.Accessor.items).to.deep.equal([0, 0, 0, 0]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls array callback when sort is called', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three",
        "four"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["four", "one", "three", "two"]);
      watcherCalled = true;
    });

    let sorted = watchable.Mutator.items.sort();

    expect(sorted).to.deep.equal(["four", "one", "three", "two"]);
    expect(watchable.Accessor.items).to.deep.equal(["four", "one", "three", "two"]);

    assertWatcherCalled(watcherCalled);
  });

  it(`calls array callback when copyWithin is called`, () => {

    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three",
        "four"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: string[]) => {
      expect(value).to.deep.equal(["one", "three", "three", "four"]);
      watcherCalled = true;
    });

    let copied = watchable.Mutator.items.copyWithin(1, 2, 3);

    expect(copied).to.deep.equal(["one", "three", "three", "four"]);
    expect(watchable.Accessor.items).to.deep.equal(["one", "three", "three", "four"]);

    assertWatcherCalled(watcherCalled);
  });

  it('can have watcher on array element', () => {
    let watchable = new Watchable({
      items: [
        {
          headline: "Headline"
        }
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items[0], (value: any) => {
      expect(value).to.deep.equal({headline: "New Headline"});
      watcherCalled = true;
    });

    watchable.Mutator.items[0].headline = "New Headline";

    assertWatcherCalled(watcherCalled);
  });

  it('element watcher receives undefined when it is removed from array', () => {
    let watchable = new Watchable({
      items: [
        {
          headline: "Headline"
        }
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items[0], (value: any) => {
      expect(value).to.be.undefined;
      watcherCalled = true;
    });

    watchable.Mutator.items.pop();

    assertWatcherCalled(watcherCalled);
  });

  it('element receives new item after being removed from array', () => {
    let watchable = new Watchable({
      items: [
        {
          headline: "Headline"
        }
      ]
    });

    watchable.Mutator.items.pop();

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items[0], (value: any) => {
      expect(value).to.deep.equal({headline: "New Headline"});
      watcherCalled = true;
    });

    watchable.Mutator.items.push({headline: "New Headline"});

    assertWatcherCalled(watcherCalled);
  });

  it(`can watch dynamic item`, () => {
    let watchable = new Watchable({
      items: []
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items[0], (value: any) => {
      expect(value).to.equal("Value");
      watcherCalled = true;
    });

    watchable.Mutator.items.push("Value");

    assertWatcherCalled(watcherCalled);
  });

  it(`can watch property on dynamic item`, () => {
    let watchable = new Watchable({
      items: []
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items[0].value, (value: any) => {
      expect(value).to.equal("Value");
      watcherCalled = true;
    });

    watchable.Mutator.items[0].value = "Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`can perform push on a dynamic array`, () => {
    let watchable = new Watchable({});

    let changeWatcherCalled = false;
    Watchable.watch(watchable.Watcher.items, (value: any) => {
      // First set is an empty array, then this gets called again after push
      if (changeWatcherCalled === false) {
        expect(value).to.deep.equal([]);
        changeWatcherCalled = true;
      } else {
        expect(value).to.deep.equal(["Value"]);
      }
    });
    watchable.Mutator.items = [];
    watchable.Mutator.items.push("Value");

    assertWatcherCalled(changeWatcherCalled);
  });

  /**
   * Non Mutator method testing
   */

  it(`Calling concat works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let concatenated = watchable.Mutator.list.concat('four', 'five', 'six');

    expect(concatenated).to.deep.equal(['one', 'two', 'three', 'four', 'five', 'six']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling entries works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let entries = watchable.Mutator.list.entries();

    expect(entries.next().value).to.deep.equal([0, 'one']);
    expect(entries.next().value).to.deep.equal([1, 'two']);
    expect(entries.next().value).to.deep.equal([2, 'three']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling every works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let every = watchable.Mutator.list.every((item: string) => item[0] === 't');

    expect(every).to.deep.equal(false);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling filter works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let filtered = watchable.Mutator.list.filter((item: string) => item.length === 3);

    expect(filtered).to.deep.equal(['one', 'two']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling find works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let found = watchable.Mutator.list.find((item: string) => item === 'one');

    expect(found).to.equal('one');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling findIndex works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let found = watchable.Mutator.list.findIndex((item: string) => item === 'three');

    expect(found).to.equal(2);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling forEach works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let modified: string[] = [];
    watchable.Mutator.list.forEach((item: string) => modified.push(item + "modified"));

    expect(modified).to.deep.equal(['onemodified', 'twomodified', 'threemodified']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling includes works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let includesTwo = watchable.Mutator.list.includes('two');

    expect(includesTwo).to.equal(true);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling indexOf works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let indexOfTwo = watchable.Mutator.list.indexOf('two');

    expect(indexOfTwo).to.equal(1);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling join works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let joined = watchable.Mutator.list.join(',');

    expect(joined).to.equal('one,two,three');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling keys works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let keys = watchable.Mutator.list.keys();

    expect(keys.next().value).to.equal(0);
    expect(keys.next().value).to.equal(1);
    expect(keys.next().value).to.equal(2);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling lastIndexOf works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let lastIndexOfTwo = watchable.Mutator.list.lastIndexOf('two');

    expect(lastIndexOfTwo).to.equal(1);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling map works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let mapped = watchable.Mutator.list.map((item: string) => item + "mapped");

    expect(mapped).to.deep.equal(['onemapped', 'twomapped', 'threemapped']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling reduce works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let reduced = watchable.Mutator.list.reduce((result: any, item: string) => {
      return result + item;
    }, "");

    expect(reduced).to.equal('onetwothree');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling reduceRight works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let reduced = watchable.Mutator.list.reduceRight((result: any, item: string) => {
      return result + item;
    }, "");

    expect(reduced).to.equal('threetwoone');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling slice works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let sliced = watchable.Mutator.list.slice(0, 2);

    expect(sliced).to.deep.equal(['one', 'two']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling some works normally leaves array value unmodified`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let someBeginWithO = watchable.Mutator.list.some((item: string) => item[0] === 'o');

    expect(someBeginWithO).to.equal(true);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling toLocaleString works normally leaves array value unmodified`, () => {
    let date = new Date('21 Dec 1997 14:12:00 UTC');
    let watchable = new Watchable({
      list: ['one', 'two', date]
    });

    let locale = watchable.Mutator.list.toLocaleString();

    expect(locale).to.equal("one,two,1997-12-21 09:12:00");
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', date]);
  });
});