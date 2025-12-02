import React from "react";
import { StyleSheet, View } from "react-native";
import RescuerMap from "@/components/Rescuer/RescuerMap";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SOSRequest } from "@/models/SOSModel";
interface RescuerViewProps {
  sosList: any[]; // or your specific SOS type
  location: { latitude: number; longitude: number } | null;
  handleMarkerPress: (sos: SOSRequest) => void;
  refreshData: () => void;
}

export default function RescuerView({
  sosList,
  location,
  handleMarkerPress,
  refreshData,
}: RescuerViewProps) {
  return (
    <View style={styles.container}>
      {/* Map Layer */}
      <RescuerMap
        sosList={sosList}
        userLocation={location}
        onMarkerPress={(sos) => handleMarkerPress(sos)}
      />

      {/* Floating Refresh Button */}
      <SafeAreaView style={styles.refreshContainer} pointerEvents="box-none">
        <View style={styles.rightControls}>
          <Ionicons
            name="refresh-circle"
            size={50}
            color="#06D23C"
            onPress={refreshData}
            style={styles.shadow}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  refreshContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  rightControls: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});
