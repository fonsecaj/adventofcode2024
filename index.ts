const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

const charTable = puzzleInput.split("\n");

const xmas = 'XMAS';

function isXmas(charLookupFn: (i: number) => string) {
  return Array.from({ length: xmas.length }, (_, i) => {
    try {
      return charLookupFn(i);
    } catch (e) {
      return '';
    }
  }).join("") === xmas;
}

function checkXmasTop(column: number, row: number) {
  return isXmas(i => charTable[row + i][column]);
}

function checkXmasBottom(column: number, row: number) {
  return isXmas(i => charTable[row - i][column]);
}

function checkXmasRight(column: number, row: number) {
  return isXmas(i => charTable[row][column + i]);
}

function checkXmasLeft(column: number, row: number) {
  return isXmas(i => charTable[row][column - i]);
}

function checkXmasBottomRight(column: number, row: number) {
  return isXmas(i => charTable[row + i][column + i]);
}

function checkXmasBottomLeft(column: number, row: number) {
  return isXmas(i => charTable[row + i][column - i]);
}

function checkXmasTopRight(column: number, row: number) {
  return isXmas(i => charTable[row - i][column + i]);
}

function checkXmasTopLeft(column: number, row: number) {
  return isXmas(i => charTable[row - i][column - i]);
}

const xmasCount = charTable.reduce((count, row, rowIndex) => {
  let matches = 0;
  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    if (row[columnIndex] === xmas[0]) {
      const checks = [
        checkXmasTop(columnIndex, rowIndex),
        checkXmasBottom(columnIndex, rowIndex),
        checkXmasRight(columnIndex, rowIndex),
        checkXmasLeft(columnIndex, rowIndex),
        checkXmasBottomRight(columnIndex, rowIndex),
        checkXmasBottomLeft(columnIndex, rowIndex),
        checkXmasTopRight(columnIndex, rowIndex),
        checkXmasTopLeft(columnIndex, rowIndex),
      ].filter(Boolean);

      matches += checks.length;
    }
  }

  return count + matches;
}, 0);

console.log(xmasCount); // 2639