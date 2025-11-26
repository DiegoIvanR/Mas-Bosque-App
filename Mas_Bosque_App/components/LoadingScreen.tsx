import { View, ActivityIndicator, StyleSheet } from "react-native";
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
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
  },
});
