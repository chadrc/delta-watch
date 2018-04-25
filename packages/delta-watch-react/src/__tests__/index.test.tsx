import 'jest';
import * as React from 'react';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';
import advanceTimersByTime = jest.advanceTimersByTime;

jest.useFakeTimers();

describe(`Core`, () => {
  it(`Module loads`, () => {
    expect(DeltaWatchReact).not.toBeTruthy();
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
    expect(renderCount).toEqual(2);
  });

  it(`Multiple mutations to store only cause one update`, () => {
    let {Watch, Store} = DeltaWatchReact.MakeStore({
      headline: "Multiple Updates",
      message: "No Updates"
    });

    let renderCount = 0;
    class Text extends React.Component<any, any> {
      render() {
        renderCount++;
        return (
          <div>
            <h1>{this.props.headline}</h1>
            <p>{this.props.message}</p>
          </div>
        );
      }
    }

    let Wrapped = Watch((watcher: any) => ({
      headline: watcher.headline,
      message: watcher.message
    }))(Text);

    let component = renderer.create(<Wrapped/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.headline = "Updated";
    Store.Mutator.message = "One Update";

    // Flush current frame of timeouts, happens automatically in browser
    advanceTimersByTime(0);

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // First one will be canceled due to second
    expect(setTimeout).toHaveBeenCalledTimes(2);
    // 1 for initial render, 1 for re-render
    expect(renderCount).toEqual(2);
  });
});