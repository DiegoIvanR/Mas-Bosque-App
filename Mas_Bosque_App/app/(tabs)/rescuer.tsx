import React from "react";
import { useRescuerController } from "@/hooks/useRescuerController";
import RescuerView from "@/views/rescuerView";

export default function Rescuer() {
  const { sosList, loading, location, handleMarkerPress, refreshData } =
    useRescuerController();
  return (
    <RescuerView
      sosList={sosList}
      location={location}
      handleMarkerPress={handleMarkerPress}
      refreshData={refreshData}
    />
  );
}
