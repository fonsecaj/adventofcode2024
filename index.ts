const file = Bun.file("puzzle-input.txt");
const corruptedMemory = await file.text();

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/gm;

let result;
let sum = 0;

while ((result = mulRegex.exec(corruptedMemory)) !== null) {
  const [_, a, b] = result;
  sum = sum + (parseInt(a) * parseInt(b));
}

console.log(sum); // 179571322