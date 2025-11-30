import { useTrackingMapController } from "@/hooks/trackingMapController";
import { Route } from "@/lib/database";
import * as Location from "expo-location";
import { TrackingMapView } from "../../views/TrackingViews/TrackingMapView";

type TrackingMapProps = {
  routePolyline: Route["route_data"];
  interestPoints: Route["interest_points"] | null; // Added prop for Interest Points
  location: Location.LocationObject;
  heading: Location.HeadingObject;
  onExit: () => void;
};
export default function TrackingMap({
  routePolyline,
  interestPoints,
  location,
  heading,
  onExit,
}: TrackingMapProps) {
  const {
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
  } = useTrackingMapController(routePolyline, location, heading);
  return (
    <TrackingMapView
      routePolyline={routePolyline}
      interestPoints={interestPoints}
      location={location}
      heading={heading}
      onExit={onExit}
      mapRef={mapRef}
      followMode={followMode}
      setFollowMode={setFollowMode}
      handleManualMapChange={handleManualMapChange}
      remainingCoords={remainingCoords}
      visitedCoords={visitedCoords}
      getMarkerColor={getMarkerColor}
      getMarkerIcon={getMarkerIcon} // Fixed incorrect prop assignment
      animatedIconStyle={animatedIconStyle}
      handleRecenterPress={handleRecenterPress}
      getRecenterIcon={getRecenterIcon}
    />
  );
}
