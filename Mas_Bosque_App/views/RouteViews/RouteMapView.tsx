import React from "react";
import { StyleSheet, Platform, Pressable, View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";

type RouteMapViewProps = {
  route: Route;
  hasLocationPermission: boolean;
  mapRef: React.RefObject<MapView>;
  onMapReady: () => void;
  darkMapStyle: any;
  getMarkerColor: (type: string) => string;
  getMarkerIcon: (type: string) => string;
  goBack: () => void;
};

export function RouteMapView({
  route,
  hasLocationPermission,
  mapRef,
  onMapReady,
  darkMapStyle,
  getMarkerColor,
  getMarkerIcon,
  goBack,
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
        <Pressable style={styles.backButtonCircle} onPress={goBack}>
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
