import 'jest';
import * as React from 'react';
import {expect} from 'chai';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';

describe(`Core`, () => {
  it(`Module loads`, () => {
    expect(DeltaWatchReact).to.exist;
  });

  it(`MakeStore and Watch create a renderable component`, () => {
    let watchableStore = DeltaWatchReact.MakeStore({});
    let comp = () => <div/>;
    let Wrapped = watchableStore.Watch()(comp);
    renderer.create(<Wrapped/>);
  });
});