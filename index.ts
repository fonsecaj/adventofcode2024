const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

const charTable = puzzleInput.split("\n");

const xmasChunk = 'MAS';

function isXmas(wordBuilder: () => [string, string, string]) {
  try {
    const word = wordBuilder().join("");

    return word === xmasChunk || word === xmasChunk.split("").reverse().join("");
  } catch (e) {
    return false;
  }
}

function checkXmasDiagonally(column: number, row: number) {
  return isXmas(() => ([
    charTable[row - 1][column - 1],
    charTable[row][column],
    charTable[row + 1][column + 1]
  ]));
}

function checkXmasDiagonallyReverse(column: number, row: number) {
  return isXmas(() => ([
    charTable[row + 1][column - 1],
    charTable[row][column],
    charTable[row - 1][column + 1]
  ]));
}

const xmasCount = charTable.reduce((count, row, rowIndex) => {
  let matches = 0;
  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    if (row[columnIndex] === xmasChunk[1] && checkXmasDiagonally(columnIndex, rowIndex) && checkXmasDiagonallyReverse(columnIndex, rowIndex)) {
      matches++;
    }
  }

  return count + matches;
}, 0);

console.log(xmasCount); // 2005