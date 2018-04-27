import 'jest';
import * as React from 'react';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';
import './setup'
import {flushTimers} from "./utils";

describe(`WatchStore`, () => {
  it(`Mutating a watchable store causes a wrapped component to re-render`, () => {
    let {WatchStore, Store} = DeltaWatchReact.MakeStore({
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

    let Wrapped = WatchStore((watcher: any) => ({
      message: watcher.message
    }))(Text);

    let component = renderer.create(<Wrapped/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.message = "Delta Watch Render";

    flushTimers();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // 1 for initial render, 1 for re-render
    expect(renderCount).toEqual(2);
  });

  it(`Multiple mutations to store only cause one update`, () => {
    let {WatchStore, Store} = DeltaWatchReact.MakeStore({
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

    let Wrapped = WatchStore((watcher: any) => ({
      headline: watcher.headline,
      message: watcher.message
    }))(Text);

    let component = renderer.create(<Wrapped/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.headline = "Updated";
    Store.Mutator.message = "One Update";

    flushTimers();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // 1 for initial render, 1 for re-render
    expect(renderCount).toEqual(2);
  });

  it(`Providing a mapStore function transforms props`, () => {
    let {WatchStore, Store} = DeltaWatchReact.MakeStore({
      items: [
        'item one',
        'item two'
      ],
      selectedItem: 0
    });

    class Text extends React.Component<any, any> {
      render() {
        return (
          <div>
            <p>{this.props.selectedItem}</p>
          </div>
        );
      }
    }

    let Wrapped = WatchStore(
      (watcher: any) => ({
        selectedItem: watcher.selectedItem
      }),
      (accessor: any, props: any) => ({
        selectedItem: accessor.items[props.selectedItem]
      })
    )(Text);

    let component = renderer.create(<Wrapped/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.selectedItem = 1;

    flushTimers();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it(`Getting new props maps to different watch`, () => {
    let {WatchStore, Store} = DeltaWatchReact.MakeStore({
      items: [
        'item one',
        'item two'
      ],
      selectedItem: 0
    });

    const Child = (props) => <p>{props.item}</p>;

    const ChildWatcher = WatchStore((watcher: any, props: any) => ({
      item: watcher.items[props.itemIndex]
    }))(Child);

    const Parent = (props) => (
      <div>
        <ChildWatcher itemIndex={props.selectedItem}/>
      </div>
    );

    const ParentWatcher = WatchStore((watcher: any) => ({
      selectedItem: watcher.selectedItem
    }))(Parent);

    let component = renderer.create(<ParentWatcher/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.selectedItem = 1;

    flushTimers();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // items[0] should also have no watchers
    expect(Store.Watcher.items[0]._watcherOptions.length).toEqual(0);
  });
});