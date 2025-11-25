import React from "react";
import { StyleSheet, Platform, Pressable, View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Route } from "@/lib/database";

type RouteMapViewProps = {
  route: Route;
  hasLocationPermission: boolean;
  mapRef: React.RefObject<MapView>;
  onMapReady: () => void;
};

// Map style is co-located with the map component
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

// Helper functions for marker styling
const getMarkerIcon = (type: string) => {
  switch (type) {
    case "hazard":
      return "alert-circle";
    case "drop":
      return "arrow-down-bold-circle";
    case "viewpoint":
      return "camera";
    default:
      return "map-marker";
  }
};

const getMarkerColor = (type: string) => {
  switch (type) {
    case "hazard":
      return "#FF5A5A"; // Red
    case "drop":
      return "#FFA500"; // Orange
    case "viewpoint":
      return "#04FF0C"; // Green
    default:
      return "#FFFFFF";
  }
};

export function RouteMapView({
  route,
  hasLocationPermission,
  mapRef,
  onMapReady,
}: RouteMapViewProps) {
  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={hasLocationPermission}
        onMapReady={onMapReady}
        customMapStyle={Platform.OS === "android" ? darkMapStyle : undefined}
      >
        <Polyline
          coordinates={route.route_data}
          strokeColor="#04FF0C" // Bright green
          strokeWidth={5}
        />

        {/* Render Interest Points */}
        {route.interest_points?.map((point, index) => (
          <Marker
            // Use ID if available, otherwise fallback to index key
            key={point.id || index}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.type.toUpperCase()}
            description={point.note}
          >
            <View
              style={[
                styles.markerBase,
                { backgroundColor: getMarkerColor(point.type) },
              ]}
            >
              <MaterialCommunityIcons
                name={getMarkerIcon(point.type) as any}
                size={16}
                color="black"
              />
            </View>
          </Marker>
        ))}
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
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
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
  // Style for the custom marker bubble
  markerBase: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
});
