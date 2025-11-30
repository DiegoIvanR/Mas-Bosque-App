import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import Button from "@/components/Helpers/Button";
import InitialsAvatar from "@/components/Helpers/InitialsAvatar";
import { UserDataType } from "@/models/profileModel";
type ProfileViewProps = {
  user: UserDataType | null;
  loading: boolean;
  handleLogOut: () => void;
  handleEditProfile: () => void;
};

export default function ProfileView({
  user,
  loading,
  handleLogOut,
  handleEditProfile,
}: ProfileViewProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Content (Image & Name) */}
        <View style={styles.topContent}>
          {/* Profile Image */}
          <View style={styles.avatarWrapper}>
            <InitialsAvatar
              name={user?.first_name + " " + user?.last_name}
              size={150}
            />
          </View>

          {/* Name */}
          <Text style={styles.name}>
            {user?.first_name + " " + user?.last_name}
          </Text>
        </View>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Edit (profile) */}
          <Button
            value="Edit profile"
            onClick={handleEditProfile}
            backgroundColor="#1B251F"
            textColor="#FFF"
            style={styles.button}
          />

          {/* Logout */}
          <Button
            value={loading ? "Logging out..." : "Log Out"}
            onClick={handleLogOut}
            backgroundColor="#1B251F"
            textColor="#FFF"
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  container: {
    flex: 1,
    // *** CHANGE: Distribute space between the top content and the buttons
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40, // *** ADDED: Space from the bottom edge
  },

  // *** NEW STYLE: To group the image and name together
  topContent: {
    alignItems: "center",
  },

  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "#333",
    marginBottom: 30, // More space above the name
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 36,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    color: "#fff",
    // Removed original marginBottom as the container spacing is now managing vertical space
    textAlign: "center",
  },

  // *** NEW STYLE: To group and align the buttons
  buttonsContainer: {
    width: "100%", // Use full width to center buttons
    alignItems: "center", // Center the buttons horizontally
    // A dedicated container helps manage the spacing for the button group
  },

  button: {
    width: "80%",
    marginBottom: 10, // *** INCREASED: Space between buttons for better separation
  },
});
