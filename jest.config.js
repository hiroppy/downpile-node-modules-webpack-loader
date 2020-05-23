module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!src/types/*.d.ts'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
