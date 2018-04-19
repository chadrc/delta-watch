import {randomMathProblem} from "./utils";

export default (elements: { [key: string]: HTMLElement },
                accessor: any,
                mutator: any) => {

  elements.startSubmitBtn.addEventListener('click', () => {
    mutator.mathProblem = randomMathProblem();
    mutator.playing = true;
  });

  elements.answerInput.addEventListener('input', (event) => {
    let value = (event.target as HTMLInputElement).value;
    if (value.length > 3) {
      (elements.answerInput as HTMLInputElement).value = accessor.currentAnswer;
    } else {
      mutator.currentAnswer = value;
    }
  });
};