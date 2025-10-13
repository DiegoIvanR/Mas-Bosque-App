// app/(auth)/login.tsx
import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/auth";

export default function LoginScreen() {
  const { setIsLoggedIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button
        title="Log in"
        onPress={() => {
          setIsLoggedIn(true);
          router.replace("/"); // Go to tab navigator
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 4,
  },
});
