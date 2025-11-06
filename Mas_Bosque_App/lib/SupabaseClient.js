// lib/SupabaseClient.js
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = "https://pabnlrgfwisrcobzerwm.supabase.co";
const supabaseKey = Constants.expoConfig.extra.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
