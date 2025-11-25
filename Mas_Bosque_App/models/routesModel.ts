import { supabase } from "@/lib/SupabaseClient";

import { Route } from "@/lib/database";
export const fetchRouteSupabase = async (id: string): Promise<Route> => {
  const { data, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        interest_points (*) 
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  // Supabase returns 'interest_points' as an array of objects
  return data as Route;
};
