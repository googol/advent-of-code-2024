import { iterate } from "./iterable.js";
import { parseLines, slidingWindow } from "./util.js";

export default function day2a(input: string): string {
  return parseLines(input)
    .map((line) => {
      const numbers = line.split(" ").map(Number);

      const result = iterate(variantsWithUpToOneElementRemoved(numbers)).map(
        (variant) =>
          iterate(slidingWindow(variant, 3)).every(([a, b, c]) => {
            return (
              ((a < b && b < c) || (a > b && b > c)) &&
              Math.abs(a - b) < 4 &&
              Math.abs(b - c) < 4
            );
          }),
      );
      return result.some((a) => a);
    })
    .reduce((a, b) => a + (b ? 1 : 0), 0)
    .toFixed(0);
}

function* variantsWithUpToOneElementRemoved<T>(
  input: readonly T[],
): Iterable<Iterable<T>> {
  for (let omittedIndex = -1; omittedIndex < input.length; omittedIndex++) {
    yield iterate(input.entries())
      .filter(([index]) => index !== omittedIndex)
      .map(([, element]) => element);
  }
}
