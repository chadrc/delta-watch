import {DeltaWatch} from '../core/DeltaWatch';
import {expect} from 'chai';
import 'jest';

describe(`Accessors`, () => {
  it(`First tier property is accessible`, () => {
    let watchable = new DeltaWatch({value: 'Value'});
    expect(watchable.Accessor.value).to.equal('Value');
  });

  it(`Second tier property is accessible`, () => {
    let watchable = new DeltaWatch({
      data: {
        value: 'Value'
      }
    });
    expect(watchable.Accessor.data.value).to.equal('Value');
  });

  it(`Third tier property is accessible`, () => {
    let watchable = new DeltaWatch({
      data: {
        obj: {
          value: 'Value'
        }
      }
    });
    expect(watchable.Accessor.data.obj.value).to.equal('Value');
  });

  it(`Access a null value returns a null value`, () => {
    let watchable = new DeltaWatch({
      data: null
    });

    expect(watchable.Accessor.data).to.be.null;
  });

  it(`Assigning to a value on the Accessor throws an error`, () => {
    let watchable = new DeltaWatch({value: 'Value'});
    let func = () => watchable.Accessor.value = 'New Value';
    expect(func).to.throw();
  });

  /**
   * Array mutation not possible through accessor tests
   */

  it(`Calling push on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.push('four');
    expect(func).to.throw();
  });

  it(`Calling unshift on array Accessor throws error`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.unsift('zero');
    expect(func).to.throw();
  });

  it(`Calling pop on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.pop();
    expect(func).to.throw();
  });

  it(`Calling shift on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.shift();
    expect(func).to.throw();
  });

  it(`Calling splice on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.splice(1, 1, '2', '3');
    expect(func).to.throw();
  });

  it(`Calling fill on array Accessor throws error`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.fill('NaN');
    expect(func).to.throw();
  });

  it(`Calling sort on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.sort();
    expect(func).to.throw();
  });

  it(`Calling copyWithin on array Accessor throws error`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.copyWithin(0, 1, 2);
    expect(func).to.throw();
  });

  it(`Calling reverse on array Accessor throws error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let func = () => watchable.Accessor.list.reverse();
    expect(func).to.throw();
  });

  it(`Assigning a new value to an array item throws an error`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });
    let func = () => watchable.Accessor.list[0] = '1';
    expect(func).to.throw();
  });

  /**
   * Non Mutator method testing
   */

  it(`Calling concat works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });
    
    let concatenated = watchable.Accessor.list.concat('four', 'five', 'six');
    
    expect(concatenated).to.deep.equal(['one', 'two', 'three', 'four', 'five', 'six']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling entries works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let entries = watchable.Accessor.list.entries();

    expect(entries.next().value).to.deep.equal([0, 'one']);
    expect(entries.next().value).to.deep.equal([1, 'two']);
    expect(entries.next().value).to.deep.equal([2, 'three']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling every works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let every = watchable.Accessor.list.every((item: string) => item[0] === 't');

    expect(every).to.deep.equal(false);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling filter works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let filtered = watchable.Accessor.list.filter((item: string) => item.length === 3);

    expect(filtered).to.deep.equal(['one', 'two']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling find works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let found = watchable.Accessor.list.find((item: string) => item === 'one');

    expect(found).to.equal('one');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling findIndex works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let found = watchable.Accessor.list.findIndex((item: string) => item === 'three');

    expect(found).to.equal(2);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling forEach works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let modified: string[] = [];
    watchable.Accessor.list.forEach((item: string) => modified.push(item + "modified"));

    expect(modified).to.deep.equal(['onemodified', 'twomodified', 'threemodified']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling includes works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let includesTwo = watchable.Accessor.list.includes('two');

    expect(includesTwo).to.equal(true);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling indexOf works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let indexOfTwo = watchable.Accessor.list.indexOf('two');

    expect(indexOfTwo).to.equal(1);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling join works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let joined = watchable.Accessor.list.join(',');

    expect(joined).to.equal('one,two,three');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling keys works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch<any>({
      list: ['one', 'two', 'three']
    });

    let keys = watchable.Accessor.list.keys();

    expect(keys.next().value).to.equal(0);
    expect(keys.next().value).to.equal(1);
    expect(keys.next().value).to.equal(2);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling lastIndexOf works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let lastIndexOfTwo = watchable.Accessor.list.lastIndexOf('two');

    expect(lastIndexOfTwo).to.equal(1);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling map works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let mapped = watchable.Accessor.list.map((item: string) => item + "mapped");

    expect(mapped).to.deep.equal(['onemapped', 'twomapped', 'threemapped']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling reduce works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let reduced = watchable.Accessor.list.reduce((result: any, item: string) => {
      return result + item;
    }, "");

    expect(reduced).to.equal('onetwothree');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling reduceRight works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let reduced = watchable.Accessor.list.reduceRight((result: any, item: string) => {
      return result + item;
    }, "");

    expect(reduced).to.equal('threetwoone');
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling slice works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let sliced = watchable.Accessor.list.slice(0, 2);

    expect(sliced).to.deep.equal(['one', 'two']);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  it(`Calling some works normally leaves array value unmodified`, () => {
    let watchable = new DeltaWatch({
      list: ['one', 'two', 'three']
    });

    let someBeginWithO = watchable.Accessor.list.some((item: string) => item[0] === 'o');

    expect(someBeginWithO).to.equal(true);
    expect(watchable.Accessor.list).to.deep.equal(['one', 'two', 'three']);
  });

  // it(`Calling toLocaleString works normally leaves array value unmodified`, () => {
  //   let date = new Date('21 Dec 1997 14:12:00 UTC');
  //   let watchable = new DeltaWatch({
  //     list: ['one', 'two', date]
  //   });
  //
  //   let locale = watchable.Accessor.list.toLocaleString();
  //
  //   expect(locale).to.equal("one,two,1997-12-21 09:12:00");
  //   expect(watchable.Accessor.list).to.deep.equal(['one', 'two', date]);
  // });
});