const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

let stoneMarks: (number | number[])[] = puzzleInput.split(' ').map(Number);

function changeStone(stoneIndex: number) {
  const stoneMark = stoneMarks[stoneIndex] as number;

  switch (true) {
    case stoneMark === 0:
      stoneMarks[stoneIndex] = 1;
      break;

    case stoneMark.toString().length % 2 === 0:
      let [firstHalf, secondHalf] = [stoneMark.toString().substring(0, stoneMark.toString().length / 2), stoneMark.toString().substring(stoneMark.toString().length / 2)];

      while (secondHalf[0] === '0') {
        secondHalf = secondHalf.substring(1);
      }

      stoneMarks[stoneIndex] = [Number(firstHalf), Number(secondHalf)];
      break;
  
    default:
      stoneMarks[stoneIndex] = stoneMark * 2024;
      break;
  }
}

function blink() {
  for (let i = 0; i < stoneMarks.length; i++) {
    changeStone(i);
  }

  stoneMarks = stoneMarks.flat();
}

for (let i = 0; i < 25; i++) {
  blink();
}

console.log(stoneMarks.length); // 193899