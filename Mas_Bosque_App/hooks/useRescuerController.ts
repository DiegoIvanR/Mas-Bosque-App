import { useState, useEffect, useCallback } from "react";
import { SOSModel, SOSRequest } from "@/models/SOSModel";
import * as Location from "expo-location";

export function useRescuerController() {
  const [sosList, setSosList] = useState<SOSRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSOS, setSelectedSOS] = useState<SOSRequest | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await SOSModel.fetchActiveSOS();
      setSosList(data);
    } catch (error) {
      console.error("Error fetching SOS:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (e) {
      console.log("Error getting rescuer location", e);
    }
  };

  useEffect(() => {
    loadData();
    getCurrentLocation();

    // Optional: Set up an interval to refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerPress = (sos: SOSRequest) => {
    setSelectedSOS(sos);
  };

  const handleCloseModal = () => {
    setSelectedSOS(null);
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: "processing" | "attended"
  ) => {
    try {
      setLoading(true);
      await SOSModel.updateSOSStatus(id, newStatus);

      // Close modal if it becomes 'attended' (removed from map)
      if (newStatus === "attended") {
        setSelectedSOS(null);
      } else {
        // If changing to processing, update the local selected object so UI updates immediately
        setSelectedSOS((prev) =>
          prev ? { ...prev, estado: newStatus } : null
        );
      }

      // Refresh the map data to remove the pin or change color
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return {
    sosList,
    loading,
    location,
    selectedSOS,
    refreshData: loadData,
    handleMarkerPress,
    handleCloseModal,
    handleUpdateStatus,
  };
}
