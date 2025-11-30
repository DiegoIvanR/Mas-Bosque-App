import { useRef, useEffect } from "react";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Logger from "@/utils/Logger"; // Import Logger

export default function useRecordingMapController(
  currentLocation: Location.LocationObject | null,
  heading: Location.HeadingData | null
) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      // We do not log here to avoid spamming logs on every location update
      mapRef.current.animateCamera({
        center: currentLocation.coords,
        heading: heading?.trueHeading || 0,
        pitch: 0,
        zoom: 17,
      });
    }
  }, [currentLocation]);

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
        return "#FF5A5A";
      case "drop":
        return "#FFA500";
      case "viewpoint":
        return "#04FF0C";
      default:
        return "#FFFFFF";
    }
  };

  return { mapRef, getMarkerIcon, getMarkerColor };
}
