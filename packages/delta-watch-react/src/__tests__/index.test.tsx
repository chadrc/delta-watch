import 'jest';
import * as React from 'react';
import {expect} from 'chai';
import DeltaWatchReact from '../index';

describe(`Core`, () => {
  it(`Module loads`, () => {
    expect(DeltaWatchReact).to.exist;
  });

  it(`HOC creates component`, () => {
    let comp = () => <div/>;
    DeltaWatchReact.Watch()(comp);
  });
});