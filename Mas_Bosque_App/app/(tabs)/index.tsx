// npx expo run:ios --device
import * as React from "react";
import { View, StyleSheet } from "react-native";
// 1. Import SafeAreaView
import { SafeAreaView } from "react-native-safe-area-context";
import SidebarSearchField from "@/components/SidebarSearchField"; // Adjust path if needed
import MapTestScreen from "@/components/MapTestScreen";

export default function ExploreScreen() {
  const [search, setSearch] = React.useState("");

  return (
    // 2. Use a simple View with flex: 1 as the main wrapper.
    //    The background color matches your map's loading screen.
    <View style={styles.container}>
      {/* 3. Render the MapTestScreen first. Since its root has flex: 1,
           it will expand to fill this parent View. */}
      <MapTestScreen />

      {/* 4. Use SafeAreaView to create a "floating" container for the search bar.
           This will respect the notch/status bar and float on top of the map. */}
      <SafeAreaView style={styles.floatingSearchContainer} edges={["top"]}>
        <View style={styles.searchWrapper}>
          <SidebarSearchField value={search} onChangeText={setSearch} />
        </View>
      </SafeAreaView>

      {/* ... Your other screen content (like a list) would go here ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // I'm using the dark color from your MapTestScreen to make the background match
    backgroundColor: "#00160B",
  },
  // This container floats on top of the map
  floatingSearchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensures it's above the map
  },
  // This provides the left/right padding for the search bar
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8, // A little space from the top
  },
});
