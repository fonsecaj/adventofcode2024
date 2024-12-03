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
  .map(column => column.sort());

const totalDistance = columnLeft.reduce((total, leftValue, i) => {
  return total + Math.abs(Number(leftValue) - Number(columnRight[i]));
}, 0);

console.log(totalDistance); // 1319616
