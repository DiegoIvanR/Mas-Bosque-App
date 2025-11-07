import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/SupabaseClient";
import { clearLocalData } from "@/lib/database";
import Button from "@/components/Button"; // Using your custom Button

export default function Profile() {
  const { setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Clear the local SQLite database
      await clearLocalData();

      // 2. Sign out from Supabase (this clears the AsyncStorage session)
      const { error } = await supabase.auth.signOut();

      if (error) {
        // Show an error but log out locally anyway
        console.error("Error signing out from Supabase:", error.message);
      }
    } catch (dbError: any) {
      // Catch any database errors
      console.error("Error clearing local database:", dbError.message);
    } finally {
      // 3. Always set global state and redirect to login
      setIsLoggedIn(false);
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Profile Screen</Text>
        <Button
          value={loading ? "Logging out..." : "Log Out"}
          onClick={handleLogout}
          backgroundColor="#1B251F"
          textColor="#FFF"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B", // Dark background
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 20, // Space between text and button
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Lato-Bold", // Matching your other screens
    color: "#fff",
    textAlign: "center",
  },
});
