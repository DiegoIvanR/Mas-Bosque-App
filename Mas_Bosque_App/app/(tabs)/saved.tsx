import { ExploreView } from "@/views/ExploreViews/ExploreView"; // Import View
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import ExploreListView from "@/views/ExploreViews/ExploreListView";
import { useSavedController } from "@/hooks/savedController";

export default function ExploreScreen() {
  const {
    loading,
    error,
    loadingMore,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
    searchQuery,
    routes,
    setSearchQuery,
    handlePress,
  } = useSavedController();
  // Helper to render the content body
  const renderContent = () => {
    // 1. Show Spinner only in the body area
    if (loading) {
      return <LoadingScreen />;
    }

    // 2. Show Error if needed
    if (error && !(routes.length > 0)) {
      return <ErrorScreen error={error} />;
    }

    // 3. Show the List
    return (
      <ExploreListView
        routes={routes}
        loading={loading}
        loadingMore={loadingMore}
        isRefreshing={isRefreshing}
        searchQuery={searchQuery}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
      />
    );
  };

  // --- RENDER ---
  return (
    <ExploreView
      title="Community"
      searchQuery={searchQuery}
      hasRoutes={routes.length > 0}
      onSearchChange={setSearchQuery}
      handlePress={handlePress}
      renderContent={renderContent}
    />
  );
}
