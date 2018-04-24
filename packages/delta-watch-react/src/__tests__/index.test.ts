import 'jest';
import {expect} from 'chai';
import DeltaWatchReact from '../index';

describe(`Core`, () => {
  it(`Module loads`, () => {
    expect(DeltaWatchReact).to.exist;
  });
});