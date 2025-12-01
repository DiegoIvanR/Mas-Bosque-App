import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SOSModel, SOSRequest } from "@/models/SOSModel";
import SOSDetailCard from "@/components/Rescuer/SOSDetailCard";
import { useRescuerController } from "@/hooks/useRescuerController";

export default function SOSDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sos, setSos] = useState<SOSRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const { handleUpdateStatus } = useRescuerController();

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await SOSModel.fetchSOSById(id);
      setSos(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleClose = () => {
    router.back();
  };

  const onUpdate = async (id: string, status: "processing" | "attended") => {
    await handleUpdateStatus(id, status);
    if (status === "attended") {
      router.back();
    } else {
      const updated = await SOSModel.fetchSOSById(id);
      setSos(updated);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06D23C" />
      </View>
    );
  }

  if (!sos) return null;

  return (
    <View style={styles.container}>
      {/* Set Status Bar to light so we can see it over dark bg */}
      <StatusBar barStyle="light-content" />
      <SOSDetailCard
        sos={sos}
        onClose={handleClose}
        onUpdateStatus={onUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
  },
  container: {
    flex: 1,
    backgroundColor: "#00160B", // Full screen dark background
  },
});
