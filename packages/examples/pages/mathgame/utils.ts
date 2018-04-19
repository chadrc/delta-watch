
export const TimeToSolve = 10; // seconds
export const MaxMultiplier = 5;

export enum Operation {
  Addition,
  Subtraction,
  Multiplication,
  Division
}

export interface MathProblem {
  operation: Operation
  leftOperand: number
  rightOperand: number
  solution: number
}

// for random rolling
const operations = [Operation.Addition, Operation.Subtraction, Operation.Multiplication, Operation.Division];

function randomOperation() {
  return operations[Math.floor(Math.random() * operations.length)];
}

// Addition and subtraction operands will be in range [1, 100]
// Multiplication and Division operands will be in range [1, 20]
const maxForOperation: {[key: string]: number} = {
  [Operation.Addition]: 101,
  [Operation.Subtraction]: 101,
  [Operation.Multiplication]: 21,
  [Operation.Division]: 21,
};

function randomForOperation(op: Operation): number {
  return Math.floor(Math.random() * maxForOperation[op]) + 1;
}

export function randomMathProblem(): MathProblem {
  let operation = randomOperation();
  let solution;

  let leftOperand = randomForOperation(operation);
  let rightOperand = randomForOperation(operation);

  if (operation === Operation.Addition || operation === Operation.Subtraction) {
    solution = leftOperand + rightOperand;
  } else {
    solution = leftOperand * rightOperand;
  }

  if (operation === Operation.Subtraction || operation === Operation.Multiplication) {
    // To make easy subtraction and division problems, we'll just swap the left operand and solution
    let temp = leftOperand;
    leftOperand = solution;
    solution = temp;
  }

  return {
    operation,
    leftOperand,
    rightOperand,
    solution
  }
}