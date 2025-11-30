import { InterestPoint } from "@/lib/database";
import * as Location from "expo-location";
import useRecordingMapController from "@/hooks/recordingMapController";
import { RecordingMapView } from "../../views/RecordingViews/RecordingMapView";
type RecordingMapViewProps = {
  routePath: { latitude: number; longitude: number }[];
  interestPoints: InterestPoint[];
  currentLocation: Location.LocationObject | null;
  heading: Location.HeadingData | null;
};

export function RecordingMap({
  routePath,
  interestPoints,
  currentLocation,
  heading,
}: RecordingMapViewProps) {
  const { mapRef, getMarkerIcon, getMarkerColor } = useRecordingMapController(
    currentLocation,
    heading
  );
  return (
    <RecordingMapView
      routePath={routePath}
      interestPoints={interestPoints}
      currentLocation={currentLocation}
      heading={heading}
      mapRef={mapRef}
      getMarkerColor={getMarkerColor}
      getMarkerIcon={getMarkerIcon}
    />
  );
}
