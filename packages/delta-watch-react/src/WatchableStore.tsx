import * as React from "react";

function MakeStore(data: any) {
  let Watch = () => {
    return (Target: any) => {
      let c: any = class extends React.Component {
        render() {
          return (
            <Target {...this.props} />
          )
        }
      };

      c.displayName = `Watcher(${Target.displayName || Target.name})`;

      return c;
    }
  };

  return {
    Watch
  }
}

export default MakeStore;