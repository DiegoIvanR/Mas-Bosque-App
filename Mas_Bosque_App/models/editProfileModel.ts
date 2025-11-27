import { supabase } from "@/lib/SupabaseClient";
import { getLocalUserData, updateContactLocally } from "@/lib/database";
import { router } from "expo-router";
export type UserDataType = {
  id: string;
  first_name: string;
  last_name: string;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  medications: string;
};
export type ContactDataType = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  last_name: string;
};
export const editProfileModel = {
  async fetchProfile() {
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;
    if (!currentUser) throw Error("No logged in user");
    // ---- get from parameters from (tabs)/profile --------
    // ---- pass user + user_profile (lastname firstname)
    // import { SignupData } from "@/app/(auth)/signup/SignUpContext";

    const { profile, contact } = (await getLocalUserData(currentUser.id)) as {
      profile: UserDataType;
      contact: ContactDataType;
    };
    return { profile, contact };
  },

  async handleSave(contact: ContactDataType): Promise<void> {
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;
    if (!currentUser) throw Error("No logged in user");

    const { error } = await supabase
      .from("emergency_contacts")
      .update({
        name: contact.name,
        last_name: contact.last_name,
        phone: contact.phone,
        relationship: contact.relationship,
      })
      .eq("id", contact.id);

    if (error) throw error;
    updateContactLocally(contact);
    console.log("success?");
  },
};
