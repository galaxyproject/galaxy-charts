export default {
    tabWidth: 4,
    printWidth: 120,
    bracketSameLine: true,
    plugins: ["prettier-plugin-astro"],
    overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
