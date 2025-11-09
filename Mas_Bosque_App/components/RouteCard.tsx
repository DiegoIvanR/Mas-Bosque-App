import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // <-- Import icons
import { Route } from "@/lib/database";
import { router } from "expo-router";

type RoutePreview = Omit<Route, "route_data">;

export default function RouteCard({ route }: { route: RoutePreview }) {
  const handlePress = () => {
    router.push(`/route/${route.id}`);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: route.image_url || "https://via.placeholder.com/300" }}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{route.name}</Text>
        <Text style={styles.cardSubtitle}>{route.location}</Text>
        <View style={styles.cardInfoRow}>
          <View style={styles.cardInfoRow}>
            <MaterialIcons name="star" size={14} color="#A0A0A0" />
            {/* gray star */}
            <Text style={styles.cardInfoText}>
              {route.rating} · {route.difficulty} · {route.distance_km} km
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    justifyContent: "center",
    width: 334,
    margin: "auto",
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 250,
  },
  cardContent: {},
  cardTitle: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#fff",
    textAlign: "left",
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#676767",
    textAlign: "left",
    marginBottom: 5,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfoText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Lato-Light",
    color: "#676767",
    textAlign: "left",
  },
});
