import {DeltaWatch} from "../core/DeltaWatch";
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled, assertWatcherNotCalled} from "./utils";

describe(`Watchable`, () => {
  it("Basic support", () => {
    expect(DeltaWatch).to.exist;
  });

  it(`Create with object`, () => {
    new DeltaWatch({
      value: "DeltaWatch"
    })
  });

  it(`Create with null property on object`, () => {
    new DeltaWatch({
      value: null
    })
  });

  it(`Create with array`, () => {
    new DeltaWatch([
      'item 1'
    ]);
  });

  it(`Throws error when creating with null data`, () => {
    let func = () => new DeltaWatch(null);
    expect(func).to.throw();
  });

  it(`Watchable has Mutator property`, () => {
    let watchable = new DeltaWatch({value: "Value"});
    expect(watchable.Mutator).to.exist;
  });

  it(`Watchable has static 'watch' method`, () => {
    expect(DeltaWatch.watch).to.exist;
  });

  it(`Watchable has static 'unwatch' method`, () => {
    expect(DeltaWatch.unwatch).to.exist;
  });

  it(`Accessor value is comparable`, () => {
    let watchable = new DeltaWatch({
      value: "Value"
    });

    expect(watchable.Accessor.value).to.equal("Value");
  });

  it(`Calls callback on root object`, () => {
    let watchable = new DeltaWatch({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(watchable, (value: any) => {
      expect(value).to.deep.equal({value: "Changed Value"});
      watcherCalled = true;
    });

    watchable.Mutator = {value: "Changed Value"};

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on root Watcher`, () => {
    let watchable = new DeltaWatch({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher, (value: any) => {
      expect(value).to.deep.equal({value: "Changed Value"});
      watcherCalled = true;
    });

    watchable.Mutator = {value: "Changed Value"};

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on first tier property`, () => {
    let watchable = new DeltaWatch({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Does not call callback on first tier property if value is same`, () => {
    let watchable = new DeltaWatch({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.value, () => {
      watcherCalled = true;
    });

    watchable.Mutator.value = "DeltaWatch";

    assertWatcherNotCalled(watcherCalled);
  });

  it('Can remove listener on property', () => {
    let watchable = new DeltaWatch({
      value: "DeltaWatch Value"
    });

    const cb = () => {
    };

    DeltaWatch.watch(watchable.Watcher.value, cb);

    let asAny = watchable.Watcher.value as any;
    let count = asAny._subscribers.length;
    expect(count).to.equal(1);

    DeltaWatch.unwatch(watchable.Watcher.value, cb);

    count = asAny._subscribers.length;
    expect(count).to.equal(0);
  });

  it(`Assigning to a value that was an object calls callback`, () => {
    let watchable = new DeltaWatch({
      item: {}
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.item, (value: string) => {
      expect(value).to.equal("Changed Value");
      watcherCalled = true;
    });

    DeltaWatch.watch(watchable.Watcher.item.value, () => {});

    watchable.Mutator.item = "Changed Value";

    expect(watchable.Accessor.item).to.equal("Changed Value");

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on second tier property`, () => {
    let watchable = new DeltaWatch({
      obj: {
        value: "DeltaWatch"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.obj.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.obj.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on third tier property`, () => {
    let watchable = new DeltaWatch({
      obj: {
        item: {
          value: "DeltaWatch"
        }
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.obj.item.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    watchable.Mutator.obj.item.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it('calls parent callback when child is mutated', () => {
    let watchable = new DeltaWatch({
      obj: {
        one: "one"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.obj, (newValue: object) => {
      expect(newValue).to.deep.equal({one: "1"});
      watcherCalled = true;
    });

    watchable.Mutator.obj.one = "1";

    expect(watchable.Accessor.obj).to.deep.equal({one: "1"});

    assertWatcherCalled(watcherCalled);
  });

  it('calls root callback when child is mutated', () => {
    let watchable = new DeltaWatch({
      obj: {
        one: "one"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher, (newValue: object) => {
      expect(newValue).to.deep.equal({obj: {one: "1"}});
      watcherCalled = true;
    });

    watchable.Mutator.obj.one = "1";

    expect(watchable.Accessor).to.deep.equal({obj: {one: "1"}});

    assertWatcherCalled(watcherCalled);
  });

  it('calls child callback when parent is mutated', () => {
    let watchable = new DeltaWatch({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.obj.item.title, (newValue: object) => {
      expect(newValue).to.equal("New Title");
      watcherCalled = true;
    });

    watchable.Mutator.obj = {
      item: {
        title: "New Title"
      }
    };

    expect(watchable.Accessor.obj.item.title).to.equal("New Title");

    assertWatcherCalled(watcherCalled);
  });

  it('calls child callback when root is mutated', () => {
    let watchable = new DeltaWatch({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.obj.item.title, (newValue: object) => {
      expect(newValue).to.equal("New Title");
      watcherCalled = true;
    });

    watchable.Mutator = {
      obj: {
        item: {
          title: "New Title"
        }
      }
    };

    expect(watchable.Accessor.obj.item.title).to.equal("New Title");

    assertWatcherCalled(watcherCalled);
  });

  it(`Callback only called once when parent is modified`, () => {
    let watchable = new DeltaWatch({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let callCount = 0;
    DeltaWatch.watch(watchable.Watcher.obj.item, () => {
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
    let watchable = new DeltaWatch({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let callCount = 0;
    DeltaWatch.watch(watchable.Watcher.obj.item, () => {
      callCount++;
    });

    watchable.Mutator.obj.item.title = "New Title";

    expect(callCount).to.equal(1);
  });

  it(`Callback not called if child is unmodified`, () => {
    let watchable = new DeltaWatch({
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
    DeltaWatch.watch(watchable.Watcher.obj.item2, () => {
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
    let watchable = new DeltaWatch({
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

    expect(watchable.Accessor.obj.item.title).to.equal("New Title");
  });

  it(`can watch first tier property that wasn't in initial set`, () => {
    let watchable = new DeltaWatch({
      startingProp: "Starting value"
    });

    DeltaWatch.watch(watchable.Watcher.dynamicProp, () => {
    });
  });

  it(`dynamic property value is initialized to undefined`, () => {
    let watchable = new DeltaWatch({});

    expect(watchable.Accessor.dynamicProp).to.be.undefined;
  });

  it(`can watch dynamic second tier property`, () => {
    let watchable = new DeltaWatch({});
    DeltaWatch.watch(watchable.Watcher.dynamicProp.child, () => {
    });
  });

  it(`can mutate dynamic first tier property`, () => {
    let watchable = new DeltaWatch({});
    watchable.Mutator.value = "Dynamic Value";
  });

  it(`can mutate dynamic second tier property`, () => {
    let watchable = new DeltaWatch({});
    watchable.Mutator.item.value = "Won't Set";
  });

  it(`can mutate dynamic second tier property after setting a dynamic first tier property to an object`, () => {
    let watchable = new DeltaWatch({});
    watchable.Mutator.item = {};
    watchable.Mutator.item.value = "Dynamic Value";
  });

  it(`mutating a first tier dynamic property calls callback`, () => {
    let watchable = new DeltaWatch({});

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    watchable.Mutator.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`mutating a second tier dynamic property calls callback`, () => {
    let watchable = new DeltaWatch({});

    let watcherCalled = false;
    DeltaWatch.watch(watchable.Watcher.item.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    watchable.Mutator.item.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });
});