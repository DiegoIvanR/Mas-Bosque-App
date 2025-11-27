// view.tsx
import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RoutePreview } from "@/models/routeCardModel";

interface Props {
  route: RoutePreview;
  isSaved: boolean;
  onPressCard: () => void;
  onToggleSave: (e: any) => void;
}

export function RouteCardView({
  route,
  isSaved,
  onPressCard,
  onToggleSave,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPressCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: route.image_url || "https://via.placeholder.com/300" }}
          style={styles.cardImage}
        />

        {/* Bookmark Overlay */}
        <Pressable
          style={styles.bookmarkButton}
          onPress={onToggleSave}
          hitSlop={10}
        >
          <View style={styles.bookmarkBackground}>
            <MaterialIcons
              name={isSaved ? "bookmark" : "bookmark-border"}
              size={24}
              color="#FFFFFF"
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{route.name}</Text>
        <Text style={styles.cardSubtitle}>{route.location}</Text>

        <View style={styles.cardInfoRow}>
          <MaterialIcons name="star" size={14} color="#A0A0A0" />
          <Text style={styles.cardInfoText}>
            {route.rating} · {route.difficulty} · {route.distance_km} km
          </Text>
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
    marginBottom: 24,
  },
  imageContainer: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 250,
  },
  bookmarkBackground: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
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
    color: "#676767",
    marginBottom: 5,
    textAlign: "left",
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardInfoText: {
    fontSize: 14,
    color: "#676767",
    textAlign: "left",
  },
});
