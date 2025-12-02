import React, { useState, useEffect, useCallback } from "react";
import { ExploreModel, RoutePreview } from "@/models/ExploreModel"; // Import Model
import { ExploreView } from "@/views/ExploreViews/ExploreView"; // Import View
import { router } from "expo-router";
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import ExploreListView from "@/views/ExploreViews/ExploreListView";
import { useExploreController } from "@/hooks/exploreController";

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
  } = useExploreController();
  // Helper to render the content body
  const renderContent = () => {
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

  return (
    <ExploreView
      title="Explore"
      searchQuery={searchQuery}
      hasRoutes={routes.length > 0}
      onSearchChange={setSearchQuery}
      handlePress={handlePress}
      renderContent={renderContent}
    />
  );
}
