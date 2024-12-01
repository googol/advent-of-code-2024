import { readFile } from 'node:fs/promises'

await main()

async function main() {
  const [_node, _script, dayArg, partArg] = process.argv
  
  if (dayArg === undefined) {
    console.log("Specify day as arg 1")
    process.exit(1)
  }

  if (partArg === undefined) {
    console.log("Specify part a/b as second arg")
    process.exit(1)
  }

  const input = await readFile(`./inputs/day-${dayArg}`, { encoding: 'utf8' })

  const dayModule = await import(`./day-${dayArg}${partArg}.js`)

  const result = dayModule.default(input)

  console.log("Result: ", result)
}
