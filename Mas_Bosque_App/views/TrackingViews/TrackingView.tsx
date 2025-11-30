import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { Route } from "@/lib/database";
import { TrackingState } from "@/lib/useTrackingSession";
import TrackingMap from "../../components/Tracking/TrackingMap";
import { TrackingStatsOverlay } from "../../components/TrackingStatsOverlay";

type TrackingViewProps = {
  routePolyline: Route["route_data"];
  interestPoints: Route["interest_points"] | null;
  sessionState: TrackingState;
  onExit: () => void;
};

export function TrackingView({
  routePolyline,
  interestPoints,
  sessionState,
  onExit,
}: TrackingViewProps) {
  // Success: Render the session
  return (
    <View style={styles.container}>
      <TrackingMap
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
