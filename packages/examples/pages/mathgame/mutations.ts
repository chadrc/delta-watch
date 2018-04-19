import {randomMathProblem, TimeToSolve} from "./utils";

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                mutator: any) => {
  let interval: number = null;

  const intervalCallback = () => {
    mutator.answerTimer = accessor.answerTimer - 1;
    if (accessor.answerTimer === 0) {
      clearInterval(interval);
      mutator.result = false;
    }
  };

  const startInterval = () => {
    interval = setInterval(intervalCallback, 1000)
  };

  elements.startSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (accessor.currentMathProblem === null) { // Starting
      mutator.currentMathProblem = randomMathProblem();
      mutator.answerTimer = TimeToSolve;
      startInterval();
    } else if (accessor.result === null) { // Submitting
      mutator.result = accessor.currentAnswer === accessor.currentMathProblem.solution;
      clearInterval(interval);
    } else { // Restarting
      mutator.currentMathProblem = randomMathProblem();
      mutator.result = null;
      mutator.answerTimer = TimeToSolve;
      startInterval();
    }
  });

  elements.answerInput.addEventListener('input', (event) => {
    let value = (event.target as HTMLInputElement).value;
    if (value.length > 3) {
      (elements.answerInput as HTMLInputElement).value = accessor.currentAnswer;
    } else {
      mutator.currentAnswer = (event.target as HTMLInputElement).valueAsNumber;
    }
  });
};