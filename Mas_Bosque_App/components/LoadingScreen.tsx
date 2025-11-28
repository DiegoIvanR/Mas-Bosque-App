import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

export function LoadingLocation() {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.loadingText}>Acquiring GPS Signal...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 0.6, // ensures ScrollView content expands properly
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 35,
    backgroundColor: "#00160B",
    height: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
  },
});
