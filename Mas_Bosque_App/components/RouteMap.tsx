import React from "react";
import MapView from "react-native-maps";

import { Route } from "@/lib/database";
import { routeMapHelperFunctions } from "@/hooks/routeMapHelperFunctions";
import { RouteMapView } from "@/views/RouteViews/RouteMapView";

type RouteMapProps = {
  route: Route;
  hasLocationPermission: boolean;
  mapRef: React.RefObject<MapView>;
  onMapReady: () => void;
};
export default function RouteMap({
  route,
  hasLocationPermission,
  mapRef,
  onMapReady,
}: RouteMapProps) {
  const { darkMapStyle, getMarkerColor, getMarkerIcon, goBack } =
    routeMapHelperFunctions();
  return (
    <RouteMapView
      route={route}
      hasLocationPermission={hasLocationPermission}
      mapRef={mapRef}
      onMapReady={onMapReady}
      darkMapStyle={darkMapStyle}
      getMarkerColor={getMarkerColor}
      getMarkerIcon={getMarkerIcon}
      goBack={goBack}
    />
  );
}
