const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

type FileBlock = number | null;

function createFileSystem(diskMap: string): FileBlock[] {
  const blocks: FileBlock[] = [];
  let isFileSection = true;
  let fileId = 0;
    
  const sections = diskMap.trim().split('').map(Number);
  
  for (const sectionSize of sections) {
    if (isFileSection) {
      blocks.push(...Array(sectionSize).fill(fileId));
      fileId++;
    } else {
      blocks.push(...Array(sectionSize).fill(null));
    }
    isFileSection = !isFileSection;
  }
  
  return blocks;
}

function switchPositions(fileSystem: FileBlock[], positionA: number, positionB: number): void {
  const temp = fileSystem[positionA];
  fileSystem[positionA] = fileSystem[positionB];
  fileSystem[positionB] = temp;
}

function defragmentFileSystem(fileSystem: FileBlock[]): FileBlock[] {
  const defragmented = [...fileSystem];
  
  let firstFreePositionStart = defragmented.findIndex(block => block === null);
  let firstFreePositionEnd = firstFreePositionStart;

  while (defragmented[firstFreePositionEnd] === null) {
    firstFreePositionEnd++;
  }

  let currentPositionEnd = defragmented.length - 1;
  
  while (defragmented[currentPositionEnd] === null) {
    currentPositionEnd--;
  }

  let currentPositionStart = currentPositionEnd;

  while (defragmented[currentPositionStart - 1] === defragmented[currentPositionEnd]) {
    currentPositionStart--;
  }

  let currentFileId = defragmented[currentPositionStart];
  
  while (currentFileId) {
    let switched = false;

    while(firstFreePositionStart < currentPositionStart && !switched) {
      if (firstFreePositionEnd - firstFreePositionStart >= currentPositionEnd - currentPositionStart) {
        for (let i = 0; i <= currentPositionEnd - currentPositionStart; i++) {
          switchPositions(defragmented, currentPositionStart + i, firstFreePositionStart + i);
        }
  
        firstFreePositionStart = defragmented.findIndex(block => block === null);
        firstFreePositionEnd = firstFreePositionStart;
    
        while (defragmented[firstFreePositionEnd] === null) {
          firstFreePositionEnd++;
        }
  
        currentPositionEnd = defragmented.length - 1;
  
        while (defragmented[currentPositionEnd] === null) {
          currentPositionEnd--;
        }
  
        currentPositionStart = currentPositionEnd;
  
        while (defragmented[currentPositionStart - 1] === defragmented[currentPositionEnd]) {
          currentPositionStart--;
        }
  
        switched = true;
      } else {
        firstFreePositionStart = firstFreePositionEnd + 1;

        while (defragmented[firstFreePositionStart] !== null && firstFreePositionStart < defragmented.length) {
          firstFreePositionStart++;
        }

        firstFreePositionEnd = firstFreePositionStart;

        while (defragmented[firstFreePositionEnd + 1] === null) {
          firstFreePositionEnd++;
        }
      }
    }

    firstFreePositionStart = defragmented.findIndex(block => block === null);
    firstFreePositionEnd = firstFreePositionStart;

    while (defragmented[firstFreePositionEnd + 1] === null) {
      firstFreePositionEnd++;
    }

    currentFileId = currentFileId ? currentFileId - 1 : 0;

    currentPositionEnd = defragmented.length - 1;

    while (defragmented[currentPositionEnd] !== currentFileId) {
      currentPositionEnd--;
    }

    currentPositionStart = currentPositionEnd;

    while (defragmented[currentPositionStart - 1] === currentFileId) {
      currentPositionStart--;
    }
  }
  
  return defragmented;
}

function calculateChecksum(fileSystem: FileBlock[]): number {
  return fileSystem.reduce((sum, block, position) => {
    if (block !== null) {
      return sum! + (position * block);
    }
    return sum ?? 0;
  }, 0) as number;
}

const fileSystem = createFileSystem(puzzleInput);
const defragmentedSystem = defragmentFileSystem(fileSystem);

console.log(calculateChecksum(defragmentedSystem)); // 6361380647183
