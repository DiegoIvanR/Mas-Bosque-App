import { supabase } from "@/lib/SupabaseClient";
export const checkSessionSupabase = async (): Promise<any> => {
  const { data } = await supabase.auth.getSession();
  return data;
};

export const logInSupabase = async (
  email: string,
  password: string
): Promise<any> => {
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (signInError) throw signInError;
  const { data: profileData, error: profileError } = await supabase
    .from("user_profile")
    .select(
      "id, first_name, last_name, blood_type, allergies, medical_conditions, medications, role"
    )
    .eq("id", data.user?.id)
    .single();

  if (profileError) throw profileError;

  const { data: emcontact, error: emcontactError } = await supabase
    .from("emergency_contacts")
    .select("id, user_id, name, last_name, phone, relationship")
    .eq("user_id", data.user?.id)
    .single();

  if (emcontactError) throw emcontactError;
  return { data, profileData, emcontact };
};
