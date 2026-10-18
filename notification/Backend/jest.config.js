module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.[jt]s'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  forceExit: true,
};
