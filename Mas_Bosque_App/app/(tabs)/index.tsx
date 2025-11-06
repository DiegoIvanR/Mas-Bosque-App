import * as React from "react";
import { View, StyleSheet } from "react-native";
// 1. Import SafeAreaView
import { SafeAreaView } from "react-native-safe-area-context";
import SidebarSearchField from "@/components/SidebarSearchField"; // Adjust path if needed

export default function ExploreScreen() {
  const [search, setSearch] = React.useState("");

  return (
    // 2. Use SafeAreaView as the main wrapper for your screen
    <SafeAreaView style={styles.safeArea}>
      {/* This container adds the side padding for the search bar */}
      <View style={styles.container}>
        <SidebarSearchField value={search} onChangeText={setSearch} />
      </View>

      {/* ... Your other screen content (like a list) would go here ... */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // I'm using the dark color from your screenshot/tab bar to make the background match
    backgroundColor: "#00160B",
  },
  container: {
    // This provides the left/right padding for the search bar
    paddingHorizontal: 16,
    paddingTop: 8, // A little space from the top
  },
});
