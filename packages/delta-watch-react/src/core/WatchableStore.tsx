import * as React from "react";
import DeltaWatch from 'delta-watch';

export interface DeltaWatchStore<T> {
  WatchStore: Function,
  MakeWatcherScope: Function,
  Store: {
    Mutator: T,
    Accessor: T,
    Watcher: T
  }
}

interface WatchStoreHOCState {
  watchers: { [key: string]: any }
  updater: (value: any) => void
}

function MakeStore<T>(data: T): DeltaWatchStore<T> {
  let watchable = DeltaWatch.Watchable(data);
  let WatchStore = (
    mapWatchers: (watcher: T, props: any) => { [key: string]: any },
    mapStore?: (accessor: T, props: any) => { [key: string]: any }
  ) => {
    return (Target: any) => {
      let c: any = class extends React.Component<any, WatchStoreHOCState> {
        private updateTimeout: number;

        constructor(props: any) {
          super(props);
          this.state = {
            watchers: {},
            updater: this.update
          };
        }

        static getDerivedStateFromProps(nextProps: any, prevState: WatchStoreHOCState) {
          let watcher = watchable.Watcher;
          if (nextProps.watcherScope) {
            watcher = nextProps.watcherScope;
          }

          const updater = prevState.updater;
          let watchers = mapWatchers(watcher, nextProps);
          let state: WatchStoreHOCState = {
            watchers,
            updater: updater
          };
          let needsUpdate = false;

          // Add new and changed watchers to state
          for (let field of Object.keys(watchers)) {
            if (field in prevState.watchers) {
              if (watchers[field] !== prevState.watchers[field]) {
                // Same field different watcher

                // Remove old watcher
                DeltaWatch.Unwatch(prevState.watchers[field], updater);

                // Make new watcher
                DeltaWatch.Watch(watchers[field], updater);

                // Add to state
                state.watchers[field] = watchers[field];

                needsUpdate = true;
              } else {
                // Same watcher
                state.watchers[field] = watchers[field];
              }
            } else {
              // New watcher

              // Make new watcher
              DeltaWatch.Watch(watchers[field], updater);

              // Add to state
              state.watchers[field] = watchers[field];

              needsUpdate = true;
            }
          }

          // Remove any watcher not in state that's in prevState
          for (let field of Object.keys(prevState)) {
            if (!(field in state)) {
              // Remove old watcher
              DeltaWatch.Unwatch(prevState.watchers[field], updater);

              needsUpdate = true;
            }
          }

          return needsUpdate ? state : null;
        }

        update = () => {
          if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
          }

          this.updateTimeout = setTimeout(() => {
            this.forceUpdate();
          });
        };

        render() {
          let props: { [key: string]: any } = {...this.props};
          for (let field of Object.keys(this.state.watchers)) {
            props[field] = this.state.watchers[field]._data;
          }

          if (mapStore) {
            props = Object.assign(props, mapStore(watchable.Accessor, props));
          }

          return (
            <Target {...props} />
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