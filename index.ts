const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

const lines = puzzleInput.split("\n");

const rules = lines.filter(line => line.includes("|")).map(rule => rule.split("|").map(Number)) as [number, number][];

const pageUpdates = lines.filter(line => line.length && !line.includes("|")).map(rule => rule.split(",").map(Number));

function includes<T>(array: T[], ...values: T[]): boolean {
  return values.every(value => array.includes(value));
}

function isBefore<T>(array: T[], a: T, b: T): boolean {
  return array.indexOf(a) < array.indexOf(b);
}

function getMiddleValue<T>(array: T[]): T {
  return array[Math.floor(array.length / 2)];
}

function isCorrectlyOrdered(pageNumbers: number[]): boolean {
  return rules.every(([a, b]) => includes(pageNumbers, a, b) ? isBefore(pageNumbers, a, b) : true);
}

const sum = pageUpdates.reduce((sum, pageNumbers) => {

  if (isCorrectlyOrdered(pageNumbers)) return sum;

  let pageNumbersToReorder = [...pageNumbers];

  while (isCorrectlyOrdered(pageNumbersToReorder) === false) {
    const invalidRule = rules.find(([a, b]) => includes(pageNumbersToReorder, a, b) && isBefore(pageNumbersToReorder, b, a));

    if (!invalidRule) break;

    const reorderedPageNumbers = [...pageNumbersToReorder];
    const [a, b] = invalidRule;
    const aIndex = pageNumbersToReorder.indexOf(a);
    const bIndex = pageNumbersToReorder.indexOf(b);

    reorderedPageNumbers[aIndex] = b;
    reorderedPageNumbers[bIndex] = a;

    pageNumbersToReorder = reorderedPageNumbers;
  }

  return sum + getMiddleValue(pageNumbersToReorder);
}, 0);

console.log(sum); // 4507