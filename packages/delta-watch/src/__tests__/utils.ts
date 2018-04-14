import {assert} from "chai";

export function assertWatcherCalled(pass: boolean) {
  assert(pass, "Expected watcher to be called, but was not.");
}

export function assertWatcherNotCalled(pass: boolean) {
  assert(!pass, "Expected watcher to not be called, but was.");
}