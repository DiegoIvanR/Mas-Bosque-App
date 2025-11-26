import { supabase } from "@/lib/SupabaseClient";
export const profileModel = {
  async signOutSupabase() {
    const { error } = await supabase.auth.signOut();
    if (error) return error;
  },
  async fetchUserSupabase() {
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;

    if (!currentUser) throw Error("No logged in user");

    const { data, error } = await supabase
      .from("user_profile") // replace with your table name
      .select("first_name, last_name")
      .eq("id", currentUser.id)
      .single();
    if (error) throw error;
    return data;
  },
};
export type UserDataType = {
  first_name: string;
  last_name: string;
};
