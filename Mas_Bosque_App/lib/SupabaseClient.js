import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get your Supabase URL and Key from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in .env file");
}

// THIS IS THE CRITICAL PART
// We pass the 'auth' object to tell Supabase how to store the session.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use AsyncStorage for session storage
    autoRefreshToken: true,
    persistSession: true, // Ensure the session is saved
    detectSessionInUrl: false, // We don't need this for native apps
  },
});
