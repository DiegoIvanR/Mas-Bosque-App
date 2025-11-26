// 4. Call Supabase auth.signUp with data from context

import { supabase } from "@/lib/SupabaseClient";
import { useSignup } from "@/app/(auth)/signup/SignUpContext";
import { SignupData } from "@/app/(auth)/signup/SignUpContext";

export interface userData {
  profile: any;
  contact: any;
}
export const signUpUser = async (signupData: SignupData): Promise<userData> => {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
  });
  if (signUpError) throw signUpError;
  if (!signupData)
    throw Error(
      "An unexpected error occurred (no user data). Please try again."
    );

  const { data: profileData, error: profileError } = await supabase
    .from("user_profile")
    .insert([
      {
        id: authData.user.id,
        first_name: signupData.name,
        last_name: signupData.lastName,
        blood_type: signupData.bloodType,
        allergies: signupData.allergies,
        medical_conditions: signupData.medicalConditions,
        medications: signupData.medications,
      },
    ])
    .select()
    .single();
  if (profileError) throw profileError;
  if (!profileData)
    throw Error(
      "An unexpected error occurred ((profile) not saved). Please try again."
    );

  // --- Emergency Contact Insert ---
  const { data: emcontact, error: emcontactError } = await supabase
    .from("emergency_contacts")
    .insert([
      {
        user_id: authData.user.id,
        name: signupData.contactName,
        last_name: signupData.contactLastName,
        phone: signupData.contactPhone,
        relationship: signupData.contactRelationship,
      },
    ])
    .select()
    .single();

  if (emcontactError) throw emcontactError;
  return {
    profile: profileData,
    contact: emcontact,
  };
};
