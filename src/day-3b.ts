export default function day3a(input: string): string {
  const regex =
    /(?:(?<opmul>mul)\((?<a>\d{1,3}),(?<b>\d{1,3})\))|(?:(?<opdo>do)\(\))|(?:(?<opdont>don't)\(\))/g;

  let result = 0;
  let enabled = true;
  for (const match of input.matchAll(regex)) {
    if (match.groups?.["opmul"]) {
      if (enabled) {
        result += Number(match.groups["a"]) * Number(match.groups["b"]);
      }
    } else if (match.groups?.["opdo"]) {
      enabled = true;
    } else if (match.groups?.["opdont"]) {
      enabled = false;
    }
  }
  return result.toFixed(0);
}
