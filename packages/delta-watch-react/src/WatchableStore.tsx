import * as React from "react";
import 'jest';
import DeltaWatch from 'delta-watch';

jest.useFakeTimers();

export interface DeltaWatchStore {
  Watch: Function,
  Store: {
    Mutator: any,
    Accessor: any,
    Watcher: any
  }
}

function MakeStore(data: any): DeltaWatchStore {
  let watchable = DeltaWatch.Watchable(data);
  let Watch = (
    mapWatchers: (watcher: any, props: any) => { [key: string]: any },
    mapStore?: (accessor: any, props: any) => { [key: string]: any }
  ) => {
    return (Target: any) => {
      let c: any = class extends React.Component<any> {
        private watchers: { [key: string]: any };
        private updateTimeout: number;

        constructor(props: any) {
          super(props);
          this.makeWatchers(props);
        }

        makeWatchers(props: any) {
          this.watchers = mapWatchers(watchable.Watcher, props);
          for (let field of Object.keys(this.watchers)) {
            DeltaWatch.Watch(this.watchers[field], this.update);
          }
        }

        componentWillReceiveProps(nextProps: any) {
          this.makeWatchers(nextProps);
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
          for (let field of Object.keys(this.watchers)) {
            watchProps[field] = this.watchers[field]._data;
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
    Watch,
    Store: watchable
  }
}

export default MakeStore;