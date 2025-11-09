const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const jestPlugin = require('eslint-plugin-jest');

module.exports = defineConfig([
    expoConfig,
    {
        // apply the jest plugin configuration *only* to test files
        files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"],
        ...jestPlugin.configs['flat/recommended'],   // use Jest plugin recommended rules for test files
    },
    {
        ignores: ['dist/*'],
    },
]);
