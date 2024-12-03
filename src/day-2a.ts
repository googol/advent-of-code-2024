import { iterate } from "./iterable.js";
import { parseLines, slidingWindow } from "./util.js";

export default function day2a(input: string): string {
  return parseLines(input)
    .map((line) => {
      const numbers = iterate(line.split(" ")).map(Number);

      const windowed = slidingWindow(numbers, 3);

      const result = iterate(windowed).every(([a, b, c]) => {
        return (
          ((a < b && b < c) || (a > b && b > c)) &&
          Math.abs(a - b) < 4 &&
          Math.abs(b - c) < 4
        );
      });
      return result;
    })
    .reduce((a, b) => a + (b ? 1 : 0), 0)
    .toFixed(0);
}
