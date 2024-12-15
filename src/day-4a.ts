import { Grid } from "./day-4-common.js";
import { iterate } from "./iterable.js";

export default function day4a(input: string): string {
  const grid = Grid.parseString(input);

  const result = iterate(grid.findAllCoordinatesWithValue("X"))
    .filter((coord) => grid.get(coord) === "X")
    .flatMap((xCoord) =>
      iterate(getDirections()).flatMap((direction) =>
        iterate(grid.walkInDirection(xCoord, direction))
          .filter(([, value]) => value === "M")
          .flatMap(([mCoord]) => grid.walkInDirection(mCoord, direction))
          .filter(([, value]) => value === "A")
          .flatMap(([aCoord]) => grid.walkInDirection(aCoord, direction))
          .filter(([, value]) => value === "S"),
      ),
    )
    .reduce((a) => a + 1, 0);

  return result.toFixed(0);
}

function getDirections(): Iterable<[number, number]> {
  return iterate([-1, 0, 1])
    .flatMap((xMod) =>
      iterate([-1, 0, 1]).map<[number, number]>((yMod) => [xMod, yMod]),
    )
    .filter(([x, y]) => !(x === 0 && y === 0));
}
