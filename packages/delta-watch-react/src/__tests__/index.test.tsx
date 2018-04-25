import 'jest';
import * as React from 'react';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';
import './setup'

describe(`Core`, () => {
  it(`Module loads`, () => {
    expect(DeltaWatchReact).toBeTruthy();
  });

  it(`MakeStore and Watch create a renderable component`, () => {
    let watchableStore = DeltaWatchReact.MakeStore({});
    let comp = () => <div/>;
    let Wrapped = watchableStore.Watch(() => ({}))(comp);
    renderer.create(<Wrapped/>);
  });
});