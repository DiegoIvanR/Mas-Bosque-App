import { View, Text, StyleSheet } from "react-native";
type ErrorScreenProps = {
  error: string;
};
export default function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  centerContainer: {
    // Reuse this for the spinner area
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00160B",
    height: "100%",
  },
  errorText: {
    color: "#8E8E93",
    fontSize: 16,
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
});
