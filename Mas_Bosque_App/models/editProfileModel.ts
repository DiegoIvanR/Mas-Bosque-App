import { supabase } from "@/lib/SupabaseClient";
import { getLocalUserData } from "@/lib/database";

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
};
