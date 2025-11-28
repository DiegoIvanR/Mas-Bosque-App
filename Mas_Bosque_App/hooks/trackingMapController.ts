import { useRef, useState, useEffect, useMemo } from "react";
import { Platform, Animated } from "react-native";
import MapView from "react-native-maps";
import { Route } from "@/lib/database";
import * as Location from "expo-location";

export function useTrackingMapController(
  routePolyline: Route["route_data"],
  location: Location.LocationObject,
  heading: Location.HeadingObject
) {
  type FollowMode = "none" | "center";
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
        useNativeDriver: true, // Fixed warning PONER FALSE?
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
  useEffect(() => {
    setFollowMode(followMode);
  }, [followMode]);
  return {
    mapRef,
    followMode,
    setFollowMode,
    handleManualMapChange,
    remainingCoords,
    visitedCoords,
    getMarkerColor,
    getMarkerIcon,
    animatedIconStyle,
    handleRecenterPress,
    getRecenterIcon,
  };
}
