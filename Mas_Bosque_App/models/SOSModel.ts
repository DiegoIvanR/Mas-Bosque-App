import { supabase } from "@/lib/SupabaseClient"; // Import your supabase client
import * as Location from "expo-location";
// red pending, and yellow if processing. attended doesnt appear
// --- TYPES ---
export type EmergencyContact = {
  id: number;
  name: string;
  last_name: string | null;
  phone: string;
  relationship: string;
};

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  medications: string;
  phone?: string; // Sometimes profile has phone, or we use contact
};

export type SOSRequest = {
  id: string;
  user_id: string;
  latitud: number;
  longitud: number;
  timestamp_inicio: string;
  tipo_emergencia: string | null;
  estado: "attended" | "pending" | "processing";
  // Joined tables
  user_profile: UserProfile;
  emergency_contacts: EmergencyContact[];
};

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

  async fetchActiveSOS(): Promise<SOSRequest[]> {
    console.log("initialize fetch sos");
    const { data: sosData, error: sosError } = await supabase
      .from("SOS")
      .select(
        `
      *,
      user_profile (*)
    `
      )
      .neq("estado", "attended");

    if (sosError) {
      throw new Error(sosError.message);
    }
    if (!sosData || sosData.length === 0) return [];

    // 2. Extract the User IDs involved in these SOS calls
    const userIds = sosData.map((s) => s.user_id);

    // 3. Fetch Emergency Contacts for these specific User IDs
    const { data: contactsData, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("*")
      .in("user_id", userIds);

    if (contactsError) {
      throw new Error(contactsError.message);
    }

    // 4. Merge the contacts into the SOS objects
    const combinedData = sosData.map((sos) => {
      // Find all contacts belonging to this SOS's user
      const userContacts = contactsData.filter(
        (c) => c.user_id === sos.user_id
      );

      return {
        ...sos,
        emergency_contacts: userContacts,
      };
    });
    return combinedData as SOSRequest[];
  },

  async updateSOSStatus(id: string, newStatus: "processing" | "attended") {
    const { error } = await supabase
      .from("SOS")
      .update({ estado: newStatus })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  // in models/SOSModel.ts

  async fetchSOSById(id: string): Promise<SOSRequest | null> {
    // 1. Fetch SOS and User Profile ONLY (Remove emergency_contacts from here)
    const { data, error } = await supabase
      .from("SOS")
      .select(
        `
      *,
      user_profile (*)
    `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log("Error fetching SOS:", error.message);
      return null;
    }

    if (!data) return null;

    // 2. Manually fetch contacts using the user_id we just got
    const { data: contacts, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", data.user_id);

    if (contactsError) {
      console.log("Error fetching contacts:", contactsError.message);
    }

    // 3. Return the combined object
    return {
      ...data,
      emergency_contacts: contacts || [],
    } as SOSRequest;
  },
};
