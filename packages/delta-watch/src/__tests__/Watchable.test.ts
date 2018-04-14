import {Watchable} from "../Watchable";
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled, assertWatcherNotCalled} from "./utils";

describe(`Watchable`, () => {
  it("Basic support", () => {
    expect(Watchable).to.exist;
  });

  it(`Create with object`, () => {
    new Watchable({
      value: "Watchable"
    })
  });

  it(`Create with null property on object`, () => {
    new Watchable({
      value: null
    })
  });

  it(`Create with array`, () => {
    new Watchable([
      'item 1'
    ]);
  });

  it(`Throws error when creating with null data`, () => {
    let func = () => new Watchable(null);
    expect(func).to.throw();
  });

  it(`Watchable has Mutator property`, () => {
    let watchable = new Watchable({value: "Value"});
    expect(watchable.Mutator).to.exist;
  });

  it(`Watchable has static 'watch' method`, () => {
    expect(Watchable.watch).to.exist;
  });

  it(`Calls callback on root object`, () => {
    let watchable = new Watchable({value: "Watchable"});

    let watcherCalled = false;
    Watchable.watch(watchable, (value: any) => {
      expect(value).to.deep.equal({value: "Changed Value"});
      watcherCalled = true;
    });

    watchable.Mutator = {value: "Changed Value"};

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on root Watcher`, () => {
    let watchable = new Watchable({value: "Watchable"});

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher, (value: any) => {
      expect(value).to.deep.equal({value: "Changed Value"});
      watcherCalled = true;
    });

    watchable.Mutator = {value: "Changed Value"};

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on first tier property`, () => {
    let watchable = new Watchable({value: "Watchable"});

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Does not call callback on first tier property if value is same`, () => {
    let watchable = new Watchable({value: "Watchable"});

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.value, () => {
      watcherCalled = true;
    });

    watchable.Mutator.value = "Watchable";

    assertWatcherNotCalled(watcherCalled);
  });

  it('Can remove listener on property', () => {
    let watchable = new Watchable({
      value: "Watchable Value"
    });

    const cb = () => {
    };

    Watchable.watch(watchable.Watcher.value, cb);

    let asAny = watchable.Watcher.value as any;
    let count = asAny._subscribers.length;
    expect(count).to.equal(1);

    Watchable.unwatch(watchable.Watcher.value, cb);

    count = asAny._subscribers.length;
    expect(count).to.equal(0);
  });

  it(`Calls callback on second tier property`, () => {
    let watchable = new Watchable({
      obj: {
        value: "Watchable"
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.obj.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on third tier property`, () => {
    let watchable = new Watchable({
      obj: {
        item: {
          value: "Watchable"
        }
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj.item.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.obj.item.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it('calls parent callback when child is mutated', () => {
    let watchable = new Watchable({
      obj: {
        one: "one"
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj, (newValue: object) => {
      expect(newValue).to.deep.equal({one: "1"});
      watcherCalled = true;
    });

    watchable.Mutator.obj.one = "1";

    expect(watchable.Accessor.obj).to.deep.equal({one: "1"});

    assertWatcherCalled(watcherCalled);
  });

  it('calls root callback when child is mutated', () => {
    let watchable = new Watchable({
      obj: {
        one: "one"
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher, (newValue: object) => {
      expect(newValue).to.deep.equal({obj: {one: "1"}});
      watcherCalled = true;
    });

    watchable.Mutator.obj.one = "1";

    expect(watchable.Accessor).to.deep.equal({obj: {one: "1"}});

    assertWatcherCalled(watcherCalled);
  });

  it('calls child callback when parent is mutated', () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj.item.title, (newValue: object) => {
      expect(newValue).to.deep.equal("New Title");
      watcherCalled = true;
    });

    watchable.Mutator.obj = {
      item: {
        title: "New Title"
      }
    };

    expect(watchable.Mutator.obj.item.title).to.equal("New Title");

    assertWatcherCalled(watcherCalled);
  });

  it('calls child callback when root is mutated', () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj.item.title, (newValue: object) => {
      expect(newValue).to.deep.equal("New Title");
      watcherCalled = true;
    });

    watchable.Mutator = {
      obj: {
        item: {
          title: "New Title"
        }
      }
    };

    expect(watchable.Mutator.obj.item.title).to.equal("New Title");

    assertWatcherCalled(watcherCalled);
  });

  it(`Callback only called once when parent is modified`, () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let callCount = 0;
    Watchable.watch(watchable.Watcher.obj.item, () => {
      callCount++;
    });

    watchable.Mutator = {
      obj: {
        item: {
          title: "New Title"
        }
      }
    };

    expect(callCount).to.equal(1);
  });

  it(`Callback only called once when child is modified`, () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let callCount = 0;
    Watchable.watch(watchable.Watcher.obj.item, () => {
      callCount++;
    });

    watchable.Mutator.obj.item.title = "New Title";

    expect(callCount).to.equal(1);
  });

  it(`Callback not called if child is unmodified`, () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        },
        item2: {
          title: "Title 2"
        }
      }
    });

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.obj.item2, () => {
      watcherCalled = true;
    });

    watchable.Mutator.obj = {
      item: {
        title: "New Title"
      },
      item2: {
        title: "Title 2"
      }
    };

    assertWatcherNotCalled(watcherCalled);
  });

  it('should reference current data not initial data', () => {
    let watchable = new Watchable({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    // Go around interface to ensure data reference is as expected and no callbacks are called
    (watchable as any)._dataValue = {
      obj: {
        item: {
          title: "New Title"
        }
      }
    };

    expect(watchable.Mutator.obj.item.title).to.equal("New Title");
  });

  it(`can watch first tier property that wasn't in initial set`, () => {
    let watchable = new Watchable({
      startingProp: "Starting value"
    });

    Watchable.watch(watchable.Watcher.dynamicProp, () => {
    });
  });

  it(`dynamic property value is initialized to undefined`, () => {
    let watchable = new Watchable({});

    expect(watchable.Accessor.dynamicProp).to.be.undefined;
  });

  it(`can watch dynamic second tier property`, () => {
    let watchable = new Watchable({});
    Watchable.watch(watchable.Watcher.dynamicProp.child, () => {
    });
  });

  it(`can mutate dynamic first tier property`, () => {
    let watchable = new Watchable({});
    watchable.Mutator.value = "Dynamic Value";
  });

  it(`cannot mutate dynamic second tier property`, () => {
    let watchable = new Watchable({});
    let func = () => watchable.Mutator.item.value = "Won't Set";
    expect(func).to.throw();
  });

  it(`can mutate dynamic second tier property after setting a dynamic first tier property to an object`, () => {
    let watchable = new Watchable({});
    watchable.Mutator.item = {};
    watchable.Mutator.item.value = "Dynamic Value";
  });

  it(`mutating a first tier dynamic property calls callback`, () => {
    let watchable = new Watchable({});

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    watchable.Mutator.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`mutating a second tier dynamic property calls callback`, () => {
    let watchable = new Watchable({});

    let watcherCalled = false;
    Watchable.watch(watchable.Watcher.item.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    watchable.Mutator.item.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });
});