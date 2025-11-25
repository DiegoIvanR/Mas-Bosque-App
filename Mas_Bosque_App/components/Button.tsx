import * as React from "react";
import {
    StyleSheet,
    View,
    Pressable,
    StyleProp,
    ViewStyle,
    Platform,
    Text,
} from "react-native";

type ButtonProps = {
    /** The text to display inside the button. */
    value: string;
    /** Callback that is called when the button is pressed. */
    onClick: () => void;
    /** Optional: A ReactNode (e.g., an Icon component) to display. */
    icon?: React.ReactNode;
    /** Optional custom background color. */
    backgroundColor?: string;
    /** Optional custom border color. */
    borderColor?: string;
    /** Optional custom text color. */
    textColor?: string;
    /** If true, the button will be grayed out and unpressable. */
    disabled?: boolean;
    /** Optional custom style for the outer container. */
    style?: StyleProp<ViewStyle>;
};

const Button = ({
                    value,
                    onClick,
                    icon, // <-- New prop
                    backgroundColor = "#FFFFFF",
                    borderColor = "rgba(0, 0, 0, 0)",
                    textColor = "#00160a",
                    disabled = false,
                    style
                }: ButtonProps) => {
    return (
        <Pressable
            style={({pressed}) => [
                styles.pressable,
                {backgroundColor: backgroundColor, borderColor: borderColor},
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
                style
            ]}
            onPress={onClick}
            disabled={disabled}
        >
            <View style={styles.frame}>
                {/* Render icon if it exists */}
                {icon}
                <Text style={[styles.text, {color: textColor}]}>{value}</Text>
            </View>
        </Pressable>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // <-- Center icon and text
        gap: 10, // <-- Use gap from your original [id].tsx
    },
    text: {
        fontSize: 17,
        letterSpacing: -0.08,
        lineHeight: 22,
        fontFamily: "SF Pro Rounded", // Using your Button.tsx font
        textAlign: "center",
        fontWeight: "500",

        // --- Key Change ---
        // Remove flex: 1 so text doesn't push icon to the edge
        // flex: 1,
    },
    pressable: {
        borderRadius: 1000,
        borderWidth: 2,
        paddingHorizontal: 11,
        paddingVertical: 11,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
    },
    pressed: {
        opacity: 0.8,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
