// lib/__mocks__/expo-router.js

export const router = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
};

export const useRouter = () => router;

export const useLocalSearchParams = jest.fn(() => ({}));

export const Stack = ({ children }) => children;
export const Tabs = ({ children }) => children;

export default {
    useRouter,
    useLocalSearchParams,
    Stack,
    Tabs,
    router,
};
