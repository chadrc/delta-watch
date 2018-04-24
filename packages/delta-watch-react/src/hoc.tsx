import * as React from "react";

function watch() {
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
}

export default watch;