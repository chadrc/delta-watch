import DeltaWatch from "delta-watch";
import {MathProblem, Operation} from "./utils";

const symbolForOperation = {
  [Operation.Addition]: '+',
  [Operation.Subtraction]: '-',
  [Operation.Multiplication]: '&times;',
  [Operation.Division]: '&divide;',
};

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                watcher: any) => {

  DeltaWatch.Watch(watcher.currentMathProblem, (problem: MathProblem) => {
    if (problem) {
      elements.pendingTextRow.classList.add('hide');
      elements.mathProblemRow.classList.remove('hide');
      elements.mathProblemText.innerHTML = `${problem.leftOperand} ${symbolForOperation[problem.operation]} ${problem.rightOperand}`;
      elements.startSubmitBtn.innerHTML = "Submit";
      elements.startSubmitBtn.setAttribute('disabled', '');
      elements.answerInput.removeAttribute('disabled');
      (elements.answerInput as HTMLInputElement).value = '';
    }
  });

  DeltaWatch.Watch(watcher.currentAnswer, (answer: number) => {
    if (answer || answer === 0) {
      elements.startSubmitBtn.removeAttribute('disabled');
    } else {
      elements.startSubmitBtn.setAttribute('disabled', '');
    }
  });

  DeltaWatch.Watch(watcher.result, (result: boolean) => {
    if (result === null) {
      elements.resultPanel.classList.add('hide');
      elements.resultText.innerHTML = '';
    } else {
      elements.answerInput.setAttribute('disabled', '');
      elements.resultPanel.classList.remove('hide');
      elements.startSubmitBtn.removeAttribute('disabled'); // in case there was no input
      elements.startSubmitBtn.innerHTML = "Next";

      if (result === true) {
        elements.resultPanel.classList.remove('red');
        elements.resultPanel.classList.add('green', 'lighten-3');
        elements.resultText.innerHTML = `Correct!`;
      } else {
        elements.resultPanel.classList.remove('green');
        elements.resultPanel.classList.add('red', 'lighten-3');
        elements.resultText.innerHTML = `${accessor.answerTimer === 0 ? "Out of Time" : "Incorrect"}. The answer is ${accessor.currentMathProblem.solution}`;
      }
    }
  });

  DeltaWatch.Watch(watcher.answerTimer, (time: number) => {
    elements.timerText.innerHTML = time.toString();
  });

  DeltaWatch.Watch(watcher.points, (points: number) => {
    elements.pointsText.innerHTML = points.toString();
  });

  DeltaWatch.Watch(watcher.multiplier, (multiplier: number) => {
    elements.multiplierText.innerHTML = `x${multiplier}`;
  });
};