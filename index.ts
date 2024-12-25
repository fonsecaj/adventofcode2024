const farm = (await (Bun.file("./puzzle-input.txt").text())).split('\n').map(r => r.split(''));

type Coordinates = `${number},${number}`;

function coordinate(x: number, y: number): Coordinates {
  return `${x},${y}`;
}

function checkRegion(expectedPlot: string, x: number, y: number, regionIndex: number) {
  const plot = farm[y]?.[x];
  if (plot !== expectedPlot) return;

  const plotCoordinates = coordinate(x, y);
  if (visitedPlots.has(plotCoordinates)) return;

  if (!regions[regionIndex]) regions[regionIndex] = [];
  regions[regionIndex].push(plotCoordinates);
  visitedPlots.add(plotCoordinates);

  checkRegion(plot, x - 1, y, regionIndex);
  checkRegion(plot, x + 1, y, regionIndex);
  checkRegion(plot, x, y - 1, regionIndex);
  checkRegion(plot, x, y + 1, regionIndex);
}

const visitedPlots = new Set<Coordinates>();
const regions: Coordinates[][] = [];

for (let y = 0; y < farm.length; y++) {
  for (let x = 0; x < farm[y].length; x++) {
    checkRegion(farm[y][x], x, y, regions.length);
  }
}

const totalPrice = regions.reduce((total, region) => {
  const area = region.length;
  const perimeter = region.reduce((perimeter, plot) => {
    const [x, y] = plot.split(',').map(Number);
    const neighbors = [
      coordinate(x - 1, y),
      coordinate(x + 1, y),
      coordinate(x, y - 1),
      coordinate(x, y + 1),
    ];

    return perimeter + neighbors.filter(neighbor => !region.includes(neighbor)).length;
  }, 0);

  return total + (area * perimeter);
}, 0);

console.log(totalPrice); // 1486324