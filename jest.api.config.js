module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/api'],
  testMatch: ['**/*.test.js'],
  clearMocks: true,
  collectCoverageFrom: ['netlify/functions/api.js'],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'json-summary', 'lcov']
};
