import { supabase } from "@/lib/SupabaseClient";
import { Route } from "@/lib/database";

// Define the shape of data this model returns
// We ensure 'saved' is always true here
export type RoutePreview = Omit<Route, "route_data"> & { saved: boolean };

export const communityModel = {
  async getRoutes(
    page: number,
    pageSize: number,
    searchQuery: string = ""
  ): Promise<{ data: RoutePreview[] | null; error: any }> {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const from = page * pageSize;
      const to = from + pageSize - 1;

      // 1. Get friend user IDs
      const { data: friends } = await supabase
        .from("friends")
        .select("user2_id")
        .eq("user1_id", user.id);

      const friendIds = friends.map((f) => f.user2_id);

      if (friendIds.length === 0) {
        return { data: [], error: null };
      }

      // 2. Fetch the friend routes + saved state
      let query = supabase
        .from("routes")
        .select(
          `
              id,
              name,
              location,
              image_url,
              rating,
              difficulty,
              distance_km,
              time_minutes,
              user_id,
              saved_routes (route_id)
            `
        )
        .in("user_id", friendIds);

      // Search
      if (searchQuery && searchQuery.trim().length > 0) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      // 3. Transform the data
      const transformed: RoutePreview[] = (data || []).map((item: any) => {
        const isSaved = item.saved_routes && item.saved_routes.length > 0;

        const { saved_routes, ...fields } = item;

        return {
          ...fields,
          saved: isSaved,
        };
      });

      return { data: transformed, error: null };
    } catch (e) {
      console.error("communityModel.getRoutes Error:", e);
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
      console.error("CommunityModel saveRoute Error:", e);
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
      console.error("CommunityModel deleteRoute Error:", e);
      return { data: null, error: e };
    }
  },
};
