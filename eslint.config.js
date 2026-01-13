import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vitest from "@vitest/eslint-plugin";

export default tseslint.config(
    // Ignored paths
    {
        ignores: ["dist/", "coverage/", "docs/", "node_modules/", "packages/", "**/*.d.ts"],
    },

    // Base configurations
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],

    // Vue files need TypeScript parser
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },

    // Source files - browser + node globals
    {
        files: ["src/**/*.{js,ts,vue}", "lib/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                // TypeScript DOM types not in globals package
                RequestCredentials: "readonly",
                RequestInit: "readonly",
            },
        },
    },

    // Test files - vitest plugin
    {
        files: ["**/*.test.{js,ts}"],
        plugins: {
            vitest,
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
                global: "readonly",
            },
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
    },

    // Shared rules
    {
        rules: {
            // TypeScript
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",

            // Vue
            "vue/multi-word-component-names": "off",
            "vue/html-indent": ["error", 4],
            "vue/max-attributes-per-line": "off",
            "vue/singleline-html-element-content-newline": "off",
            "vue/html-closing-bracket-newline": "off",
            "vue/require-default-prop": "off",
            "vue/no-v-html": "off", // Content is sanitized with DOMPurify
            "vue/attributes-order": "off",
            "vue/html-self-closing": "off",
        },
    },
);
