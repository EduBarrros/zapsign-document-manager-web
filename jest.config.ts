import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFiles: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^src/environments/(.*)$': '<rootDir>/src/environments/$1',
  },
  modulePaths: ['<rootDir>'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/main.ts',
  ],
  coverageReporters: ['html', 'text-summary'],
};

export default config;
