import { Tabs, useRouter } from "expo-router";
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Ionicons } from "@expo/vector-icons"; // Import an icon set
import SOSConfirmation from "../(sos)/SOSConfirmation";
import { View, StyleSheet, Modal } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  // SOS modal state
  const [sosVisible, setSOSVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<string>("");
  // const insets = useSafeAreaInsets();
  const [tabBarHeight, setTabBarHeight] = useState(0);

  useEffect(() => {
    setIsReady(true); // Mark layout as mounted
  }, []);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn]);

  if (!isLoggedIn) return null; // Don't render Tabs while redirecting

  // Callback to trigger SOS modal from any tab
  const triggerSOS = () => setSOSVisible(true);

  // Emergency selection and send handlers
  const handleSelect = (type: string) => {
    setSelectedEmergency(type);
  };
  const handleSend = (type: string) => {
    setSOSVisible(false);
    setSelectedEmergency("");
    console.log('Emergency sent:', type);
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
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
          tabBar={props => (
            <View onLayout={e => setTabBarHeight(e.nativeEvent.layout.height)}>
              <BottomTabBar {...props} />
            </View>
          )}
        >
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
          {/* ... other screens ... */}
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
            // Pass triggerSOS as a prop to saved.tsx
            initialParams={{ triggerSOS }}
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
      </View>
      {/* SOSConfirmation overlay modal - now outside the Tabs container */}
      <Modal
        visible={sosVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSOSVisible(false)}
      >
        {/* <View style={[styles.sosModalRoot, { paddingBottom: insets.bottom + tabBarHeight }]}>  */}
        <View style={[styles.sosModalRoot, { paddingBottom: tabBarHeight }]}>
          <SOSConfirmation
            onEmergencySelected={handleSelect}
            onSend={handleSend}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sosModalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
    // zIndex is not needed in Modal, but can be added if necessary
  },
});
