import {iterate} from "./iterable.js"

export default function day1a(input: string): string {
  console.log(input)
  const as: number[] = []
  const bs: number[] = []
  for (const [a, b] of iterate(input.split("\n")).filter((line) => line !== "").map((line) => line.split("   "))) {
    as.push(Number(a!))
    bs.push(Number(b!))
  }
  as.sort()
  bs.sort()

  return iterate(as)
    .zip(bs)
    .map(([a, b]) => Math.abs(a - b))
    .reduce((a, b) => a + b, 0)
    .toFixed(0)
}
