import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default tseslint.config(
    {
        ignores: ["dist/", "coverage/", "docs/", "node_modules/", "packages/", "**/*.d.ts"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        // Browser and Node globals for source files
        languageOptions: {
            globals: {
                // Browser
                window: "readonly",
                document: "readonly",
                console: "readonly",
                fetch: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                Event: "readonly",
                URL: "readonly",
                HTMLElement: "readonly",
                RequestCredentials: "readonly",
                Response: "readonly",
                RequestInit: "readonly",
                // Node
                process: "readonly",
            },
        },
        rules: {
            // Allow unused vars prefixed with underscore
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            // Allow explicit any where needed (documented cases)
            "@typescript-eslint/no-explicit-any": "warn",
            // Vue specific
            "vue/multi-word-component-names": "off",
            "vue/html-indent": ["error", 4],
            "vue/max-attributes-per-line": "off",
            "vue/singleline-html-element-content-newline": "off",
            "vue/html-closing-bracket-newline": "off",
            "vue/require-default-prop": "off",
            // Allow v-html (content is sanitized with DOMPurify)
            "vue/no-v-html": "off",
            // Stylistic - don't enforce attribute order
            "vue/attributes-order": "off",
            // Allow self-closing on void elements
            "vue/html-self-closing": "off",
        },
    },
    {
        // Test file specific config
        files: ["**/*.test.{js,ts}"],
        languageOptions: {
            globals: {
                // Vitest globals
                describe: "readonly",
                test: "readonly",
                expect: "readonly",
                vi: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                // Node/test environment
                global: "readonly",
            },
        },
    },
);
