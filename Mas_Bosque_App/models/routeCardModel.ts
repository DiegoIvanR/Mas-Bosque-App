// model.ts
import { savedRoutesModel } from "@/models/savedRoutesModel";

export type RoutePreview = {
  id: string;
  name: string;
  location: string;
  rating: number;
  difficulty: string;
  distance_km: number;
  image_url?: string;
  saved?: boolean;
};

// Handles Supabase sync
export async function updateRouteSaveStatus(
  routeId: string,
  targetStateIsSaved: boolean
) {
  try {
    if (targetStateIsSaved) {
      const { error } = await savedRoutesModel.saveRoute(routeId);
      if (error) throw error;
      return { success: true, saved: true };
    } else {
      const { error } = await savedRoutesModel.deleteRoute(routeId);
      if (error) throw error;
      return { success: true, saved: false };
    }
  } catch (e) {
    console.error("updateRouteSaveStatus Error:", e);
    return { success: false, saved: targetStateIsSaved, error: e };
  }
}
