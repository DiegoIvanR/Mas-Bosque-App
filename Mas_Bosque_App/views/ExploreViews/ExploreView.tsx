import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SidebarSearchField from "@/components/Helpers/SidebarSearchField";
import { MaterialIcons } from "@expo/vector-icons";

type ExploreViewProps = {
  title: string;
  searchQuery: string;
  hasRoutes: boolean;
  onSearchChange: (text: string) => void;
  handlePress: () => void;
  renderContent: () => any;
};
export function ExploreView({
  title,
  searchQuery,
  hasRoutes,
  onSearchChange,
  handlePress,
  renderContent,
}: ExploreViewProps) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header and Search always stay mounted */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={handlePress} hitSlop={10} style={styles.add}>
          <MaterialIcons name={"add"} size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
        <SidebarSearchField
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search for a route..."
        />
      </View>

      {/* Only the body content changes */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
  },
  centerContainer: {
    // Reuse this for the spinner area
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "Lato-Bold",
  },
  add: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    position: "absolute",
    right: 0,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
