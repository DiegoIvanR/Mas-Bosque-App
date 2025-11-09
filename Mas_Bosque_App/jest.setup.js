// jest.setup.js

// Ignore Expo Winter runtime import noise
const originalError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === "string" &&
        args[0].includes("You are trying to `import` a file outside of the scope")
    ) {
        return;
    }
    originalError(...args);
};
