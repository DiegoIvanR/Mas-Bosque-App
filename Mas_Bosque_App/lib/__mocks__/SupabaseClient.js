// lib/__mocks__/SupabaseClient.js
export const mockRange = jest.fn();
export const mockIlike = jest.fn(() => ({ range: mockRange }));
export const mockSelect = jest.fn(() => ({ ilike: mockIlike, range: mockRange }));
export const mockFrom = jest.fn(() => ({ select: mockSelect }));

export const supabase = {
    from: mockFrom,
};
