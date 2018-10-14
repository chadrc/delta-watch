import {DeltaWatch} from "../core/DeltaWatch";
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled, assertWatcherNotCalled} from "./utils";

interface BasicInfo {
    value: String
}

interface BasicInfo2 {
    item: object | string
}

interface BasicInfo3 {
    obj: {
        value: string
    }
}

interface BasicInfo4 {
    obj: {
        item: {
            value: string
        }
    }
}

interface ComplexInfo1 {
    obj: {
        item: {
            title: string
        }
    }
}

interface ComplexInfo2 {
    obj: {
        item: {
            title: string
        },
        item2: {
            title: string
        }
    }
}

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
    let {Watcher, Mutator} = new DeltaWatch<BasicInfo>({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    Mutator.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Does not call callback on first tier property if value is same`, () => {
    let {Watcher, Mutator} = new DeltaWatch({value: "DeltaWatch"});

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.value, () => {
      watcherCalled = true;
    });

    Mutator.value = "DeltaWatch";

    assertWatcherNotCalled(watcherCalled);
  });

  it('Can remove listener on property', () => {
    let {Watcher} = new DeltaWatch({
      value: "DeltaWatch Value"
    });

    const cb = () => {
    };

    DeltaWatch.watch(Watcher.value, cb);

    let asAny = Watcher.value as any;
    let count = asAny._subscribers.length;
    expect(count).to.equal(1);

    DeltaWatch.unwatch(Watcher.value, cb);

    count = asAny._subscribers.length;
    expect(count).to.equal(0);
  });

  it(`Assigning to a value that was an object calls callback`, () => {
    let {Watcher, Mutator, Accessor} = new DeltaWatch<BasicInfo2>({
      item: {}
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.item, (value: string) => {
      expect(value).to.equal("Changed Value");
      watcherCalled = true;
    });

    Mutator.item = "Changed Value";

    expect(Accessor.item).to.equal("Changed Value");

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on second tier property`, () => {
    let {Watcher, Mutator} = new DeltaWatch<BasicInfo3>({
      obj: {
        value: "DeltaWatch"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.obj.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    Mutator.obj.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`Calls callback on third tier property`, () => {
    let {Watcher, Mutator} = new DeltaWatch<BasicInfo4>({
      obj: {
        item: {
          value: "DeltaWatch"
        }
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.obj.item.value, (value: any) => {
      expect(value).to.deep.equal("Changed Value");
      watcherCalled = true;
    });

    Mutator.obj.item.value = "Changed Value";

    assertWatcherCalled(watcherCalled);
  });

  it('calls parent callback when child is mutated', () => {
    let {Watcher, Mutator, Accessor} = new DeltaWatch({
      obj: {
        value: "one"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.obj, (newValue: object) => {
      expect(newValue).to.deep.equal({value: "1"});
      watcherCalled = true;
    });

    Mutator.obj.value = "1";

    expect(Accessor.obj).to.deep.equal({value: "1"});

    assertWatcherCalled(watcherCalled);
  });

  it('calls root callback when child is mutated', () => {
    let {Watcher, Mutator, Accessor} = new DeltaWatch({
      obj: {
        one: "one"
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher, (newValue: object) => {
      expect(newValue).to.deep.equal({obj: {one: "1"}});
      watcherCalled = true;
    });

    Mutator.obj.one = "1";

    expect(Accessor).to.deep.equal({obj: {one: "1"}});

    assertWatcherCalled(watcherCalled);
  });

  it('calls child callback when parent is mutated', () => {
    let {Watcher, Mutator, Accessor}  = new DeltaWatch({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.obj.item.title, (newValue: object) => {
      expect(newValue).to.equal("New Title");
      watcherCalled = true;
    });

    Mutator.obj = {
      item: {
        title: "New Title"
      }
    };

    expect(Accessor.obj.item.title).to.equal("New Title");

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

    let Watcher = <ComplexInfo1> watchable.Watcher;

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.obj.item.title, (newValue: object) => {
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

    let Watcher = <ComplexInfo1> watchable.Watcher;

    let callCount = 0;
    DeltaWatch.watch(Watcher.obj.item, () => {
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
    let {Watcher, Mutator}  = new DeltaWatch<ComplexInfo1>({
      obj: {
        item: {
          title: "Title"
        }
      }
    });

    let callCount = 0;
    DeltaWatch.watch(Watcher.obj.item, () => {
      callCount++;
    });

    Mutator.obj.item.title = "New Title";

    expect(callCount).to.equal(1);
  });

  it(`Callback not called if child is unmodified`, () => {
    let {Watcher, Mutator}  = new DeltaWatch<ComplexInfo2>({
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
    DeltaWatch.watch(Watcher.obj.item2, () => {
      watcherCalled = true;
    });

    Mutator.obj = {
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
    // because of type checking in Typescript, this usage is only possible with any type or in plain javascript
    let {Watcher}  = new DeltaWatch<any>({
      startingProp: "Starting value"
    });

    DeltaWatch.watch(Watcher.dynamicProp, () => {
    });
  });

  it(`dynamic property value is initialized to undefined`, () => {
    let {Accessor} = new DeltaWatch<any>({});

    expect(Accessor.dynamicProp).to.be.undefined;
  });

  it(`can watch dynamic second tier property`, () => {
    let {Watcher} = new DeltaWatch<any>({});
    DeltaWatch.watch(Watcher.dynamicProp.child, () => {
    });
  });

  it(`can mutate dynamic first tier property`, () => {
    let {Mutator} = new DeltaWatch<any>({});
    Mutator.value = "Dynamic Value";
  });

  it(`can mutate dynamic second tier property`, () => {
    let {Mutator} = new DeltaWatch<any>({});
    Mutator.item.value = "Won't Set";
  });

  it(`can mutate dynamic second tier property after setting a dynamic first tier property to an object`, () => {
    let {Mutator} = new DeltaWatch<any>({});
    Mutator.item = {};
    Mutator.item.value = "Dynamic Value";
  });

  it(`mutating a first tier dynamic property calls callback`, () => {
    let {Watcher, Mutator} = new DeltaWatch<any>({});

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    Mutator.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });

  it(`mutating a second tier dynamic property calls callback`, () => {
    let {Watcher, Mutator} = new DeltaWatch<any>({});

    let watcherCalled = false;
    DeltaWatch.watch(Watcher.item.value, (value: string) => {
      expect(value).to.equal("New Value");
      watcherCalled = true;
    });

    Mutator.item.value = "New Value";

    assertWatcherCalled(watcherCalled);
  });
});