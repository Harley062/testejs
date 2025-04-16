module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/tests/setup.ts"],
  testMatch: ["<rootDir>/src/tests/**/*.e2e.spec.ts"],
  moduleFileExtensions: ["ts","js","json"]
};
