import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RouteCard from "@/components/RouteCard";
import SidebarSearchField from "@/components/SidebarSearchField";
import { RoutePreview } from "@/models/ExploreModel";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
type ExploreViewProps = {
  title: string;
  routes: RoutePreview[];
  loading: boolean;
  loadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  hasRoutes: boolean;
  onSearchChange: (text: string) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
};
//
export function ExploreView({
  title,
  routes,
  loading,
  loadingMore,
  isRefreshing,
  error,
  searchQuery,
  hasRoutes,
  onSearchChange,
  onRefresh,
  onLoadMore,
}: ExploreViewProps) {
  const handlePress = () => {
    router.push(`/record/record`);
  };

  // Helper to render the content body
  const renderContent = () => {
    // 1. Show Spinner only in the body area
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    // 2. Show Error if needed
    if (error && !hasRoutes) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    // 3. Show the List
    return (
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RouteCard route={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => {
          if (loading || isRefreshing) return null;
          return (
            <View style={styles.listEmptyContainer}>
              <Text style={styles.errorText}>
                {searchQuery ? "No routes found" : "No routes available"}
              </Text>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#FFFFFF"]}
            progressBackgroundColor="#00160B"
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (!loadingMore) return null;
          return (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          );
        }}
      />
    );
  };

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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    color: "#8E8E93",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
