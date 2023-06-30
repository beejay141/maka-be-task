// eslint-disable-next-line no-undef
module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  coverageReporters: ['json', 'text', 'html', 'lcov', 'clover'],
  collectCoverage: true,
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: 'src/.*/*.test.(t|j)s',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
