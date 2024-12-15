import { iterate } from "./iterable.js";

export type Coordinate = string;

export class Grid {
  private readonly fields = new Map<Coordinate, string>();
  private readonly width: number;
  private readonly height: number;

  constructor(fields: Map<Coordinate, string>, width: number, height: number) {
    this.fields = fields;
    this.width = width;
    this.height = height;
  }

  static parseString(input: string): Grid {
    const grid = new Map<Coordinate, string>();
    let width = 0;
    let height = 0;

    for (const [x, line] of input.split("\n").entries()) {
      if (line === "") {
        continue;
      }

      if (height < x + 1) {
        height = x + 1;
      }

      for (const [y, char] of line.split("").entries()) {
        if (char === "") {
          continue;
        }

        const coord = formatCoordinates(x, y);

        grid.set(coord, char);

        if (width < y + 1) {
          width = y + 1;
        }
      }
    }

    return new Grid(grid, width, height);
  }

  *findAllCoordinatesWithValue(searchValue: string): Iterable<Coordinate> {
    for (const [coordinate, value] of this.fields) {
      if (value === searchValue) {
        yield coordinate;
      }
    }
  }

  get(coordinate: Coordinate): string | undefined {
    return this.fields.get(coordinate);
  }

  getSurroundingCoordinates(
    currentCoordinates: Coordinate,
  ): Iterable<Coordinate> {
    const { x, y } = extractCoordinates(currentCoordinates);

    return iterate([-1, 0, 1])
      .map((mod) => x + mod)
      .flatMap((xMod) =>
        iterate([-1, 0, 1])
          .map((mod) => y + mod)
          .map((yMod) => [xMod, yMod] as const),
      )
      .filter(([xMod, yMod]) => {
        return (
          !(xMod === x && yMod === y) &&
          x >= 0 &&
          y >= 0 &&
          x < this.height &&
          y < this.width
        );
      })
      .map(([x, y]) => formatCoordinates(x, y));
  }

  *walkInDirection(
    coordinate: Coordinate,
    direction: [number, number],
  ): Iterable<[Coordinate, string]> {
    const { x, y } = extractCoordinates(coordinate);

    const nextX = x + direction[0];
    const nextY = y + direction[1];

    const newCoordinate = formatCoordinates(nextX, nextY);
    const newValue = this.get(newCoordinate);

    if (newValue) {
      yield [newCoordinate, newValue];
    }
  }

  print(): string {
    let visualization = "";
    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        visualization += this.fields.get(formatCoordinates(x, y)) ?? ".";
      }
      visualization += "\n";
    }
    return visualization;
  }

  printFiltered(allowedCoordinates: Set<string>): string {
    let visualization = "";
    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        if (allowedCoordinates.has(formatCoordinates(x, y))) {
          visualization += this.fields.get(formatCoordinates(x, y)) ?? ".";
        } else {
          visualization += ".";
        }
      }
      visualization += "\n";
    }
    return visualization;
  }

  toString(): string {
    let result = "";
    result += `(Grid ${this.width.toFixed(0)} x ${this.height.toFixed(0)})\n`;
    result += this.print();
    result += "\n";
    return result;
  }
}

export function formatCoordinates(x: number, y: number): string {
  return `${x.toFixed(0)}-${y.toFixed(0)}`;
}

export function extractCoordinates(coords: string): { x: number; y: number } {
  const [xStr, yStr] = coords.split("-");
  return {
    x: Number(xStr),
    y: Number(yStr),
  };
}
