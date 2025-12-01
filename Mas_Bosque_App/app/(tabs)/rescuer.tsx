import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useRescuerController } from "@/hooks/useRescuerController";
import RescuerMap from "@/components/Rescuer/RescuerMap";
import SOSDetailCard from "@/components/Rescuer/SOSDetailCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RescuerView() {
  const {
    sosList,
    loading,
    location,
    selectedSOS,
    handleMarkerPress,
    handleCloseModal,
    handleUpdateStatus,
    refreshData,
  } = useRescuerController();

  return (
    <View style={styles.container}>
      {/* Map Layer */}
      <RescuerMap
        sosList={sosList}
        userLocation={location}
        onMarkerPress={handleMarkerPress}
      />

      {/* Floating Refresh Button */}
      <SafeAreaView style={styles.refreshContainer} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Text style={styles.headerTitle}>Active SOS Signals</Text>
          {loading && <ActivityIndicator size="small" color="#fff" />}
        </View>

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

      {/* Detail Overlay */}
      {selectedSOS && (
        <SOSDetailCard
          sos={selectedSOS}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
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
    backgroundColor: "rgba(0,22,11, 0.6)",
    gap: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  rightControls: {
    alignItems: "flex-end",
    padding: 20,
    marginBottom: 20, // push up if needed
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});
