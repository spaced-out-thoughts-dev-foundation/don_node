module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'], // This line ensures only .ts files are tested
  moduleFileExtensions: ['ts', 'js'],
};
