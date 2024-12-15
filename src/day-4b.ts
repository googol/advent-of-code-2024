import {
  Grid,
  extractCoordinates,
  formatCoordinates,
  type Coordinate,
} from "./day-4-common.js";

type Pattern = [
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
];
const patterns = [
  ["M", undefined, "S", undefined, "A", undefined, "M", undefined, "S"],
  ["M", undefined, "M", undefined, "A", undefined, "S", undefined, "S"],
  ["S", undefined, "M", undefined, "A", undefined, "S", undefined, "M"],
  ["S", undefined, "S", undefined, "A", undefined, "M", undefined, "M"],
] satisfies readonly Pattern[];

const patternPositions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 0],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

export default function day4b(input: string): string {
  const grid = Grid.parseString(input);

  const startingPoints = grid.findAllCoordinatesWithValue("A");
  let resultCount = 0;
  for (const aPoint of startingPoints) {
    for (const pattern of patterns) {
      if (matchPatternAt(aPoint, grid, pattern)) {
        resultCount++;
      }
    }
  }

  return resultCount.toFixed(0);
}

function matchPatternAt(
  coordinate: Coordinate,
  grid: Grid,
  pattern: Pattern,
): boolean {
  const { x, y } = extractCoordinates(coordinate);
  for (const [index, patternPosition] of patternPositions.entries()) {
    const expected = pattern.at(index);
    if (!expected) {
      continue;
    }

    const patternX = x + patternPosition[0];
    const patternY = y + patternPosition[1];
    const actual = grid.get(formatCoordinates(patternX, patternY));

    if (expected !== actual) {
      return false;
    }
  }
  return true;
}
