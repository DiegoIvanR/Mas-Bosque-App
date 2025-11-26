import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { Route } from "@/lib/database";
import { TrackingState } from "@/lib/useTrackingSession";
import { TrackingMapView } from "./TrackingMapView";
import { TrackingStatsOverlay } from "../TrackingStatsOverlay";
import { useSOSController } from "@/hooks/useSOSController";
import SOSConfirmation from "@/app/(sos)/SOSConfirmation";
type TrackingViewProps = {
  loading: boolean;
  error: string | null;
  routePolyline: Route["route_data"] | null;
  interestPoints: Route["interest_points"] | null;
  sessionState: TrackingState;
  onExit: () => void;
  onSOS: () => void;
};

export function TrackingView({
  loading,
  error,
  routePolyline,
  interestPoints,
  sessionState,
  onExit,
  onSOS,
}: TrackingViewProps) {
  // Handle loading the polyline
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Route...</Text>
      </View>
    );
  }

  // Handle error loading polyline
  if (error || !routePolyline) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Could not load route."}</Text>
      </View>
    );
  }

  // Handle waiting for first location fix
  if (!sessionState.location || !sessionState.heading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Acquiring GPS Signal...</Text>
      </View>
    );
  }

  // Success: Render the session
  return (
    <View style={styles.container}>
      <TrackingMapView
        routePolyline={routePolyline}
        interestPoints={interestPoints}
        location={sessionState.location}
        heading={sessionState.heading}
        onExit={onExit}
      />
      <TrackingStatsOverlay
        elapsedTime={sessionState.elapsedTime}
        distanceTraveled={sessionState.distanceTraveled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#00160B",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
  },
  errorText: {
    color: "#FF5A5A",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
