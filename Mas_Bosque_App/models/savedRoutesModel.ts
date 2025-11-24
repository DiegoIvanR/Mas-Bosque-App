import { supabase } from "@/lib/SupabaseClient";
import { Route } from "@/lib/database";

// Define the shape of data this model returns
export type RoutePreview = Omit<Route, "route_data">;

export const savedRoutesModel = {
  /**
   * Fetches a paginated list of routes saved by the current user,
   * optionally filtered by a search query.
   */
  async getRoutes(
    page: number,
    pageSize: number,
    searchQuery: string = ""
  ): Promise<{ data: RoutePreview[] | null; error: any }> {
    try {
      // Get the current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const from = page * pageSize;
      const to = from + pageSize - 1;

      // Query saved_routes joined with routes
      let query = supabase
        .from("saved_routes")
        .select(
          `
          routes (
            id,
            name,
            location,
            image_url,
            rating,
            difficulty,
            distance_km,
            time_minutes
          )
        `
        )
        .eq("user_id", user.id);

      // Apply search filter if it exists
      if (searchQuery && searchQuery.trim().length > 0) {
        query = query.ilike("routes.name", `%${searchQuery}%`);
      }

      // Apply pagination
      const { data, error } = await query.range(from, to);

      if (error) throw error;

      // Flatten the nested 'routes' object
      const flattenedData: RoutePreview[] =
        data?.map((item: any) => item.routes) || [];

      return { data: flattenedData, error: null };
    } catch (e) {
      console.error("SavedRoutesModel Error:", e);
      return { data: null, error: e };
    }
  },
};
