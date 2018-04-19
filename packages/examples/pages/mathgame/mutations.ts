import {randomMathProblem} from "./utils";

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                mutator: any) => {

  elements.startSubmitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (accessor.currentMathProblem === null) { // Starting
      mutator.currentMathProblem = randomMathProblem();
      mutator.playing = true;
    } else if (accessor.result === null) { // Submitting
      mutator.result = accessor.currentAnswer === accessor.currentMathProblem.solution;
    } else { // Restarting
      mutator.currentMathProblem = randomMathProblem();
      mutator.result = null;
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