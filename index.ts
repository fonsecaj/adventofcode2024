import type { BunFile } from "bun";

class StoneStorage {
  protected readonly storage: Map<number, number> = new Map();

  add(stone: number, count: number): void {
    const storedStones = this.storage.get(stone);
    if (storedStones) {
      this.storage.set(stone, storedStones + count);
    } else {
      this.storage.set(stone, count);
    }
  }


  stones(): Iterable<[number, number]> {
    return this.storage.entries();
  }

  size(): number {
    let size = 0;
    
    for (const count of this.storage.values()) {
      size += count;
    }

    return size;
  }
}

class MutableStoneStorage extends StoneStorage {
  static async fromFile(file: BunFile): Promise<MutableStoneStorage> {
    const stoneStorage = new MutableStoneStorage();
    const stones = (await file.text()).split(' ').map(Number);
    
    for (const stone of stones) {
      stoneStorage.add(stone, 1);
    }
    
    return stoneStorage;
  }

  mutate(): void {
    const nextStoneStorage = new StoneStorage();
  
    for (const [stone, count] of stoneStorage.stones()) {
      const stoneString = stone.toString();
  
      switch (true) {
        case stone === 0:
          nextStoneStorage.add(1, count);
          break;
  
        case stoneString.length % 2 === 0:
          const [firstHalf, secondHalf] = [
            stoneString.substring(0, stoneString.length / 2),
            stoneString.substring(stoneString.length / 2)
          ];
    
          nextStoneStorage.add(Number(firstHalf), count);
          nextStoneStorage.add(Number(secondHalf), count);
          break;
  
        default:
          nextStoneStorage.add(stone * 2024, count);
          break;
      }
    }
  
    this.storage.clear();
    for (const [stone, count] of nextStoneStorage.stones()) {
      this.storage.set(Number(stone), count);
    }
  }

  mutateMany(times: number): void {
    for (const _ of Array(times).keys()) {
      this.mutate();
    }
  }
}

const stoneStorage = await MutableStoneStorage.fromFile(Bun.file("./puzzle-input.txt"));

stoneStorage.mutateMany(75);

console.log(stoneStorage.size()); // 229682160383225
