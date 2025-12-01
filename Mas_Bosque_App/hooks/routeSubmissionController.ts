import {useState} from "react";
import {Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Logger from "@/utils/Logger";

export function useRouteSubmission(
    onSubmit: (data: {
        safeName: string;
        difficulty: "Easy" | "Medium" | "Hard";
        imageUri: string | null;
    }) => void
) {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
        "Medium"
    );
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        Logger.log("Opening image picker");
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            Logger.log("Image selected", {uri: result.assets[0].uri});
            setImageUri(result.assets[0].uri);
        } else {
            Logger.log("Image picker canceled");
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            Logger.warn("Route submission failed: Missing Name");
            Alert.alert("Required", "Please enter a route name.");
            return;
        }

        const safeName = name.trim().slice(0, 500)
        if (imageUri && !/^file:\/\//.test(imageUri) && !/^content:\/\//.test(imageUri)) {
            Logger.warn("Invalid image URI", { imageUri });
            return;
        }

        Logger.log("Submitting new route", {
            safeName,
            difficulty,
            hasImage: !!imageUri,
        });
        onSubmit({safeName, difficulty, imageUri});
    };

    return {
        name,
        setName,
        difficulty,
        setDifficulty,
        pickImage,
        imageUri,
        handleSubmit,
    };
}
