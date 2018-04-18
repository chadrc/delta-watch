import DeltaWatch from 'delta-watch';
import setupWatches from './watches';
import setupMutations from './mutations';

window.addEventListener('load', () => {

  let mathGameData = DeltaWatch.Watchable({

  });

  let elements = {

  };

  setupWatches(elements, mathGameData.Accessor, mathGameData.Watcher);
  setupMutations(elements, mathGameData.Accessor, mathGameData.Mutator);
});