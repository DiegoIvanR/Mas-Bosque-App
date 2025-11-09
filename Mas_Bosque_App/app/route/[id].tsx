import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { ToastAndroid } from "react-native"; // For user feedback

import { supabase } from "@/lib/SupabaseClient";
import {
  Route,
  getLocalRouteById,
  saveRouteLocally,
  checkIfRouteIsSaved, // <-- Import new function
  deleteLocalRouteById, // <-- Import new function
} from "@/lib/database";
import { RouteDetailView } from "@/components/RouteDetailView";

// --- CONTROLLER ---
export default function RouteDetailScreen() {
  const { id, isOffline } = useLocalSearchParams<{
    id: string;
    isOffline?: string;
  }>();

  // --- STATE ---
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false); // <-- New State

  // --- REFS ---
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // --- MEMOS ---
  const snapPoints = useMemo(() => ["25%", "60%"], []);

  // --- EFFECTS (Logic) ---

  // 1. Ask for location permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      setHasLocationPermission(true);
    })();
  }, []);

  // 2. Fetch Route Data (Model interaction)
  useEffect(() => {
    if (!id) return;

    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        // --- THIS IS THE NEW LOGIC ---
        // 1. Check if it's saved locally regardless
        const isSaved = await checkIfRouteIsSaved(id);
        setIsDownloaded(isSaved);

        // 2. Fetch the full route data
        let data: Route | null = null;
        if (isOffline === "true") {
          data = await getLocalRouteById(id);
          if (!data) throw new Error("Route not found in local storage.");
        } else {
          // Still fetch from Supabase to ensure data is fresh
          const { data: supabaseData, error } = await supabase
            .from("routes")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          data = supabaseData as Route;
        }
        setRoute(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch route data.");
      } finally {
        setLoading(false);
      }
    }
    fetchRoute();
  }, [id, isOffline]);

  // --- CALLBACKS (Handlers) ---

  // 3. Center map on the route once it's loaded
  const onMapReady = useCallback(() => {
    if (route && route.route_data && mapRef.current) {
      mapRef.current.fitToCoordinates(route.route_data, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  // 4. Handle Download/Delete button press (TOGGLE)
  const handleToggleDownload = useCallback(async () => {
    if (!route) return;

    if (isDownloaded) {
      // It's already saved, so delete it
      try {
        await deleteLocalRouteById(route.id);
        setIsDownloaded(false);
        ToastAndroid.show("Route removed from local saves", ToastAndroid.SHORT);
      } catch (e: any) {
        console.error("Failed to delete route:", e.message);
        ToastAndroid.show("Failed to remove route", ToastAndroid.SHORT);
      }
    } else {
      // It's not saved, so download it
      try {
        await saveRouteLocally(route);
        setIsDownloaded(true);
        ToastAndroid.show("Route saved for offline use!", ToastAndroid.SHORT);
      } catch (e: any) {
        console.error("Failed to save route:", e.message);
        ToastAndroid.show("Failed to save route", ToastAndroid.SHORT);
      }
    }
  }, [route, isDownloaded]);

  // 5. Handle Start button press
  const handleStart = useCallback(() => {
    if (!route) return;
    console.log("Starting route...", route.id);
    // TODO: Implement navigation logic
  }, [route]);

  // --- RENDER (View) ---
  return (
    <RouteDetailView
      loading={loading}
      error={error}
      route={route}
      hasLocationPermission={hasLocationPermission}
      isDownloaded={isDownloaded} // <-- Pass new prop
      mapRef={mapRef}
      onMapReady={onMapReady}
      bottomSheetRef={bottomSheetRef}
      snapPoints={snapPoints}
      onToggleDownload={handleToggleDownload} // <-- Pass new handler
      onStart={handleStart}
    />
  );
}
