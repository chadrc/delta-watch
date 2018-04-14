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

  it(`Accessing an array's mutator methods throw errors`, () => {
    let watchable = new Watchable({
      list: ['one', 'two', 'three']
    });

    for (let m of arrayMutatorMethods) {
      let func = () => watchable.Accessor.list[m]();
      expect(func).to.throw();
    }
  })
});