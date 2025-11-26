import React, { useRef, useState, useEffect, useMemo } from "react";
import { StyleSheet, Pressable, Platform, Animated, View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import * as Location from "expo-location";

// --- HELPER: Simple Haversine Distance ---
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Helper functions for marker styling (Consistent with RouteMapView)
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

type TrackingMapViewProps = {
  routePolyline: Route["route_data"];
  interestPoints: Route["interest_points"] | null; // Added prop for Interest Points
  location: Location.LocationObject;
  heading: Location.HeadingObject;
  onExit: () => void;
};

type FollowMode = "none" | "center";

export function TrackingMapView({
  routePolyline,
  interestPoints,
  location,
  heading,
  onExit,
}: TrackingMapViewProps) {
  const mapRef = useRef<MapView>(null);
  const [followMode, setFollowMode] = useState<FollowMode>("center");
  const [mapHeading, setMapHeading] = useState(0);
  const animatedIconRotation = useRef(new Animated.Value(0)).current;

  const ANIMATION_DURATION = 300;

  // --- Calculate Route Progress ---
  const { visitedCoords, remainingCoords } = useMemo(() => {
    if (!location || !routePolyline || routePolyline.length === 0) {
      return { visitedCoords: [], remainingCoords: routePolyline || [] };
    }

    let minDistance = Infinity;
    let closestIndex = 0;

    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    for (let i = 0; i < routePolyline.length; i++) {
      const p = routePolyline[i];
      const dist = getDistanceFromLatLonInMeters(
        userLat,
        userLon,
        p.latitude,
        p.longitude
      );

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    const visited = routePolyline.slice(0, closestIndex + 1);
    const remaining = routePolyline.slice(closestIndex);

    return { visitedCoords: visited, remainingCoords: remaining };
  }, [location, routePolyline]);

  // --- EXISTING EFFECTS ---
  useEffect(() => {
    if (!location || !mapRef.current || followMode === "none") return;
    const cameraConfig = Platform.select({
      ios: { altitude: 600 },
      android: { zoom: 17 },
    });

    let targetMapHeading = 0;

    if (followMode === "center") {
      targetMapHeading = 0;
      mapRef.current.animateCamera(
        {
          center: location.coords,
          pitch: 0,
          heading: targetMapHeading,
          ...cameraConfig,
        },
        { duration: ANIMATION_DURATION }
      );
    }
    setMapHeading(targetMapHeading);
  }, [location, heading, followMode]);

  useEffect(() => {
    if (heading && heading.trueHeading !== null) {
      const trueNorth = heading.trueHeading;
      const currentMapRotation = mapHeading;
      const iconOffset = -45;
      const targetRotation = trueNorth - currentMapRotation + iconOffset;

      Animated.timing(animatedIconRotation, {
        toValue: targetRotation,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start();
    }
  }, [heading, mapHeading]);

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
        {/* Remaining Path */}
        <Polyline
          coordinates={remainingCoords}
          strokeColor="rgba(4, 255, 12, 0.4)"
          strokeWidth={5}
          zIndex={1}
        />

        {/* Visited Path */}
        <Polyline
          coordinates={visitedCoords}
          strokeColor="#FF5A5A"
          strokeWidth={5}
          zIndex={2}
        />

        {/* Interest Points Markers */}
        {interestPoints?.map((point, index) => (
          <Marker
            key={point.id || index}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.type.toUpperCase()}
            description={point.note}
            zIndex={4}
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

        {/* User Marker */}
        <Marker.Animated
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={location.coords}
          zIndex={3}
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
    backgroundColor: "#FFFFFF",
  },
  recenterButtonContainer: {
    position: "absolute",
    bottom: 180,
    right: 20,
    zIndex: 0,
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
