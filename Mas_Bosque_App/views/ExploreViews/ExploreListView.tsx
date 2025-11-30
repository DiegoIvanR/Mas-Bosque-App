import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { RoutePreview } from "@/models/ExploreModel";
import RouteCard from "../../components/RouteCard";

type ExploreListViewProps = {
  routes: RoutePreview[];
  loading: boolean;
  loadingMore: boolean;
  isRefreshing: boolean;
  searchQuery: string;
  onRefresh: () => void;
  onLoadMore: () => void;
};

export default function ExploreListView({
  routes,
  loading,
  loadingMore,
  isRefreshing,
  searchQuery,
  onRefresh,
  onLoadMore,
}: ExploreListViewProps) {
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
}

const styles = StyleSheet.create({
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
