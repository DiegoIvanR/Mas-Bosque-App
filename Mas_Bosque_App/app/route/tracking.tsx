import React, { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Route } from "@/lib/database";
import { useTrackingSession } from "@/lib/useTrackingSession";
import { TrackingView } from "@/views/TrackingViews/TrackingView";
import { fetchRouteSupabase } from "@/models/routesModel";
import LoadingScreen, { LoadingLocation } from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
// --- CONTROLLER ---
export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // State for data fetching
  const [routePolyline, setRoutePolyline] = useState<
    Route["route_data"] | null
  >(null);
  const [interestPoints, setInterestPoints] = useState<
    Route["interest_points"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Model: Initialize the tracking session hook
  const sessionState = useTrackingSession();

  // Effect: Fetch the route polyline (Model interaction)
  useEffect(() => {
    if (!id) {
      setError("No route ID provided.");
      setLoading(false);
      return;
    }

    async function fetchPolyline() {
      setLoading(true);
      setError(null);
      try {
        // Only fetch the coordinates to save bandwidth
        const data = await fetchRouteSupabase(id);

        if (!data || !data.route_data) throw new Error("Route data not found.");

        setRoutePolyline(data.route_data);
        setInterestPoints(data.interest_points);
      } catch (e: any) {
        setError(e.message || "Failed to fetch route polyline.");
      } finally {
        setLoading(false);
      }
    }

    fetchPolyline();
  }, [id]);

  // Handlers
  const handleExitSession = useCallback(() => {
    sessionState.stopSession(); // Stop listeners
    router.back(); // Go back to the route detail screen
  }, [sessionState]);

  const handleSOS = useCallback(() => {
    // Placeholder as requested
    console.log("SOS Button Pressed!");
    // TODO: Implement SOS logic
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }

  // Handle error loading polyline
  if (error || !routePolyline) {
    return <ErrorScreen error={error} />;
  }
  // Handle waiting for first location fix
  if (!sessionState.location || !sessionState.heading) {
    return <LoadingLocation />;
  }

  // --- RENDER (View) ---
  return (
    <TrackingView
      routePolyline={routePolyline}
      interestPoints={interestPoints}
      sessionState={sessionState}
      onExit={handleExitSession}
    />
  );
}
