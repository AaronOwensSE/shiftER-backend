export default {
    testEnvironment: "node",
    setupFiles: [ "dotenv/config" ],
    testPathIgnorePatterns: [ "<rootDir>/previous-version/" ],  // Remove with this directory.
    verbose: true
};
