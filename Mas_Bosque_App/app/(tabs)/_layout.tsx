import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/SupabaseClient";
import { getLocalUserData } from "@/lib/database";
import LoadingScreen from "@/views/LoadingScreen";

// ... (Types and TabBarIcon component remain the same) ...

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size: number;
};

function TabBarIcon({ name, color, size }: TabBarIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isRescuer, setIsRescuer] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Mark layout mounted
  useEffect(() => {
    setIsReady(true);
  }, []);

  // 2. Redirect if not logged in
  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn]);

  // 3. Define checkRole function
  async function checkRole() {
    try {
      // Don't set loading true here if you want to avoid flickering,
      // or handle it gracefully.
      // Ensure we have a user before querying DB
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { profile } = await getLocalUserData(data.user.id);
      if (profile) {
        setIsRescuer(profile.role === "rescuer");
      }
    } catch (error) {
      console.log("Error checking role:", error);
    } finally {
      setLoading(false);
    }
  }

  // 4. Role Check Effect (MOVED UP)
  // This must be here, BEFORE any return statements
  useEffect(() => {
    if (isReady && isLoggedIn) {
      checkRole();
    } else if (isReady && !isLoggedIn) {
      // If ready but not logged in, stop loading so the redirect happens
      setLoading(false);
    }
  }, [isReady, isLoggedIn]);

  // ---- NOW it is safe to return early ----

  // Prevent rendering during redirect
  if (!isLoggedIn) return null;

  // Render loading screen
  if (!isReady || loading) {
    return <LoadingScreen />;
  }

  // ---- SHARED TAB CONFIG ----
  const screenOptions = {
    headerShown: false,
    tabBarActiveTintColor: "#FFFFFF",
    tabBarInactiveTintColor: "#676767",
    tabBarStyle: { backgroundColor: "#00160B" },
    tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "compass" : "compass-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rescuer"
        options={{
          title: "Rescuer",
          href: isRescuer ? "/rescuer" : null,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "medkit" : "medkit-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
