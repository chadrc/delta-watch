import DeltaWatch from 'delta-watch';
import setupWatches from './watches';
import setupMutations from './mutations';

window.addEventListener('load', () => {

  const mathGameData = DeltaWatch.Watchable({
    playing: false,
    currentMathProblem: null,
    currentAnswer: '',
    result: null
  });

  const elements = {
    timerText: document.getElementById('timerText'),
    pendingTextRow: document.getElementById('pendingTextRow'),
    mathProblemRow: document.getElementById('mathProblemRow'),
    mathProblemText: document.getElementById('mathProblemText'),
    answerInput: document.getElementById('answerInput'),
    startSubmitBtn: document.getElementById('startSubmitBtn'),
    resultText: document.getElementById('resultText'),
    resultPanel: document.getElementById('resultPanel')
  };

  setupWatches(elements, mathGameData.Accessor, mathGameData.Watcher);
  setupMutations(elements, mathGameData.Accessor, mathGameData.Mutator);
});