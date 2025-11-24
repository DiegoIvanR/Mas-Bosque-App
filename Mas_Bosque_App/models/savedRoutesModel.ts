import { supabase } from "@/lib/SupabaseClient";
import { Route } from "@/lib/database";

// Define the shape of data this model returns
// We ensure 'saved' is always true here
export type RoutePreview = Omit<Route, "route_data"> & { saved: boolean };

export const savedRoutesModel = {
  async getRoutes(
    page: number,
    pageSize: number,
    searchQuery: string = ""
  ): Promise<{ data: RoutePreview[] | null; error: any }> {
    try {
      // 1. Get User
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const from = page * pageSize;
      const to = from + pageSize - 1;

      // 2. Query
      let query = supabase
        .from("saved_routes")
        .select(
          `
          routes (
            id, name, location, image_url, rating, difficulty, distance_km, time_minutes
          )
        `
        )
        .eq("user_id", user.id);

      if (searchQuery && searchQuery.trim().length > 0) {
        query = query.ilike("routes.name", `%${searchQuery}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      // 3. Transformation
      const transformedData: RoutePreview[] =
        data?.map((item: any) => ({
          ...item.routes, // Spread the route data
          saved: true, // <--- FORCE THIS TO TRUE
        })) || [];

      return { data: transformedData, error: null };
    } catch (e) {
      console.error("SavedRoutesModel Error:", e);
      return { data: null, error: e };
    }
  },
  async saveRoute(routeId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      // FIX: Use upsert with ignoreDuplicates to prevent 23505 Error
      const { data, error } = await supabase.from("saved_routes").upsert(
        {
          user_id: user.id,
          route_id: routeId,
        },
        {
          onConflict: "user_id, route_id", // The composite key
          ignoreDuplicates: true, // If exists, do nothing (success)
        }
      );

      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      console.error("SavedRoutesModel saveRoute Error:", e);
      return { data: null, error: e };
    }
  },

  async deleteRoute(routeId: string) {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("saved_routes")
        .delete()
        .eq("user_id", user.id)
        .eq("route_id", routeId);

      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      console.error("SavedRoutesModel deleteRoute Error:", e);
      return { data: null, error: e };
    }
  },
};
