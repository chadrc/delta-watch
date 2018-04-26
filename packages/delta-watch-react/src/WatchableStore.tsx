import * as React from "react";
import 'jest';
import DeltaWatch from 'delta-watch';

jest.useFakeTimers();

export interface DeltaWatchStore {
  WatchStore: Function,
  MakeWatcherScope: Function,
  Store: {
    Mutator: any,
    Accessor: any,
    Watcher: any
  }
}

interface WatchStoreHOCState {
  [key: string]: any
}

function MakeStore(data: any): DeltaWatchStore {
  let watchable = DeltaWatch.Watchable(data);
  let WatchStore = (
    mapWatchers: (watcher: any, props: any) => { [key: string]: any },
    mapStore?: (accessor: any, props: any) => { [key: string]: any }
  ) => {
    return (Target: any) => {
      let c: any = class extends React.Component<any, WatchStoreHOCState> {
        private updateTimeout: number;

        constructor(props: any) {
          super(props);
          let watchers = this.makeWatchers(props);
          this.state = {
            ...watchers
          };
        }

        makeWatchers(props: any): { [key: string]: any } {
          let watcher = watchable.Watcher;
          if (this.props.watcherScope) {
            watcher = this.props.watcherScope;
          }

          let watchers = mapWatchers(watcher, props);
          for (let field of Object.keys(watchers)) {
            DeltaWatch.Watch(watchers[field], this.update);
          }
          return watchers;
        }

        // static getDerivedStateFromProps(nextProps: any) {
        //   // this.makeWatchers(nextProps);
        // }

        update = () => {
          if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
          }

          this.updateTimeout = setTimeout(() => {
            this.forceUpdate();
          });
        };

        render() {
          let watchProps: { [key: string]: any } = {};
          for (let field of Object.keys(this.state)) {
            watchProps[field] = this.state[field]._data;
          }

          let allProps = {
            ...this.props,
            ...watchProps
          };

          let storeProps = {};
          if (mapStore) {
            storeProps = mapStore(watchable.Accessor, allProps);
          }

          return (
            <Target {...allProps} {...storeProps} />
          )
        }
      };

      c.displayName = `Watcher(${Target.displayName || Target.name})`;

      return c;
    }
  };

  let MakeWatcherScope = (
    getScope: (watcher: any) => any
  ) => {
    let scope = getScope(watchable.Watcher);
    let Context: any = React.createContext<any>(scope);
    let withScope = (Target: any) => {
      let c: any = (props: any) => {
        return (
          <Context.Consumer>
            {(watcherScope: any) => {
              return <Target {...props} watcherScope={watcherScope}/>;
            }}
          </Context.Consumer>
        )
      };

      c.displayName = `WatcherScope(${Target.displayName || Target.name})`;
      return c;
    };

    let Scope = (props: any) => (
      <Context.Provider value={scope}>
        {props.children}
      </Context.Provider>
    );

    return {
      Scope,
      withScope
    };
  };

  return {
    WatchStore,
    MakeWatcherScope,
    Store: watchable
  }
}

export default MakeStore;