import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/SupabaseClient";
import { clearLocalData } from "@/lib/database";
import Button from "@/components/Button";
import InitialsAvatar from "@/components/InitialsAvatar";

// --- Types ---
type EditListItemProps = {
  label: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
};

type UserDataType = {
  first_name: string;
  last_name: string;
};
export default function Profile() {
  const { setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await clearLocalData();
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Supabase logout error:", error.message);
    } catch (err: any) {
      console.error("DB error:", err.message);
    } finally {
      setIsLoggedIn(false);
      router.replace("/(auth)/login");
    }
  };

  const [user, setUser] = useState<UserDataType | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    const currentUser = supabase.auth.getUser
      ? (await supabase.auth.getUser()).data.user
      : null;

    if (!currentUser) {
      console.log("No logged in user");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_profile") // replace with your table name
      .select("first_name, last_name")
      .eq("id", currentUser.id)
      .single();

    if (error) {
      console.log("Error fetching user:", error.message);
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Content (Image & Name) */}
        <View style={styles.topContent}>
          {/* Profile Image */}
          <View style={styles.avatarWrapper}>
            <InitialsAvatar
              name={user?.first_name + " " + user?.last_name}
              size={150}
            />
          </View>

          {/* Name */}
          <Text style={styles.name}>
            {user?.first_name + " " + user?.last_name}
          </Text>
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Edit (profile) */}
          <Button
            value="Edit profile"
            onClick={() => router.push("/(profile)/edit")}
            backgroundColor="#1B251F"
            textColor="#FFF"
            style={styles.button}
          />

          {/* Logout */}
          <Button
            value={loading ? "Logging out..." : "Log Out"}
            onClick={handleLogout}
            backgroundColor="#1B251F"
            textColor="#FFF"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  container: {
    flex: 1,
    // *** CHANGE: Distribute space between the top content and the buttons
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40, // *** ADDED: Space from the bottom edge
  },

  // *** NEW STYLE: To group the image and name together
  topContent: {
    alignItems: "center",
  },

  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "#333",
    marginBottom: 30, // More space above the name
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 36,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    color: "#fff",
    // Removed original marginBottom as the container spacing is now managing vertical space
    textAlign: "center",
  },

  // *** NEW STYLE: To group and align the buttons
  buttonsContainer: {
    width: "100%", // Use full width to center buttons
    alignItems: "center", // Center the buttons horizontally
    // A dedicated container helps manage the spacing for the button group
  },

  button: {
    width: "80%",
    marginBottom: 10, // *** INCREASED: Space between buttons for better separation
  },
});
