import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  comments.recommended,
  eslintConfigPrettier,
  {
    // Globally ignored files here
    ignores: ["dist/**/*"],
  },
  {
    // Generic linter options
    linterOptions: {
      // Makes tslint complain of in-file rule-ignore comments that have no effect
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    // Configuration options for typescript-eslint rules that rely on type information
    // https://typescript-eslint.io/getting-started/typed-linting/
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Disable rules that rely on typescript types on js files
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Any custom rules that apply globally can be added/overridden here
    rules: {
      "@eslint-community/eslint-comments/require-description": [
        "error",
        { ignore: ["eslint-enable"] },
      ],
    },
  },
);
