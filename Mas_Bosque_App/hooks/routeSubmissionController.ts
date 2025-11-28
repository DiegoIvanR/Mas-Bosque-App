import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function useRouteSubmission(
  onSubmit: (data: {
    name: string;
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a route name.");
      return;
    }
    onSubmit({ name, difficulty, imageUri });
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
