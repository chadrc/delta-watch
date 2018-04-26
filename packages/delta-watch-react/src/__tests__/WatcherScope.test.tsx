import 'jest';
import * as React from 'react';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';
import './setup'
import {flushTimers} from "./utils";

describe(`WatcherScope`, () => {
  it(`WatchStore receives scope watcher instead of root`, () => {
    const {WatchStore, MakeWatcherScope, Store} = DeltaWatchReact.MakeStore({
      user: {
        name: "John Doe",
        email: "johndoe@example.com"
      }
    });

    const ChildComp = (props) => (
      <span>{props.name} - {props.email}</span>
    );

    const WatchingComp = WatchStore((watcher: any) => ({
      name: watcher.name,
      email: watcher.email
    }))(ChildComp);

    const {Scope, withScope} = MakeWatcherScope((watcher: any) => {
      return watcher.user;
    });
    const ScopedComp = withScope(WatchingComp);

    let Parent = () => (
      <Scope>
        <ScopedComp/>
      </Scope>
    );

    let component = renderer.create(<Parent/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    Store.Mutator.user = {
      name: "Jane Smith",
      email: "janesmith@example.com"
    };

    flushTimers();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});