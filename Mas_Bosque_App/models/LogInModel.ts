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
  return data;
};
