module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/tests/setup.ts"],
  testMatch: ["<rootDir>/src/tests/**/*.spec.ts"],
  moduleFileExtensions: ["ts","js","json"]
};
