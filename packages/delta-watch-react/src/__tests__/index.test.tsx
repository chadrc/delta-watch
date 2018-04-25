import 'jest';
import * as React from 'react';
import {expect as chaiExpect} from 'chai';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';

describe(`Core`, () => {
  it(`Module loads`, () => {
    chaiExpect(DeltaWatchReact).to.exist;
  });

  it(`MakeStore and Watch create a renderable component`, () => {
    let watchableStore = DeltaWatchReact.MakeStore({});
    let comp = () => <div/>;
    let Wrapped = watchableStore.Watch()(comp);
    renderer.create(<Wrapped/>);
  });

  it(`Mutating a watchable store causes a wrapped component to re-render`, () => {
    let {Watch, Store} = DeltaWatchReact.MakeStore({
      message: "Hello"
    });

    let renderCount = 0;
    class Text extends React.Component<any, any> {
      render() {
        renderCount++;
        return (
          <p>{this.props.message}</p>
        );
      }
    }

    let Wrapped = Watch((watcher: any) => ({
      message: watcher.message
    }))(Text);

    let component = renderer.create(<Wrapped/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.message = "Delta Watch Render";

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // 1 for initial render, 1 for re-render
    chaiExpect(renderCount).to.equal(2);
  });
});