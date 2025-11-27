import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import EditListItem from "./EditListItem";
import {UserDataType} from "@/models/profileModel";
import {ContactDataType} from "@/models/editProfileModel";
import ProfileBackButton from "@/components/ProfileBackButton";

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
                                 } :EditViewProps) {
    return (
        <View style={styles.container}>
            <ProfileBackButton onPress={handleGoBack}/>

            <Text style={styles.header}>Edit profile</Text>

            <View style={styles.infoCard}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00160A",
        paddingHorizontal: 24,
        paddingTop: 80,
    },

    header: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 30,
        textAlign: "center",
    },

    infoCard: {
        width: "100%",
        backgroundColor: "#1B251F",
        borderRadius: 20,
        paddingHorizontal: 15,
    },
});
