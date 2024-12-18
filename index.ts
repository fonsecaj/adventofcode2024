const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

type TrailLevel = 0|1|2|3|4|5|6|7|8|9;
type TrailMap = TrailLevel[][];

const trailMap = puzzleInput.split("\n").map((row) => row.trim().split("").map(Number)) as TrailMap;

let trailScore = 0;

console.log('\n\nStarting trail...\n');

for (let y = 0; y < trailMap.length; y++) {
  for (let x = 0; x < trailMap[y].length; x++) {
    trail([[x, y]], 0);
  }
}

function trail(path: [number, number][], expectedLevel: number): void {
  const [x, y] = path[path.length - 1];

  try {
    if (trailMap[y][x] !== expectedLevel) {
      return;
    } 
  } catch (e) {
    return;
  }
  
  if (expectedLevel === 9) {
    console.log(path.join(" ➡️ "), '🥾\n');
    trailScore++;
    return;
  }

  trail([...path, [x - 1, y]], expectedLevel + 1);
  trail([...path, [x + 1, y]], expectedLevel + 1);
  trail([...path, [x, y - 1]], expectedLevel + 1);
  trail([...path, [x, y + 1]], expectedLevel + 1);
}


console.log(trailScore); // 1045