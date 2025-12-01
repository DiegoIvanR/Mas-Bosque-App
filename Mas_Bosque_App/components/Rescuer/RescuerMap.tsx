import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Removed PROVIDER_GOOGLE
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SOSRequest } from "@/models/SOSModel";
import * as Location from "expo-location";

type RescuerMapProps = {
  sosList: SOSRequest[];
  userLocation: Location.LocationObject | null;
  onMarkerPress: (sos: SOSRequest) => void;
};

export default function RescuerMap({
  sosList,
  userLocation,
  onMarkerPress,
}: RescuerMapProps) {
  const mapRef = useRef<MapView>(null);

  // Default fallback (Guadalajara) if no location yet
  const defaultRegion = {
    latitude: 20.659698,
    longitude: -103.349609,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // 1. Animate to user location when it becomes available
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        zoom: 15, // Closer zoom for rescuer
      });
    }
  }, [userLocation]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      // Use the user location if ready, otherwise default
      initialRegion={
        userLocation
          ? {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
          : defaultRegion
      }
      showsUserLocation={true}
      showsCompass={true}
    >
      {sosList.map((sos) => {
        const isPending = sos.estado === "pending";
        // Red for pending, Yellow for processing
        const pinColor = isPending ? "#FF5A5A" : "#FFD700";

        return (
          <Marker
            key={sos.id}
            coordinate={{
              latitude: sos.latitud,
              longitude: sos.longitud,
            }}
            onPress={() => onMarkerPress(sos)}
          >
            <View style={[styles.markerBase, { backgroundColor: pinColor }]}>
              <MaterialCommunityIcons
                name="alert-octagon"
                size={20}
                color="black"
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject, // Ensures map fills the container
  },
  markerBase: {
    padding: 6,
    borderRadius: 20,
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
