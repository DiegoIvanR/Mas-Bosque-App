import React from "react";
import {View, Text, StyleSheet} from "react-native";

interface InitialsAvatarProps {
    name: string;
    size?: number; // avatar size in px
}

const stringToColor = (str: string) => {
    // Simple hash to generate consistent colors from a string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 50%)`; // hue, saturation, lightness
    return color;
};

const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 0) return "?";
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export default function InitialsAvatar({name, size = 150}: InitialsAvatarProps) {
    const initials = getInitials(name);
    const bgColor = stringToColor(name);

    return (
        <View
            style={[
                styles.avatar,
                {width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor},
            ]}
        >
            <Text style={[styles.initials, {fontSize: size / 2.5}]}>{initials}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    initials: {
        color: "#fff",
        fontWeight: "bold",
    },
});
