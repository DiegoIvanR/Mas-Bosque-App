import { supabase } from "@/lib/SupabaseClient";

import { Route } from "@/lib/database";
export async function fetchRouteSupabase(id: string): Promise<Route | null> {
  try {
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

    if (error) throw new Error(error.message);
    return data;
  } catch (e: any) {
    console.error("Failed to fetch route from Supabase:", e.message);
    throw e;
  }
}
