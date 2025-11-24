import { supabase } from "@/lib/SupabaseClient";
import { Route } from "@/lib/database";

export type RoutePreview = Omit<Route, "route_data"> & { saved?: boolean };

export const ExploreModel = {
  async getRoutes(
    page: number,
    pageSize: number,
    searchQuery: string = ""
  ): Promise<{ data: RoutePreview[] | null; error: any }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const from = page * pageSize;
      const to = from + pageSize - 1;

      // FIX IS HERE: Change 'saved_routes(id)' to 'saved_routes(route_id)'
      let query = supabase.from("routes").select(
        `
          id, name, location, image_url, rating, difficulty, distance_km, time_minutes,
          saved_routes(route_id)
        `
      );

      if (searchQuery && searchQuery.trim().length > 0) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      // 3. Transform the data
      // ... inside the map function ...
      const transformedData: RoutePreview[] = (data || []).map((item: any) => {
        // DEBUG LOG: See exactly what comes back from the DB
        if (item.saved_routes && item.saved_routes.length > 0) {
          console.log(
            `Route ${item.name} has saved entries:`,
            item.saved_routes
          );
        }

        // Logic
        const isSaved = item.saved_routes && item.saved_routes.length > 0;

        const { saved_routes, ...routeFields } = item;
        return { ...routeFields, saved: isSaved };
      });

      return { data: transformedData, error: null };
    } catch (e) {
      console.error("ExploreModel Error:", e);
      return { data: null, error: e };
    }
  },
};
