module.exports = {
    preset: 'jest-preset-angular',
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts', '<rootDir>/src/polyfills.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transform: {
      '^.+\\.(ts|js|html)$': 'jest-preset-angular',
      '^.+\\.mjs?$': 'ts-jest'
    },
    transformIgnorePatterns: ['node_modules/(?!(jest-test))', 'node_modules/(?!.*\\.(mjs|umd)$)', 'node_modules/(?!\\@angular)']
  };
