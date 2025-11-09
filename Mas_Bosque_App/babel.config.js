module.exports = function (api) {
    api.cache(true);

    // Check if the environment is a Jest test run
    const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

    return {
        presets: ["babel-preset-expo"],
        plugins: [
            // Only apply module-resolver outside of a test environment
            !isTest && [
                "module-resolver",
                {
                    root: ["./"],
                    alias: {
                        "@": "./",
                    },
                },
            ],
            // Include other necessary plugins like reanimated
            "react-native-reanimated/plugin",
        ].filter(Boolean), // Filters out the 'false' entry if it's a test
    };
};