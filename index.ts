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
  
  let firstFreePosition = defragmented.findIndex(block => block === null);
  let currentPosition = defragmented.length - 1;
  
  while (defragmented[currentPosition] === null) {
    currentPosition--;
  }
  
  while (currentPosition > firstFreePosition) {
    switchPositions(defragmented, currentPosition, firstFreePosition);
    firstFreePosition = defragmented.indexOf(null);
    
    while (currentPosition > firstFreePosition && defragmented[currentPosition] === null) {
      currentPosition--;
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

console.log(calculateChecksum(defragmentedSystem)); // 6337367222422
