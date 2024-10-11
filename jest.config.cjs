// jest.config.cjs
module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios|@apollo/client|graphql-request|graphql-tag)/)",
  ],
  testEnvironment: "node",
  globals: {
    "babel-jest": {
      "useESM": true,
    },
  },
};
