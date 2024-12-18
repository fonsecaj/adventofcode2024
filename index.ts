const file = Bun.file("puzzle-input.txt");
const puzzleInput = await file.text();

enum TileType {
  Blank = ".",
  VisitedByGuard = "X",
  Obstacle = "#",
  GuardLookingUp = "^",
  GuardLookingDown = "v",
  GuardLookingLeft = "<",
  GuardLookingRight = ">",
}

const GUARD_TILE_TYPES = new Set([
  TileType.GuardLookingDown,
  TileType.GuardLookingLeft,
  TileType.GuardLookingRight,
  TileType.GuardLookingUp,
]);

type Tile = {
  type: TileType;
  x: number;
  y: number;
}

type TileRow = TileType[];

type TileMap = TileRow[];

type GuardTile = Tile & {
  type: TileType.GuardLookingDown | TileType.GuardLookingLeft | TileType.GuardLookingRight | TileType.GuardLookingUp;
}

type StateKey = `${number},${number},${string}`;

const tileMapRows = puzzleInput.split("\n").map(row => row.split("")) as TileMap;
const tileRowCount = tileMapRows.length;
const tileByRowCount = tileMapRows[0].length;

function getTile(map: TileMap, x: number, y: number): Tile | null {
  if (x < 0 || y < 0 || x >= tileByRowCount || y >= tileRowCount) {
    return null;
  }

  return {
    type: map[y][x],
    x,
    y,
  };
}

function isGuardTile(tile: Tile | null): tile is GuardTile {
  return tile !== null && GUARD_TILE_TYPES.has(tile.type);
}

function findGuardTile(map: TileMap): GuardTile {
  for (let y = 0; y < tileRowCount; y++) {
    for (let x = 0; x < tileByRowCount; x++) {
      const tile = getTile(map, x, y);

      if (isGuardTile(tile)) {
        return tile;
      }
    }
  }

  throw new Error("Guard not found");
}

function getNextGuardTileType(type: GuardTile["type"]): GuardTile["type"] {
  switch (type) {
    case TileType.GuardLookingDown:
      return TileType.GuardLookingLeft;
    case TileType.GuardLookingLeft:
      return TileType.GuardLookingUp;
    case TileType.GuardLookingRight:
      return TileType.GuardLookingDown;
    case TileType.GuardLookingUp:
      return TileType.GuardLookingRight;
  }
}

function moveGuard(map: TileMap): boolean {
  const visited = new Set<StateKey>();
  let currentGuardTile: GuardTile = findGuardTile(map);

  while (true) {
    const stateKey: StateKey = `${currentGuardTile.x},${currentGuardTile.y},${currentGuardTile.type}`;
    if (visited.has(stateKey)) {
      return true; // Loop detected
    }
    visited.add(stateKey);

    let nextX = currentGuardTile.x;
    let nextY = currentGuardTile.y;

    switch (currentGuardTile.type) {
      case TileType.GuardLookingDown: nextY++; break;
      case TileType.GuardLookingLeft: nextX--; break;
      case TileType.GuardLookingRight: nextX++; break;
      case TileType.GuardLookingUp: nextY--; break;
    }

    if (nextX < 0 || nextY < 0 || nextX >= tileByRowCount || nextY >= tileRowCount) {
      return false; // Guard is out of bounds
    }

    const nextTile = map[nextY][nextX];
    if (nextTile === TileType.Obstacle) {
      currentGuardTile.type = getNextGuardTileType(currentGuardTile.type);
    } else {
      currentGuardTile.x = nextX;
      currentGuardTile.y = nextY;
    }
  }
}

let infiniteLoopCount = 0;

for (let y = 0; y < tileRowCount; y++) {
  for (let x = 0; x < tileByRowCount; x++) {
    if (tileMapRows[y][x] === TileType.Blank) {
      const testMap = JSON.parse(JSON.stringify(tileMapRows));
      testMap[y][x] = TileType.Obstacle;
      if (moveGuard(testMap)) {
        infiniteLoopCount++;
      }
    }
  }
}

console.log(infiniteLoopCount); // 1655
