/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json", "node"], // Ensure TypeScript files are recognized
    transform: {
        "^.+\\.ts$": "ts-jest", // Use ts-jest for TypeScript files
    },
    moduleNameMapper: {
        "^(.*)\\.ts$": "$1", // Resolve TypeScript imports without .ts extensions
    },
};
