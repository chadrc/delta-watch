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

  it(`Accessing an array's mutator methods throw errors`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    for (let m of arrayMutatorMethods) {
      let func = () => watchable.Accessor.list[m]();
      expect(func).to.throw();
    }
  });

  it(`Assigning a new value to an array item throws an error`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });
    let func = () => watchable.Accessor.list[0] = "1";
    expect(func).to.throw();
  });
});