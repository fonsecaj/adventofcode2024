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

const GUARD_TILE_TYPES = [
  TileType.GuardLookingDown,
  TileType.GuardLookingLeft,
  TileType.GuardLookingRight,
  TileType.GuardLookingUp,
] as const;

type Tile = {
  type: TileType;
  x: number;
  y: number;
}

type TileRow = TileType[];

type TileMap = TileRow[];

type GuardTile = Tile & {
  type: typeof GUARD_TILE_TYPES[number];
}

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
  if (tile === null) {
    return false;
  }

  return ([...GUARD_TILE_TYPES] as string[]).includes(tile.type);
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

function moveGuard(map: TileMap, guardTile: GuardTile = findGuardTile(map)): TileMap {
  const tileMap = JSON.parse(JSON.stringify(map)) as TileMap;
  let nextTileToVisit: Tile | null = null;

  switch (guardTile.type) {
    case TileType.GuardLookingDown:
      nextTileToVisit = getTile(tileMap, guardTile.x, guardTile.y + 1);
      break;
    case TileType.GuardLookingLeft:
      nextTileToVisit = getTile(tileMap, guardTile.x - 1, guardTile.y);
      break;
    case TileType.GuardLookingRight:
      nextTileToVisit = getTile(tileMap, guardTile.x + 1, guardTile.y);
      break;
    case TileType.GuardLookingUp:
      nextTileToVisit = getTile(tileMap, guardTile.x, guardTile.y - 1);
      break;
  }

  switch (nextTileToVisit?.type) {
    case TileType.Blank:
    case TileType.VisitedByGuard:
      tileMap[guardTile.y][guardTile.x] = TileType.VisitedByGuard;
      tileMap[nextTileToVisit.y][nextTileToVisit.x] = guardTile.type;

      return moveGuard(tileMap, { type: guardTile.type, x: nextTileToVisit.x, y: nextTileToVisit.y });
    case TileType.Obstacle:
      const nextGuardTileType = getNextGuardTileType(guardTile.type);
      tileMap[guardTile.y][guardTile.x] = nextGuardTileType;

      return moveGuard(tileMap, { type: nextGuardTileType, x: guardTile.x, y: guardTile.y });
    default:
      tileMap[guardTile.y][guardTile.x] = TileType.VisitedByGuard;
      
      return tileMap;
  }
}

const tileVisitedByGuardCount = moveGuard(tileMapRows).flat().filter(tile => tile === TileType.VisitedByGuard).length;

console.log(tileVisitedByGuardCount); // 4883


