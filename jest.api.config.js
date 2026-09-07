module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/netlify/functions'],
  testMatch: ['**/*.test.js'],
  clearMocks: true,
  collectCoverageFrom: ['netlify/functions/api.js'],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'json-summary', 'lcov']
};
