import { supabase } from "@/lib/SupabaseClient"; // Import your supabase client
import * as Location from "expo-location";

export const SOSModel = {
  /**
   * Creates the initial SOS record with location and timestamp.
   * Returns the ID of the created record so we can update it later.
   */
  async createEmergencyAlert(): Promise<string | null> {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("SOS")
        .insert({
          user_id: user?.id,
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          timestamp_inicio: new Date().toISOString(),
          // status: 'pending_details' // Optional: helps track state
        })
        .select("id") // IMPORTANT: Request the ID back
        .single();

      if (error) throw error;
      return data.id;
    } catch (e) {
      console.error("Model Error: Failed to create SOS", e);
      return null;
    }
  },

  /**
   * Updates the existing SOS record with the specific emergency type.
   */
  async updateEmergencyType(sosId: string, type: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("SOS")
        .update({ tipo_emergencia: type }) // Assuming column name is 'tipo_emergencia'
        .eq("id", sosId);

      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Model Error: Failed to update SOS type", e);
      return false;
    }
  },
};
