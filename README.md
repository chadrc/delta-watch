# Delta Watch
Object watching utility for JavaScript

## Example
```typescript
import DeltaWatch from "delta-watch";

// Create watchable object with inital values
let watchable = DeltaWatch.Watchable({
    value: "Initial"
});

DeltaWatch.Watch(watchable.Watcher.value, (value: string) => {
    console.log("new value", value);
});

watchable.Mutator.value = "Changed"; // cb gets call with "Changed"

// May also access current value
console.log(watchable.Accessor);
// logs "Changed"
```

Starting the example app
```bash
cd packages/examples
npm install

npm run build
npm start

```