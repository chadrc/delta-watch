import 'jest';
import * as React from 'react';
import DeltaWatchReact from '../index';
import * as renderer from 'react-test-renderer';
import './setup'
import {flushTimers} from "./utils";

interface User {
  name: string;
  email: string;
}

describe(`WatcherScope`, () => {
  it(`WatchStore receives scope watcher instead of root`, () => {
    const {WatchStore, MakeWatcherScope, Store} = DeltaWatchReact.MakeStore({
      user: {
        name: "John Doe",
        email: "johndoe@example.com"
      }
    });

    // Make a scope to the user object
    let {Scope, withScope} = MakeWatcherScope((watcher: any) => watcher.user);

    // Component that will be rendered
    const ChildComp = (props) => (
      <span>{props.name} - {props.email}</span>
    );

    // Watch store, watcher will be the user watcher not the root store watcher
    const WatchingComp = WatchStore((watcher: User) => ({
      name: watcher.name,
      email: watcher.email
    }))(ChildComp);

    // Wrapper component to render with Scope context
    const ScopedComp = withScope(WatchingComp);

    // Make and test final rendering
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