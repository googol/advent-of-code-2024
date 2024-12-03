import { iterate, type IterableWrapper } from "./iterable.js";

export function parseLines(input: string): IterableWrapper<string> {
  return iterate(input.split("\n")).filter((line) => line !== "");
}

type GrowToSize<T, N extends number, A extends T[]> = A["length"] extends N
  ? A
  : GrowToSize<T, N, [...A, T]>;

export type FixedArray<T, N extends number> = GrowToSize<T, N, []>;

export function* slidingWindow<T, N extends number>(
  input: Iterable<T>,
  windowLength: N,
): Iterable<FixedArray<T, N>> {
  const currentWindow = [];

  for (const element of input) {
    currentWindow.push(element);

    if (currentWindow.length === windowLength) {
      yield Array.from(currentWindow) as FixedArray<T, N>;

      currentWindow.shift();
    }
  }
}
