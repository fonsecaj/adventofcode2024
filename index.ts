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

const sum = pageUpdates.reduce((sum, pageNumber) => {
  const isCorrectlyOrdered = rules.every(([a, b]) => includes(pageNumber, a, b) ? isBefore(pageNumber, a, b) : true);

  return isCorrectlyOrdered ? sum + getMiddleValue(pageNumber) : sum;
}, 0);

console.log(sum); // 5248