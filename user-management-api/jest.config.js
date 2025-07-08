/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "src/application/controllers/**/*.ts",
    "src/application/services/**/*.ts",
    "src/domain/repositories/**/*.ts",
    "src/infrastructure/repos/*.ts",
    "!**/*.test.ts",
    "!**/index.ts",
  ],
};
