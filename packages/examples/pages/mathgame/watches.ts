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

  DeltaWatch.Watch(watcher.mathProblem, (problem: MathProblem) => {
    if (problem) {
      elements.pendingTextRow.classList.add('hide');
      elements.mathProblemRow.classList.remove('hide');
      elements.mathProblemText.innerHTML = `${problem.leftOperand} ${symbolForOperation[problem.operation]} ${problem.rightOperand}`;
      elements.startSubmitBtn.innerHTML = "Submit";
      elements.startSubmitBtn.setAttribute('disabled', '');
    }
  });

  DeltaWatch.Watch(watcher.currentAnswer, (answer: string) => {
    if (answer.length > 0) {
      elements.startSubmitBtn.removeAttribute('disabled');
    } else {
      elements.startSubmitBtn.setAttribute('disabled', '');
    }
  });
};