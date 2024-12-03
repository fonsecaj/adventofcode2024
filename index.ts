const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();
const values = puzzleInput.trim().split(/\s+/);

const [columnLeft, columnRight] = values
  .reduce<[string[], string[]]>(
    ([leftArr, rightArr], value, index) => {
      if (index % 2 === 0) {
        leftArr.push(value);
      } else {
        rightArr.push(value);
      }
      return [leftArr, rightArr];
    },
    [[], []]
  )
  .map(column => column.sort().map(Number));

const totalDistance = columnLeft.reduce((total, leftValue, i) => {
  return total + Math.abs(leftValue - columnRight[i]);
}, 0);

console.log(totalDistance); // 1319616

const similarityScore = columnLeft.reduce((total, leftValue, i) => {
  let cursor = i;
  let multiplicator = 0;
  const firstObservedValue = columnRight[i];

  if (firstObservedValue > leftValue) {
    while(columnRight[cursor] !== undefined && columnRight[cursor] >= leftValue) {
      if (columnRight[cursor] === leftValue) {
        multiplicator++;
      }
      cursor--;
    }
  } else {
    if (firstObservedValue === leftValue) {
      // Adjust the cursor to the lowest index of the same value
      while(columnRight[cursor] !== undefined && columnRight[cursor] === leftValue) {
        cursor--;
      }
    }

    while(columnRight[cursor] !== undefined && columnRight[cursor] <= leftValue) {
      if (columnRight[cursor] === leftValue) {
        multiplicator++;
      }
      cursor++;
    }
  }

  return total + (leftValue * multiplicator);
}, 0);

console.log(similarityScore); // 27267728