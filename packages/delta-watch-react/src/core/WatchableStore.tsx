import * as React from "react";
import DeltaWatch from 'delta-watch';

export type MapWatcherFunction<T, P> = (watcher: T, props: P) => { [key: string]: any };
export type MapStoreFunction<T, P> = (accessor: T, props: P) => { [key: string]: any };

export interface DeltaWatchStore<T, P> {
  WatchStore: (mapWatcher: MapWatcherFunction<T, P>, mapStore?: MapStoreFunction<T, P>) => any,
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

function MakeStore<T, P>(data: T): DeltaWatchStore<T, P> {
  let watchable = DeltaWatch.Watchable(data);
  let WatchStore = (
    mapWatchers: MapWatcherFunction<T, P>,
    mapStore?: MapStoreFunction<T, P>
  ) => {
    return (Target: any) => {
      let c: any = class extends React.Component<P, WatchStoreHOCState> {
        private updateTimeout: number;

        constructor(props: P) {
          super(props);
          this.state = {
            watchers: {},
            updater: this.update
          };
        }

        static getDerivedStateFromProps(nextProps: P, prevState: WatchStoreHOCState) {
          let watcher = watchable.Watcher;
          if ((nextProps as any).watcherScope) {
            watcher = (nextProps as any).watcherScope;
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
          let props: P = {...(this.props as any)};
          for (let field of Object.keys(this.state.watchers)) {
              (props as any)[field] = this.state.watchers[field]._data;
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
    getScope: (watcher: T) => any
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