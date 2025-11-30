import { StyleSheet, Pressable, Platform, Animated, View } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Route } from "@/lib/database";
import * as Location from "expo-location";

type FollowMode = "none" | "center";
type TrackingMapViewProps = {
  routePolyline: Route["route_data"];
  interestPoints: Route["interest_points"] | null; // Added prop for Interest Points
  location: Location.LocationObject;
  heading: Location.HeadingObject;
  onExit: () => void;

  mapRef: MapView;
  followMode: FollowMode;
  setFollowMode: React.Dispatch<React.SetStateAction<FollowMode>>;
  handleManualMapChange: () => Promise<void>;
  remainingCoords: {
    latitude: number;
    longitude: number;
  }[];
  visitedCoords: {
    latitude: number;
    longitude: number;
  }[];
  getMarkerColor: (type: string) => string;
  getMarkerIcon: (type: string) => string;
  animatedIconStyle: {
    transform: {
      rotate: Animated.AnimatedInterpolation<string | number>;
    }[];
  };
  handleRecenterPress: () => void;
  getRecenterIcon: () => "locate" | undefined;
};

export function TrackingMapView({
  routePolyline,
  interestPoints,
  location,
  heading,
  onExit,

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
}: TrackingMapViewProps) {
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
                name={getMarkerIcon(point.type) as any} // Fixed incorrect prop
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
