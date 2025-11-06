import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Ionicons } from "@expo/vector-icons"; // Import an icon set

// Define props for the icon component
type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size: number;
};

// A helper component to render icons
function TabBarIcon({ name, color, size }: TabBarIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true); // Mark layout as mounted
  }, []);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn]);

  if (!isLoggedIn) return null; // Don't render Tabs while redirecting

  return (
    <Tabs
      screenOptions={{
        // --- THIS LINE HIDES THE HEADER ---
        headerShown: false,

        // --- Global Styles for all tabs ---
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#676767",
        tabBarStyle: {
          backgroundColor: "#00160B",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({
            color,
            size,
            focused,
          }: {
            color: string;
            size: number;
            focused: boolean;
          }) => (
            <TabBarIcon
              name={focused ? "compass" : "compass-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* ... other screens ... */}

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({
            color,
            size,
            focused,
          }: {
            color: string;
            size: number;
            focused: boolean;
          }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
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
          tabBarIcon: ({
            color,
            size,
            focused,
          }: {
            color: string;
            size: number;
            focused: boolean;
          }) => (
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
          tabBarIcon: ({
            color,
            size,
            focused,
          }: {
            color: string;
            size: number;
            focused: boolean;
          }) => (
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
