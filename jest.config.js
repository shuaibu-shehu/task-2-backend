module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js'],
  };
  