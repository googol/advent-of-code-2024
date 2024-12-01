const typecheck = () => "tsc --noEmit"; // Uses function to ignore the list of changed files for a full typecheck
const prettier = "prettier --write";
const eslint = "eslint --fix";

export default {
  "*.{ts,mts,cts}": [typecheck, prettier, eslint],
  "*.{js,mjs,cjs}": [prettier, eslint],
  "*.{yaml,yml,md,json}": prettier,
};
