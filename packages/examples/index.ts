import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import DeltaWatch from 'delta-watch';

window.addEventListener('load', () => {
  // Setup
  const clockDateElement = document.getElementById('clock-date');
  const clockTimeElement = document.getElementById('clock-time');
  let interval = null;

  const clockData = DeltaWatch.Watchable({
    time: new Date(),
    timeScale: 1,
    active: false
  });

  const {Accessor, Mutator, Watcher} = clockData;

  const setClockText = (date: Date) => {
    clockDateElement.innerHTML = date.toDateString();
    clockTimeElement.innerHTML = date.toTimeString().split(' ')[0];
  };

  setClockText(Accessor.time);

  // Watch
  DeltaWatch.Watch(Watcher.time, (value: Date) => {
    setClockText(value);
  });

  // Mutate
  interval = setInterval(() => {
    Mutator.time = new Date()
  }, 1000);
});
