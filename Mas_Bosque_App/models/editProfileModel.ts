import EditPassword from "@/app/(profile)/editPassword";
import { supabase } from "@/lib/SupabaseClient";
import {
  getLocalUserData,
  updateContactLocally,
  updateMedicalLocally,
  updateNameLocally,
} from "@/lib/database";
import { Alert } from "react-native";

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

  async handleUpdateContact(contact: ContactDataType): Promise<void> {
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
  async handleUpdateMedical(profile: UserDataType): Promise<void> {
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;
    if (!currentUser) throw Error("No logged in user");

    const { error } = await supabase
      .from("user_profile")
      .update({
        blood_type: profile.blood_type,
        allergies: profile.allergies,
        medical_conditions: profile.medical_conditions,
        medications: profile.medications,
      })
      .eq("id", profile.id);

    if (error) throw error;
    updateMedicalLocally(profile);
  },

  async handleUpdateName(profile: UserDataType): Promise<void> {
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;
    if (!currentUser) throw Error("No logged in user");

    const { error } = await supabase
      .from("user_profile")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq("id", profile.id);

    if (error) throw error;
    updateNameLocally(profile);
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // 1. Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("No logged-in user.");
    }

    // 2. Reauthenticate by signing in again with the current password
    const { error: signinError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signinError) {
      Alert.alert("Incorrect Password", "Your current password is wrong.");
      throw Error("Incorrect Password, Your current password is wrong.");
    }

    // 3. If successful, update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      Alert.alert("Error", updateError.message);
      throw updateError;
    }

    Alert.alert("Success", "Password updated successfully.");
  },
};
