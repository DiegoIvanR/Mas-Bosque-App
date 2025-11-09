import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import ExploreScreen from "@/app/(tabs)/index";
import { mockFrom, mockSelect, mockIlike, mockRange } from "@/lib/SupabaseClient";

// Tell Jest to use the mock automatically
jest.mock("@/lib/SupabaseClient");

describe("ExploreScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders routes after fetching data", async () => {
        // Mock Supabase chain response
        mockRange.mockResolvedValueOnce({
            data: [
                {
                    id: "1",
                    name: "Trail of Joy",
                    location: "CDMX",
                    image_url: "",
                    rating: 4.5,
                    difficulty: "Easy",
                    distance_km: 8,
                    time_minutes: 60,
                },
            ],
            error: null,
        });

        const { getByText, queryByText } = render(<ExploreScreen />);

        // Should show loading initially
        expect(queryByText("Explore")).toBeNull();

        // Wait for data to render
        await waitFor(() => {
            expect(getByText("Explore")).toBeTruthy();
            expect(getByText("Trail of Joy")).toBeTruthy();
        });

        // Verify Supabase was called correctly
        expect(mockFrom).toHaveBeenCalledWith("routes");
        expect(mockSelect).toHaveBeenCalled();
        expect(mockRange).toHaveBeenCalled();
    });

    it("shows error message when fetch fails", async () => {
        mockRange.mockRejectedValueOnce(new Error("Failed to fetch routes"));

        const { findByText } = render(<ExploreScreen />);

        // Expect error message after failed fetch
        const errorText = await findByText("Failed to fetch routes");
        expect(errorText).toBeTruthy();
    });
});
