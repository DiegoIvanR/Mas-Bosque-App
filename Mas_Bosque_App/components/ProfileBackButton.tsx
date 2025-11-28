import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileBackButton({ onPress }: { onPress: () => void }) {
    const insets = useSafeAreaInsets();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.button,
                { top: insets.top + 8 }
            ]}
        >
            <Ionicons name="chevron-back" size={28} color="white" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        left: 20,
        padding: 10,
        zIndex: 999,
    },
});
