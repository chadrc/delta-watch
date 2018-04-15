import DeltaWatch from 'delta-watch';

window.addEventListener('load', () => {
  // Setup
  const clockDateElement = document.getElementById('clock-date');
  const clockTimeElement = document.getElementById('clock-time');
  const timeScaleInput = document.getElementById('timeScaleInput') as HTMLInputElement;
  const playPauseButton = document.getElementById('playPauseButton');
  const refreshButton = document.getElementById('refreshButton');

  const clockData = DeltaWatch.Watchable({
    time: new Date(),
    timeScale: 1,
    active: true
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

  DeltaWatch.Watch(Watcher.active, (value: boolean) => {
    let newText = "play_arrow";
    if (value) {
      newText = "pause";
    }
    playPauseButton.children.item(0).innerHTML = newText;
  });

  DeltaWatch.Watch(Watcher.timeScale, (value: number) => {
    timeScaleInput.value = value.toString();
  });

  // Mutate
  setInterval(() => {
    if (Accessor.active) {
      let date = Accessor.time;
      Mutator.time.setMilliseconds(date.getMilliseconds() + (Accessor.timeScale * 100));
    }
  }, 100);

  timeScaleInput.addEventListener('input', (event) => {
    Mutator.timeScale = (event.target as HTMLInputElement).valueAsNumber;
  });

  playPauseButton.addEventListener('click', () => {
    Mutator.active = !Accessor.active;
  });

  refreshButton.addEventListener('click', () => {
    Mutator.time = new Date();
    Mutator.timeScale = 1;
  });
});
