import React, { useState, useEffect, useCallback } from "react";
import { savedRoutesModel, RoutePreview } from "@/models/savedRoutesModel"; // Import Model
import { ExploreView } from "@/components/ExploreView"; // Import View

const PAGE_SIZE = 10;

export default function ExploreScreen() {
  // --- STATE ---
  const [routes, setRoutes] = useState<RoutePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // --- EFFECT: Debounce Search ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- HELPER: Logic to fetch data from Model ---
  // This function abstracts the reset logic vs append logic
  const fetchRoutes = useCallback(
    async (targetPage: number, isReset: boolean) => {
      // Logic Guard: don't fetch if no more data and we aren't resetting
      if (!isReset && !hasMore) return;

      try {
        const { data, error: fetchError } = await savedRoutesModel.getRoutes(
          targetPage,
          PAGE_SIZE,
          debouncedSearch
        );

        if (fetchError) throw fetchError;

        // inside fetchRoutes function...

        if (data) {
          if (isReset) {
            setRoutes(data);
          } else {
            // CHANGE THIS SECTION:
            setRoutes((prev) => {
              // 1. Create a Set of existing IDs for fast lookup
              const existingIds = new Set(prev.map((r) => r.id));

              // 2. Filter out incoming data that already exists
              const uniqueNewData = data.filter((r) => !existingIds.has(r.id));

              // 3. Append only unique new items
              return [...prev, ...uniqueNewData];
            });
          }

          // Check if we reached the end
          setHasMore(data.length === PAGE_SIZE);
        } else {
          if (isReset) setRoutes([]);
          setHasMore(false);
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch routes");
      }
    },
    [debouncedSearch, hasMore]
  );

  // --- EFFECT: Initial Load / Search Changed ---
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      setPage(0); // Reset page
      await fetchRoutes(0, true); // Reset Fetch
      setLoading(false);
    }
    init();
  }, [debouncedSearch]); // Re-run when search changes

  // --- HANDLERS ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(0);
    await fetchRoutes(0, true);
    setIsRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || loading || isRefreshing || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchRoutes(nextPage, false);
    setPage(nextPage);
    setLoadingMore(false);
  };

  // --- RENDER ---
  return (
    <ExploreView
      title="Saved"
      routes={routes}
      loading={loading}
      loadingMore={loadingMore}
      isRefreshing={isRefreshing}
      error={error}
      searchQuery={searchQuery}
      hasRoutes={routes.length > 0}
      onSearchChange={setSearchQuery}
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
    />
  );
}
