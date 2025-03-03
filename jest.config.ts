import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!**/node_modules/**",
    "!**/coverage/**",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/app/components/$1",
    "^@utils/(.*)$": "<rootDir>/src/app/utils/$1"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};

export default createJestConfig(customJestConfig);
