const file = Bun.file("puzzle-input.txt");
const corruptedMemory = await file.text();

const mulRegex = /(do|don't)\(\)|mul\((\d{1,3}),(\d{1,3})\)/gm;

let result;
let sum = 0;
let ignore = false;

while ((result = mulRegex.exec(corruptedMemory)) !== null) {
  const [_, instruction, a, b] = result;

  if (instruction) {
    ignore = instruction === "don't";
    continue;
  }

  if (!ignore) {
    sum = sum + (parseInt(a) * parseInt(b));
  }
}

console.log(sum); // 103811193