import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Pressable, Platform, Animated } from "react-native";
import MapView, {
  Polyline,
  Marker,
  AnimatedRegion,
  Camera, // <-- Import Camera type
} from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import * as Location from "expo-location";

type TrackingMapViewProps = {
  routePolyline: Route["route_data"];
  location: Location.LocationObject;
  heading: Location.HeadingObject;
  onExit: () => void;
};

type FollowMode = "none" | "center";

export function TrackingMapView({
  routePolyline,
  location,
  heading,
  onExit,
}: TrackingMapViewProps) {
  const mapRef = useRef<MapView>(null);
  const [followMode, setFollowMode] = useState<FollowMode>("center");
  const [mapHeading, setMapHeading] = useState(0);
  const animatedIconRotation = useRef(new Animated.Value(0)).current;

  // --- 1. DEFINE A SHARED DURATION ---
  // Both map and icon will use this for synchronized, snappy animations
  const ANIMATION_DURATION = 300;

  // --- 2. UPDATE CAMERA EFFECT ---
  useEffect(() => {
    if (!location || !mapRef.current || followMode === "none") return;
    const cameraConfig = Platform.select({
      ios: { altitude: 600 },
      android: { zoom: 17 },
    });

    let targetMapHeading = 0;

    if (followMode === "center") {
      // 'center' mode
      targetMapHeading = 0;
      mapRef.current.animateCamera(
        {
          center: location.coords,
          pitch: 0,
          heading: targetMapHeading,
          ...cameraConfig,
        },
        { duration: ANIMATION_DURATION } // <-- USE SHARED DURATION
      );
    }

    setMapHeading(targetMapHeading);
  }, [location, heading, followMode]);

  // --- 3. UPDATE ICON ROTATION EFFECT ---
  useEffect(() => {
    if (heading && heading.trueHeading !== null) {
      const trueNorth = heading.trueHeading;
      const currentMapRotation = mapHeading;
      const iconOffset = -45;

      const targetRotation = trueNorth - currentMapRotation + iconOffset;

      Animated.timing(animatedIconRotation, {
        toValue: targetRotation,
        duration: ANIMATION_DURATION, // <-- USE SHARED DURATION
        useNativeDriver: false,
      }).start();
    }
  }, [heading, mapHeading]);

  // --- 4. NEW HANDLER for manual map changes ---
  const handleManualMapChange = async () => {
    if (followMode === "none" && mapRef.current) {
      try {
        const camera = await mapRef.current.getCamera();
        setMapHeading(camera.heading);
      } catch (e) {
        console.error("Failed to get camera heading", e);
      }
    }
  };

  const handleRecenterPress = () => {
    if (followMode === "none") {
      setFollowMode("center");
    } else if (followMode === "center") {
      setFollowMode("none");
    }
  };

  const getRecenterIcon = () => {
    if (followMode === "none") return "locate";
    if (followMode === "center") return "locate";
  };

  const animatedIconStyle = {
    transform: [
      {
        rotate: animatedIconRotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <>
      <MapView.Animated
        ref={mapRef}
        style={styles.map}
        showsUserLocation={false}
        showsCompass={true}
        onPanDrag={() => {
          if (followMode !== "none") {
            setFollowMode("none");
          }
        }}
        onRegionChangeComplete={handleManualMapChange}
      >
        <Polyline
          coordinates={routePolyline}
          strokeColor="#04FF0C"
          strokeWidth={5}
        />

        <Marker.Animated
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={location.coords}
        >
          <Animated.View style={animatedIconStyle}>
            <Ionicons
              name="navigate"
              size={40}
              color="#0099FF"
              style={styles.markerIcon}
            />
          </Animated.View>
        </Marker.Animated>
      </MapView.Animated>

      {/* Top Left Button (Exit) */}
      <SafeAreaView style={styles.header}>
        <Pressable style={styles.iconButton} onPress={onExit}>
          <Ionicons name="chevron-down" size={24} color="white" />
        </Pressable>
      </SafeAreaView>

      {/* Recenter Button */}
      <SafeAreaView style={styles.recenterButtonContainer}>
        <Pressable
          style={[
            styles.iconButton,
            followMode !== "none" && styles.iconButtonActive,
          ]}
          onPress={handleRecenterPress}
        >
          <Ionicons
            name={getRecenterIcon()}
            size={24}
            color={followMode !== "none" ? "black" : "white"}
          />
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
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonActive: {
    backgroundColor: "#FFFFFF", // White when active
  },
  recenterButtonContainer: {
    position: "absolute",
    bottom: 180, // Position it above the stats overlay
    right: 20,
    zIndex: 10,
  },
  markerIcon: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
