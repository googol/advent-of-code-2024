export default function day3a(input: string): string {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

  let result = 0;
  for (const match of input.matchAll(regex)) {
    result += Number(match[1]) * Number(match[2]);
  }
  return result.toFixed(0);
}
