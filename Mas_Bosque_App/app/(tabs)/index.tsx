import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/SupabaseClient"; // Using your path
import { Route } from "@/lib/database"; // Import the Route type
import RouteCard from "@/components/RouteCard";
import SidebarSearchField from "@/components/SidebarSearchField";

type RoutePreview = Omit<Route, "route_data">;
const PAGE_SIZE = 10; // Set the page size

export default function ExploreScreen() {
  const [routes, setRoutes] = useState<RoutePreview[]>([]);
  const [loading, setLoading] = useState(true); // For initial load
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Add new state for pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // 2. Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 3. Create a function to fetch routes (reset logic)
  const fetchAndSetRoutes = useCallback(async () => {
    setError(null);
    try {
      const from = 0; // Always fetch page 0
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("routes")
        .select(
          "id, name, location, image_url, rating, difficulty, distance_km, time_minutes"
        );

      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      if (data) {
        setRoutes(data);
        setPage(0);
        setHasMore(data.length === PAGE_SIZE);
      } else {
        setRoutes([]);
        setPage(0);
        setHasMore(false);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch routes");
    }
  }, [debouncedSearch]); // Depends on debouncedSearch

  // 4. useEffect for initial load AND search changes
  useEffect(() => {
    setLoading(true);
    fetchAndSetRoutes().finally(() => setLoading(false));
  }, [fetchAndSetRoutes]); // Runs when fetchAndSetRoutes (i.e., debouncedSearch) changes

  // 5. Modify handleRefresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAndSetRoutes();
    setIsRefreshing(false);
  }, [fetchAndSetRoutes]); // Also uses the new reset function

  // 6. Create handleLoadMore function
  const handleLoadMore = async () => {
    // Don't fetch if already loading, or if no more data
    if (loadingMore || !hasMore || loading || isRefreshing) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const from = nextPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("routes")
        .select(
          "id, name, location, image_url, rating, difficulty, distance_km, time_minutes"
        );

      if (debouncedSearch) {
        query = query.ilike("name", `%${debouncedSearch}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) throw error;

      if (data && data.length > 0) {
        setRoutes((prevRoutes) => [...prevRoutes, ...data]);
        setPage(nextPage);
        setHasMore(data.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch routes");
    } finally {
      setLoadingMore(false);
    }
  };

  // 7. Handle loading state (unchanged, for initial load)
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // 8. Handle error state (only show full screen error if list is empty)
  if (error && routes.length === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // 9. Render the list of routes
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Explore</Text>

      <View style={styles.searchContainer}>
        <SidebarSearchField
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for a route..."
        />
      </View>

      {/* 10. Update FlatList */}
      <FlatList
        data={routes} // Use routes directly
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RouteCard route={item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => {
          // Don't show empty message while loading or refreshing
          if (loading || isRefreshing) return null;

          return (
            <View style={styles.listEmptyContainer}>
              <Text style={styles.errorText}>
                {debouncedSearch ? "No routes found" : "No routes available"}
              </Text>
              {/* Show non-fatal error if one occurred */}
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
            colors={["#FFFFFF"]}
            progressBackgroundColor="#00160B"
          />
        }
        // --- ADD/UPDATE THESE PROPS ---
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // How close to the end to trigger
        ListFooterComponent={() => {
          if (!loadingMore) return null;
          return (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          );
        }}
        // --- END ---
      />
    </SafeAreaView>
  );
}

// 11. Styles (using your app's dark theme)
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
    padding: 20,
  },
  listEmptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  title: {
    fontSize: 32,
    color: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: "Lato-Bold",
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
  errorText: {
    color: "#8E8E93",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  // 12. Add footer loader style
  footerLoader: {
    paddingVertical: 20,
  },
});
