import advanceTimersByTime = jest.advanceTimersByTime;

export function flushTimers() {
  // Flush current frame of timeouts, happens automatically in browser
  advanceTimersByTime(0);
}