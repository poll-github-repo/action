/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  maxConcurrency: 20,
  testMatch: ["**/spec/**/*.spec.ts"]
}
