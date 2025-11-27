import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditListItem from "./EditListItem";
import { userData } from "@/models/signUpModel";
import { UserDataType } from "@/models/profileModel";
import { ContactDataType } from "@/models/editProfileModel";

type EditViewProps = {
  user: UserDataType | null;
  contact: ContactDataType | null;
  handleGoBack: () => void;
  handleEditName: () => void;
  handleChangePassword: () => void;
  handleEditConditions: () => void;
  handleEditContact: () => void;
};
export default function EditView({
  user,
  contact,
  handleGoBack,
  handleEditName,
  handleChangePassword,
  handleEditConditions,
  handleEditContact,
}: EditViewProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.header}>Edit profile</Text>

      <View style={styles.infoCard}>
        {/*<EditListItem label="Email" value={user.email} onPress={handleEditEmail}/>*/}
        <EditListItem
          label="Name"
          value={user?.first_name + " " + user?.last_name}
          onPress={handleEditName}
        />
        <EditListItem
          label="Password"
          value="Change password"
          onPress={handleChangePassword}
        />
        <EditListItem
          label="Medical conditions"
          value="Edit my conditions"
          onPress={handleEditConditions}
        />
        <EditListItem
          label="Emergency contact"
          value={contact?.name + " " + contact?.last_name}
          onPress={handleEditContact}
          isLast
        />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00160A",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 100,
  } as ViewStyle,
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 20,
  } as ViewStyle,
  header: {
    fontSize: 18,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    color: "white",
    marginBottom: 30,
  } as TextStyle,
  infoCard: {
    width: "100%",
    backgroundColor: "#1B251F",
    borderRadius: 20,
    paddingHorizontal: 15,
  } as ViewStyle,
});
