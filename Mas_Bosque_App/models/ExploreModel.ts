import { supabase } from "@/lib/SupabaseClient";
import { Route } from "@/lib/database";

// Define the shape of data this model returns
export type RoutePreview = Omit<Route, "route_data">;

export const ExploreModel = {
  /**
   * Fetches a paginated list of routes, optionally filtered by a search query.
   */
  async getRoutes(
    page: number,
    pageSize: number,
    searchQuery: string = ""
  ): Promise<{ data: RoutePreview[] | null; error: any }> {
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("routes")
        .select(
          "id, name, location, image_url, rating, difficulty, distance_km, time_minutes"
        );

      // Apply search filter if it exists
      if (searchQuery && searchQuery.trim().length > 0) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      // Apply pagination
      const { data, error } = await query.range(from, to);

      if (error) throw error;

      return { data, error: null };
    } catch (e) {
      console.error("ExploreModel Error:", e);
      return { data: null, error: e };
    }
  },
};
