const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();
const reports = puzzleInput.trim().split("\n").map(line => line.split(/\s+/).map(Number));

const computeStatus = (levels: number[], tolerateBadLevel = false): 'safeIncrease' | 'safeDecrease' | 'unsafe' => {
  let status: 'safeIncrease' | 'safeDecrease' | 'unsafe' | 'none' = 'none';

  for (let index = 0; index < levels.length - 1; index++) {
    const absoluteDiff = Math.abs(levels[index + 1] - levels[index]);
    const isSafeDiff = absoluteDiff <= 3 && absoluteDiff > 0;

    if (!isSafeDiff) {
      status = 'unsafe';
    }

    const nextStatus = levels[index + 1] > levels[index] ? 'safeIncrease' : 'safeDecrease';

    if (status === 'none') {
      status = nextStatus;
    } else if (status !== nextStatus) {
      status = 'unsafe';
    }

    if (status === 'unsafe') {
      if (tolerateBadLevel) {
        let removedLevelIndex = 0;
        while (removedLevelIndex < levels.length) {
          const newLevels = [...levels];
          newLevels.splice(removedLevelIndex, 1);

          status = computeStatus(newLevels);

          if (status !== 'unsafe') {
            break;
          }

          removedLevelIndex++;
        }
      }

      break;
    }
  }

  if (status === 'none') {
    throw new Error('Invalid status');
  }

  return status;
}

const safeReports = reports.filter((levels) => {
  let status: 'safeIncrease' | 'safeDecrease' | 'unsafe' | 'none' = 'none';

  status = computeStatus(levels, true);

  return status === 'safeIncrease' || status === 'safeDecrease';
});

console.log(safeReports.length); // 621