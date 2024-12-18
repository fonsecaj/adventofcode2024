const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();
const equationLines = puzzleInput.split('\n');

type Operator = '+' | '*' | '|';

function generateOperatorCombinations(operators: Operator[], length: number): Operator[][] {
  const combinationsCount = Math.pow(operators.length, length);

  return Array.from({ length: combinationsCount }, (_, i) => {
    return i
      .toString(operators.length)
      .padStart(length, '0')
      .split('')
      .map(digit => operators[Number(digit)]);
  });
}

function evaluateEquation(operators: Operator[], numbers: number[]): number {
  let result = numbers[0];
  
  for (let i = 1; i < numbers.length; i++) {
      const currentOperator = operators[i - 1];
      const currentNumber = numbers[i];
      
      switch (currentOperator) {
          case '+':
              result += currentNumber;
              break;
          case '|':
              result = Number(`${result}${currentNumber}`);
              break;
          case '*':
              result *= currentNumber;
              break;
      }
  }
  
  return result;
}

function sumValidEquations(operators: Operator[]): number {
  let totalSum = 0;

  for (let lineIndex = 0; lineIndex < equationLines.length; lineIndex++) {
    const [targetString, ...numberStrings] = equationLines[lineIndex].replace(':', '').split(' ');
    const targetResult = Number(targetString);
    const numbers = numberStrings.map(Number);

    const operatorCombinations = generateOperatorCombinations(operators, numbers.length - 1);

    for (const operatorCombination of operatorCombinations) {
      if (evaluateEquation(operatorCombination, numbers) === targetResult) {
          console.log(`[${lineIndex}/${equationLines.length}] ✅\n`);
          totalSum += targetResult;
          break;
      }
    }
  }

  return totalSum;
}

console.log(sumValidEquations(['+', '*', '|'])); // 426214131924213