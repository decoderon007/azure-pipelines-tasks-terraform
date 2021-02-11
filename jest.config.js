module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "transformIgnorePatterns": [
      "/!node_modules\\/azure-devops-ui/"
    ],
    "coverageReporters": [ "text", "text-summary", "html", "cobertura"],
    "coverageDirectory": "./.tests/coverage",
    "collectCoverage": true
  }