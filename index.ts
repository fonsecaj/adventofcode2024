const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();
const antennasMap = puzzleInput.split('\n').map(row => row.split(''));
const antennasMapRowCount = antennasMap.length;
const antennasMapColCount = antennasMap[0].length;
const antinodeMap = puzzleInput.replace(/[0-9a-zA-Z]/g, '.').split('\n').map(row => row.split(''));

type AntennaPosition = {
  x: number;
  y: number;
  value: string;
}

function writeAntinodes(antenna: string) {
  console.log(`Writing antinodes for ${antenna}...\n`);

  if (antenna.length > 1 || antenna === '.') return;

  const antennaPositions = antennasMap.reduce((acc, row, y) => {
    const antennaPosition = row.map((value, x) => {
      if (value === antenna) {
        return { x, y, value };
      }
    }).filter((value): value is AntennaPosition => value !== undefined);

    return [...acc, ...antennaPosition];
  }, [] as AntennaPosition[]);

  for (let i = 0; i < antennaPositions.length; i++) {
    const { x: ax1, y: ay1 } = antennaPositions[i];
    
    for (let j = i + 1; j < antennaPositions.length; j++) {
      const { x: ax2, y: ay2 } = antennaPositions[j];
      const axDiff = ax2 - ax1;
      const ayDiff = ay2 - ay1;

      const nx1 = ax1 + (axDiff * -1);
      const ny1 = ay1 + (ayDiff * -1);

      if (nx1 >= 0 && nx1 < antennasMapColCount && ny1 >= 0 && ny1 < antennasMapRowCount) {
        antinodeMap[ny1][nx1] = '#';
      }

      const nx2 = ax2 - (axDiff * -1);
      const ny2 = ay2 - (ayDiff * -1);

      if (nx2 >= 0 && nx2 < antennasMapColCount && ny2 >= 0 && ny2 < antennasMapRowCount) {
        antinodeMap[ny2][nx2] = '#';
      }
    }
  }
}

const scannedAntennas = new Set<string>();

for (let y = 0; y < antennasMapRowCount; y++) {
  for (let x = 0; x < antennasMapColCount; x++) {
    const antennaOrBlank = antennasMap[y][x];

    if (antennaOrBlank === '.' || scannedAntennas.has(antennaOrBlank)) continue;
    
    writeAntinodes(antennaOrBlank);
    scannedAntennas.add(antennaOrBlank);
  }
}

console.log(antennasMap.map(row => row.join('')).join('\n'));
console.log('\n')
console.log(antinodeMap.map(row => row.join('')).join('\n'));

const antinodeCount = antinodeMap.reduce((acc, row) => {
  return acc + row.filter(value => value === '#').length;
}, 0);

console.log(`\nAntinode count: ${antinodeCount}`); // 254