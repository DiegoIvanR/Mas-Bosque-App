import {useState, useEffect} from "react";
import {useRouter} from "expo-router"; // Import Router
import {SOSModel, SOSRequest} from "@/models/SOSModel";
import * as Location from "expo-location";

export function useRescuerController() {
    const router = useRouter(); // Initialize Router
    const [sosList, setSosList] = useState<SOSRequest[]>([]);
    const [loading, setLoading] = useState(true);
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
            const {status} = await Location.requestForegroundPermissionsAsync();
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
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkerPress = (sos: SOSRequest) => {
        // This triggers the smooth modal transition

        if (!sos.id || !/^[a-zA-Z0-9_-]+$/.test(sos.id)) {
            console.warn("Invalid SOS ID", sos);
            return;
        }

        router.push({
            pathname: "/sos-detail",
            params: {id: sos.id},
        });
    };

    /*const handleCloseModal = () => {
      setSelectedSOS(null);
    };*/

    const handleUpdateStatus = async (
        id: string,
        newStatus: "processing" | "attended"
    ) => {
        try {
            await SOSModel.updateSOSStatus(id, newStatus);
            await loadData(); // Refresh list in background
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    return {
        sosList,
        loading,
        location,
        refreshData: loadData,
        handleMarkerPress,
        handleUpdateStatus,
    };
}
