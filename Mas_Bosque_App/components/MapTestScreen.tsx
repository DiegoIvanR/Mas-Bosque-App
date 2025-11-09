import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// This is a custom map style for a dark, minimalist look
// You can find more on sites like Snazzy Maps
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

export default function MapTestScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1. Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // 2. Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  // 3. Create a region to focus the map
  const [region, setRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  // 4. Handle loading and error states
  let content = <ActivityIndicator size="large" color="#FFFFFF" />;

  if (errorMsg) {
    content = <Text style={styles.errorText}>{errorMsg}</Text>;
  } else if (location && region) {
    content = (
      // This is the NEW, free way
      <MapView
        style={styles.map}
        // By REMOVING the 'provider' prop, iOS defaults to Apple Maps (Free)
        // By REMOVING 'customMapStyle', we avoid an error (Apple Maps doesn't support it)
        showsUserLocation={true}
        region={region}
        // When you build Step 4, you'll just add the Polyline here
        // <Polyline coordinates={route.route_data} strokeColor="#FF0000" strokeWidth={3} />
      />
    );
  }

  return (
    <View style={styles.container}>
      {content}

      {/* 5. Add a floating Go Back button */}
      <SafeAreaView style={styles.header}></SafeAreaView>

      {/* 6. Add a placeholder for the bottom overlay from your mockup */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.text}>Route Go Here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B", // Dark background for loading
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make the map fill the screen
  },
  errorText: {
    color: "#FF5A5A",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  header: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00160B",
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
});
