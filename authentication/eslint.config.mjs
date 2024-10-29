import { fixupConfigRules } from "@eslint/compat";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "    # /node_modules/* in the project root is ignored by default",
        "    /node_modules/*",
        "**/    # build artefacts",
        "    dist/*",
        "    build/*",
        "    coverage/*",
        "**/    # data definition files",
        "    **/*.d.ts",
        "**/    # 3rd party libs",
        "    /src/public/",
        "**/    # custom definition files",
        "    /src/types/",
    ],
}, ...fixupConfigRules(compat.extends(
    "airbnb/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
)), {
    plugins: {
        prettier,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "script",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "prettier/prettier": ["error"],
        semi: ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        camelcase: "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": 1,

        "@typescript-eslint/no-inferrable-types": ["warn", {
            ignoreParameters: true,
        }],

        "no-underscore-dangle": "off",
        "no-shadow": "off",
        "no-new": 0,
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/no-unused-vars": "warn",

        quotes: [2, "single", {
            avoidEscape: true,
        }],

        "class-methods-use-this": "off",

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
        }],
    },
}];