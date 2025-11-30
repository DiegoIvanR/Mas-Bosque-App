import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { InterestPoint } from "@/lib/database";
import * as Location from "expo-location";

type RecordingMapViewProps = {
  routePath: { latitude: number; longitude: number }[];
  interestPoints: InterestPoint[];
  currentLocation: Location.LocationObject | null;
  heading: Location.HeadingData | null;
  mapRef: MapView;
  getMarkerIcon: (
    type: string
  ) => "camera" | "alert-circle" | "map-marker" | "arrow-down-bold-circle";
  getMarkerColor: (
    type: string
  ) => "#04FF0C" | "#FF5A5A" | "#FFA500" | "#FFFFFF";
};

export function RecordingMapView({
  routePath,
  interestPoints,
  currentLocation,
  heading,
  mapRef,
  getMarkerIcon,
  getMarkerColor,
}: RecordingMapViewProps) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation={true}
      showsCompass={false}
      userInterfaceStyle="dark"
    >
      <Polyline coordinates={routePath} strokeColor="#04FF0C" strokeWidth={5} />

      {interestPoints.map((point, index) => (
        <Marker
          // Use point.id if available (after save), otherwise fallback to index + coordinates
          key={point.id || `${index}-${point.latitude}`}
          coordinate={{ latitude: point.latitude, longitude: point.longitude }}
          title={point.type.toUpperCase()}
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
  );
}

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
  markerBase: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
