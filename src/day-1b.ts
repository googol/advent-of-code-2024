import {iterate} from "./iterable.js"

export default function day1b(input: string): string {
  const as: number[] = []
  const bs: number[] = []
  for (const line of input.split("\n")) {
    if (line === "") {
      continue
    }
    const [a, b] = line.split("   ")
    as.push(Number(a!))
    bs.push(Number(b!))
  }

  const bsCount = new Map<number, number>()

  for (const b of bs) {
    bsCount.set(b, (bsCount.get(b) ?? 0) + 1)
  }

  return iterate(as)
    .map((a) => a * (bsCount.get(a) ?? 0))
    .reduce((a, b) => a + b, 0)
    .toFixed(0)
}
