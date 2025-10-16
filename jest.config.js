export default {
    // Use a Node.js environment for testing, as opposed to simulating a browser environment.
    testEnvironment: "node",

    // Prevent Jest from using Babel to transform code, allowing it to run ES Modules.
    transform: {},

    // Call a setup script before running all Jest test sets.
    globalSetup: "./testing/setup.js",

    // Call a teardown script after running all Jest test sets.
    globalTeardown: "./testing/teardown.js", 
};
