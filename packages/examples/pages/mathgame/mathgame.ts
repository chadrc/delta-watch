import DeltaWatch from 'delta-watch';
import setupWatches from './watches';
import setupMutations from './mutations';

window.addEventListener('load', () => {

  const mathGameData = DeltaWatch.Watchable({
    currentMathProblem: null,
    currentAnswer: '',
    result: null,
    answerTimer: 0,
    points: 0,
    multiplier: 1,
    streak: 0
  });

  const elements = {
    timerText: document.getElementById('timerText'),
    pointsText: document.getElementById('pointsText'),
    multiplierText: document.getElementById('multiplierText'),
    pendingTextRow: document.getElementById('pendingTextRow'),
    mathProblemRow: document.getElementById('mathProblemRow'),
    mathProblemText: document.getElementById('mathProblemText'),
    answerInput: document.getElementById('answerInput'),
    startSubmitBtn: document.getElementById('startSubmitBtn'),
    resultText: document.getElementById('resultText'),
    resultPanel: document.getElementById('resultPanel'),
  };

  setupWatches(elements, mathGameData.Accessor, mathGameData.Watcher);
  setupMutations(elements, mathGameData.Accessor, mathGameData.Mutator);
});