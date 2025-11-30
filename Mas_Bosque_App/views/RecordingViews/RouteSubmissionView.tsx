import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
type Props = {
  visible: boolean;
  onCancel: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  difficulty: "Easy" | "Medium" | "Hard";
  setDifficulty: React.Dispatch<
    React.SetStateAction<"Easy" | "Medium" | "Hard">
  >;
  pickImage: () => Promise<void>;
  imageUri: string | null;
  handleSubmit: () => void;
};

export default function RouteSubmissionFormView({
  visible,
  onCancel,
  name,
  setName,
  difficulty,
  setDifficulty,
  pickImage,
  imageUri,
  handleSubmit,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Save Route</Text>

          {/* Name Input */}
          <Text style={styles.label}>Route Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning Forest Ride"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          {/* Difficulty Selector */}
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.diffRow}>
            {(["Easy", "Medium", "Hard"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.diffBtn,
                  difficulty === level && styles.diffBtnActive,
                  {
                    borderColor:
                      level === "Easy"
                        ? "#04FF0C"
                        : level === "Medium"
                        ? "#FFA500"
                        : "#FF5A5A",
                  },
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.diffText,
                    difficulty === level && {
                      color: "black",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Image Picker */}
          <Text style={styles.label}>Cover Photo</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera" size={30} color="#04FF0C" />
                <Text style={styles.placeholderText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Save Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#00160B",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#ccc",
    marginBottom: 8,
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#111",
    color: "white",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  diffRow: {
    flexDirection: "row",
    gap: 10,
  },
  diffBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  diffBtnActive: {
    backgroundColor: "white", // Or specific color based on difficulty
  },
  diffText: {
    color: "white",
    fontSize: 12,
  },
  imagePicker: {
    height: 150,
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    color: "#04FF0C",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    padding: 15,
  },
  cancelText: {
    color: "#FF5A5A",
  },
  submitBtn: {
    backgroundColor: "#04FF0C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  submitText: {
    color: "black",
    fontWeight: "bold",
  },
});
