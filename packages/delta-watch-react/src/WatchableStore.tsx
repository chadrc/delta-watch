import * as React from "react";
import 'jest';
import DeltaWatch from 'delta-watch';

jest.useFakeTimers();

export interface DeltaWatchStore {
  WatchStore: Function,
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
  let Watch = (
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
          let watchers = mapWatchers(watchable.Watcher, props);
          for (let field of Object.keys(watchers)) {
            DeltaWatch.Watch(watchers[field], this.update);
          }
          return watchers;
        }

        static getDerivedStateFromProps(nextProps: any) {
          // this.makeWatchers(nextProps);
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

  return {
    WatchStore: Watch,
    Store: watchable
  }
}

export default MakeStore;