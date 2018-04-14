import {assert, expect} from 'chai';
import 'jest';
import {ArrayWatcher, Watchable} from "../Watchable";
import {assertWatcherCalled} from "./utils";
import {AddInfo, RemoveInfo} from "../ArrayMutator";

describe(`Array Mutator v2`, () => {
  it('calls add callback when pushing to array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      add: (value: string, addInfo: AddInfo, ary: Array<string>) => {
        expect(value).to.deep.equal(["three", "four"]);
        expect(addInfo.start).to.equal(2);
        expect(addInfo.count).to.equal(2);
        expect(ary).to.deep.equal(["one", "two", "three", "four"]);
        watcherCalled = true;
      }
    }));

    let itemMutator = watchable.Mutator.items;
    let length = itemMutator.push("three", "four");

    expect(length).to.equal(4);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["one", "two", "three", "four"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls add callback when unshifting to array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      add: (value: string, addInfo: AddInfo, ary: string[]) => {
        expect(value).to.deep.equal(["zero"]);
        expect(addInfo.start).to.equal(0);
        expect(addInfo.count).to.equal(1);
        expect(ary).to.deep.equal(["zero", "one", "two"]);
        watcherCalled = true;
      }
    }));

    let itemMutator = watchable.Mutator.items;
    let length = itemMutator.unshift("zero");

    expect(length).to.equal(3);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["zero", "one", "two"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls array callback when add to array', () => {
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

    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["one", "two", "three"]);
    assertWatcherCalled(watcherCalled);
  });

  it('calls remove callback when pop from array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      remove: (removed: string[], removeInfo: RemoveInfo, ary: string[]) => {
        expect(removed).to.deep.equal(["three"]);
        expect(removeInfo.start).to.equal(2);
        expect(removeInfo.count).to.equal(1);
        expect(ary).to.deep.equal(["one", "two"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.pop();

    expect(removed).to.equal("three");
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["one", "two"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls remove callback when shift from array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      remove: (removed: string[], removeInfo: RemoveInfo, ary: string[]) => {
        expect(removed).to.deep.equal(["one"]);
        expect(removeInfo.start).to.equal(0);
        expect(removeInfo.count).to.equal(1);
        expect(ary).to.deep.equal(["two", "three"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.shift();

    expect(removed).to.equal("one");
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["two", "three"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls array change callback when removing from array', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      change: (value: string[]) => {
        expect(value).to.deep.equal(["two", "three"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.shift();

    expect(removed).to.equal("one");
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["two", "three"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls add callback when splice with no deleteCount argument', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      add: (added: string, addInfo: AddInfo, ary: string[]) => {
        expect(added).to.deep.equal(["one and one third", "one and two thirds"]);
        expect(addInfo.start).to.equal(1);
        expect(addInfo.count).to.equal(2);
        expect(ary).to.deep.equal(["one", "one and one third", "one and two thirds", "two", "three"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.splice(1, 0, "one and one third", "one and two thirds");

    expect(removed).to.deep.equal([]);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["one", "one and one third", "one and two thirds", "two", "three"]);

    assertWatcherCalled(watcherCalled);
  });

  it('calls remove callback when splice with no items argument', () => {
    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three"
      ]
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      remove: (removed: string[], removeInfo: RemoveInfo, ary: string[]) => {
        expect(removed).to.deep.equal(["one", "two"]);
        expect(removeInfo.start).to.equal(0);
        expect(removeInfo.count).to.equal(2);
        expect(ary).to.deep.equal(["three"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.splice(0, 2);

    expect(removed).to.deep.equal(["one", "two"]);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["three"]);

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
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      change: (value: string[]) => {
        expect(value).to.deep.equal(["1", "2", "3", "three"]);
        watcherCalled = true;
      }
    }));

    let removed = watchable.Mutator.items.splice(0, 2, "1", "2", "3");

    expect(removed).to.deep.equal(["one", "two"]);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["1", "2", "3", "three"]);

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
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      change: (value: string[]) => {
        expect(value).to.deep.equal([0, 0, 0, 0]);
        watcherCalled = true;
      }
    }));

    let filled = watchable.Mutator.items.fill(0);

    expect(filled).to.deep.equal([0, 0, 0, 0]);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal([0, 0, 0, 0]);

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
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      change: (value: string[]) => {
        expect(value).to.deep.equal(["four", "one", "three", "two"]);
        watcherCalled = true;
      }
    }));

    let sorted = watchable.Mutator.items.sort();

    expect(sorted).to.deep.equal(["four", "one", "three", "two"]);
    expect(Watchable.valueOf(watchable.Watcher.items)).to.deep.equal(["four", "one", "three", "two"]);

    assertWatcherCalled(watcherCalled);
  });

  it('remaining array methods exist as pass through', () => {
    let methods = [
      'concat',
      'copyWithin',
      'entries',
      'filter',
      'find',
      'findIndex',
      'forEach',
      'includes',
      'indexOf',
      'join',
      'keys',
      'lastIndexOf',
      'map',
      'reduce',
      'reduceRight',
      'reverse',
      'slice',
      'some',
      'toLocaleString',
      'toSource',
      'values'
    ];

    let watchable = new Watchable({
      items: [
        "one",
        "two",
        "three",
        "four"
      ]
    });

    for (let method of methods) {
      expect(watchable.Mutator.items[method]).to.exist;
      assert(typeof watchable.Mutator.items[method] === 'function');
    }
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

    watchable.Mutator.items.at(0).headline = "New Headline";

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

    watchable.Mutator.items.at(0).value = "Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`can perform push on a dynamic array`, () => {
    let watchable = new Watchable({});

    let changeWatcherCalled = false;
    let addWatcherCalled = false;
    Watchable.watch(watchable.Watcher.items, ArrayWatcher({
      change: (value: any) => {
        // First set is an empty array, then this gets called again after push
        if (changeWatcherCalled === false) {
          expect(value).to.deep.equal([]);
          changeWatcherCalled = true;
        } else {
          expect(value).to.deep.equal(["Value"]);
        }
      },
      add: (values: string[], addInfo: AddInfo, ary: string[]) => {
        expect(values).to.deep.equal(["Value"]);
        expect(addInfo.start).to.equal(0);
        expect(addInfo.count).to.equal(1);
        expect(ary).to.deep.equal(["Value"]);
        addWatcherCalled = true;
      }
    }));

    watchable.Mutator.items = [];

    watchable.Mutator.items.push("Value");

    assertWatcherCalled(changeWatcherCalled);
    assertWatcherCalled(addWatcherCalled);
  });
});