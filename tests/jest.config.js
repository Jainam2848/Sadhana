module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^expo-secure-store$': '<rootDir>/../node_modules/expo-secure-store',
    '^expo-haptics$': '<rootDir>/../node_modules/expo-haptics'
  }
};
