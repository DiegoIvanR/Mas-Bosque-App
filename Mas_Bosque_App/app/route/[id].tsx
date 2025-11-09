import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// --- DEPENDENCIES FOR BOTTOM SHEET ---
// Don't forget to install: npx expo install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
// And add the reanimated plugin to babel.config.js
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// ------------------------------------

import { supabase } from "@/lib/SupabaseClient";
import { Route, getLocalRouteById } from "@/lib/database";

// Use the map style from your test screen for Android/Google Maps
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function RouteDetailScreen() {
  const { id, isOffline } = useLocalSearchParams<{
    id: string;
    isOffline?: string;
  }>();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const mapRef = useRef<MapView>(null);

  // --- Bottom Sheet Setup ---
  // This is the "peek" state and the "expanded" state you wanted.
  const snapPoints = useMemo(() => ["28%", "60%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  // 2. Fetch Route Data (Online or Offline)
  useEffect(() => {
    if (!id) return;

    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        let data: Route | null = null;

        if (isOffline === "true") {
          // --- OFFLINE LOGIC ---
          console.log("Fetching route from local database...");
          data = await getLocalRouteById(id);
          if (!data) {
            throw new Error("Route not found in local storage.");
          }
        } else {
          // --- ONLINE LOGIC ---
          console.log("Fetching route from Supabase...");
          const { data: supabaseData, error } = await supabase
            .from("routes")
            .select("*") // Select all columns, *including* route_data
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

  // 3. Center map on the route once it's loaded
  const onMapReady = () => {
    if (route && route.route_data && mapRef.current) {
      mapRef.current.fitToCoordinates(route.route_data, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  };

  // --- Main Render Logic ---

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error || !route) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Route not found."}</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    // This GestureHandlerRootView is required for @gorhom/bottom-sheet
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={hasLocationPermission}
        onMapReady={onMapReady}
        // Use custom style ONLY on Android (Google Maps)
        customMapStyle={Platform.OS === "android" ? darkMapStyle : undefined}
        // By NOT providing a 'region', the map will wait for 'fitToCoordinates'
      >
        <Polyline
          coordinates={route.route_data}
          strokeColor="#04FF0C" // Your app's bright green
          strokeWidth={5}
        />
      </MapView>

      {/* Floating Back Button */}
      <SafeAreaView style={styles.header}>
        <Pressable
          style={styles.backButtonCircle}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={24} color="white" />
        </Pressable>
      </SafeAreaView>

      {/* --- Bottom Sheet --- */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0} // Start at the first snap point (peek state)
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.routeTitle}>{route.name}</Text>
          <Text style={styles.routeLocation}>{route.location}</Text>
          <Text style={styles.routeInfo}>
            {`⭐ ${route.rating} · ${route.difficulty} · ${route.distance_km} km · Est. ${route.time_minutes} min`}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => {
                /* TODO: Implement Download Logic */
              }}
            >
              <Ionicons name="download-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Download</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.startButton]}
              onPress={() => {
                /* TODO: Implement Start Logic */
              }}
            >
              <Ionicons name="paper-plane-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          </View>

          {/* This is where your future content (comments, etc.) will go */}
          <View style={styles.expandedContent}>
            <Text style={styles.routeLocation}>
              More content appears when pulled up...
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

// --- STYLES ---
// (Based on your mockup and dark theme)

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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    color: "#FF5A5A",
    fontSize: 18,
    fontFamily: "Lato-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- Bottom Sheet Styles ---
  bottomSheetBackground: {
    backgroundColor: "#002A12", // Dark green from mockup
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#8E8E93",
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  routeTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Lato-Bold",
    marginBottom: 4,
  },
  routeLocation: {
    color: "#BDBDBD",
    fontSize: 16,
    fontFamily: "Lato-Regular", // Assuming you have this
    marginBottom: 12,
  },
  routeInfo: {
    color: "white",
    fontSize: 14,
    fontFamily: "Lato-Regular",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#04FF0C", // Bright green
    paddingVertical: 16,
    borderRadius: 100,
    gap: 10,
  },
  startButton: {
    backgroundColor: "rgba(120, 120, 128, 0.32)", // Grayish, from search bar
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "Lato-Bold",
  },
  expandedContent: {
    flex: 1, // Takes up remaining space
    paddingTop: 20,
    // This content will only be visible when the sheet is pulled up
  },
});
