import {Watchable} from "../Watchable";
import {expect} from 'chai';
import 'jest';
import {arrayMutatorMethods} from "../ArrayMutator";

describe(`Accessors`, () => {
  it(`First tier property is accessible`, () => {
    let watchable = new Watchable({value: "Value"});
    expect(watchable.Accessor.value).to.equal("Value");
  });

  it(`Second tier property is accessible`, () => {
    let watchable = new Watchable({
      data: {
        value: "Value"
      }
    });
    expect(watchable.Accessor.data.value).to.equal("Value");
  });

  it(`Third tier property is accessible`, () => {
    let watchable = new Watchable({
      data: {
        obj: {
          value: "Value"
        }
      }
    });
    expect(watchable.Accessor.data.obj.value).to.equal("Value");
  });

  it(`Assigning to a value on the Accessor throws an error`, () => {
    let watchable = new Watchable({value: "Value"});
    let func = () => watchable.Accessor.value = "New Value";
    expect(func).to.throw();
  });

  it(`Calling push on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.push("four");
    expect(func).to.throw();
  });

  it(`Calling unshift on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.unsift("zero");
    expect(func).to.throw();
  });

  it(`Calling pop on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.pop();
    expect(func).to.throw();
  });

  it(`Calling shift on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.shift();
    expect(func).to.throw();
  });

  it(`Calling splice on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.splice(1, 1, "2", "3");
    expect(func).to.throw();
  });

  it(`Calling fill on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.fill("NaN");
    expect(func).to.throw();
  });

  it(`Calling sort on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.sort();
    expect(func).to.throw();
  });

  it(`Calling copyWithin on array Accessor throws error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.copyWithin(0, 1, 2);
    expect(func).to.throw();
  });

  it(`Assigning a new value to an array item throws an error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });
    let func = () => watchable.Accessor.list[0] = "1";
    expect(func).to.throw();
  });
});