export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        useESM: true,
      }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transformIgnorePatterns: [
      '/node_modules/(?!(typeorm|@typeorm|ts-jest)/)'
    ],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    }
  }