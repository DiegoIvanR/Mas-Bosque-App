import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Route } from "@/lib/database";
import { RouteMapView } from "./RouteMapView";
import { RouteBottomSheet } from "./RouteBottomSheet";

type RouteDetailViewProps = {
  loading: boolean;
  error: string | null;
  route: Route | null;
  hasLocationPermission: boolean;
  isDownloaded: boolean; // <-- Add new prop
  mapRef: React.RefObject<MapView>;
  onMapReady: () => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  onToggleDownload: () => void; // <-- Update prop name
  onStart: () => void;
};

export function RouteDetailView({
  loading,
  error,
  route,
  hasLocationPermission,
  isDownloaded, // <-- Get new prop
  mapRef,
  onMapReady,
  bottomSheetRef,
  snapPoints,
  onToggleDownload, // <-- Get new handler
  onStart,
}: RouteDetailViewProps) {
  // 1. Handle Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // 2. Handle Error or Missing Route State
  if (error || !route) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Route not found."}</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // 3. Handle Success State
  return (
    <GestureHandlerRootView style={styles.container}>
      <RouteMapView
        route={route}
        hasLocationPermission={hasLocationPermission}
        mapRef={mapRef}
        onMapReady={onMapReady}
      />
      <RouteBottomSheet
        route={route}
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        isDownloaded={isDownloaded} // <-- Pass prop down
        onToggleDownload={onToggleDownload} // <-- Pass handler down
        onStart={onStart}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
    padding: 20,
  },
  errorText: {
    color: "#FF5A5A",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "rgba(120, 120, 128, 0.32)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Lato-Bold",
  },
});
