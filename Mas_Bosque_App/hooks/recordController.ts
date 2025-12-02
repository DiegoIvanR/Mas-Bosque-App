import {useState} from "react";
import {Alert, ToastAndroid, Platform} from "react-native";
import {router} from "expo-router";

import {useRecordingSession} from "@/lib/useRecordingSession";
import {saveRecordedSession, uploadSessionToSupabase} from "@/lib/database";

export default function useRecordController() {
    const session = useRecordingSession();

    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleStart = () => {
        session.startRecording();
    };

    const handleStop = async () => {
        session.stopRecording();
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    const sanitizeText = (str: string) =>
        str.replace(/[^\w\s\-.,]/g, "").trim();

    const isSafeUri = (uri: string | null) => {
        if (!uri) return null;
        if (!uri.startsWith("file://") && !uri.startsWith("content://"))
            return null; // reject unsafe schemes
        return uri;
    };

    const handleFormSubmit = async (formData: {
        name: string;
        difficulty: any;
        imageUri: string | null;
    }) => {
        setShowForm(false);

        if (session.routePath.length === 0) {
            Alert.alert("Error", "No route data recorded.");
            return;
        }

        try {
            setIsProcessing(true);
            setLoadingMessage("Saving locally...");

            const recordedSession = {
                // SQLite auto-increments ID, we don't pass it here
                start_time: session.startTime || new Date().toISOString(),
                end_time: new Date().toISOString(),
                distance_km: session.distanceTraveled,
                duration_seconds: session.elapsedTime,
                route_data: session.routePath,
                interest_points: session.interestPoints,
                // FORM DATA
                name: sanitizeText(formData.name),
                difficulty: formData.difficulty,
                local_image_uri: isSafeUri(formData.imageUri) || undefined,
            };

            // 1. Save Local
            const localSessionId = await saveRecordedSession(recordedSession);

            setLoadingMessage("Saved! Uploading...");

            // 2. Upload to Supabase
            await performUpload(localSessionId);
        } catch (e: any) {
            console.error(e);
            setIsProcessing(false);
            Alert.alert("Error", "Failed to save session.");
        }
    };

    const performUpload = async (localSessionId: number) => {
        try {
            setLoadingMessage("Uploading to Supabase...");
            await uploadSessionToSupabase(localSessionId);

            Alert.alert("Success", "Route uploaded successfully!", [
                {text: "OK", onPress: () => router.replace("/(tabs)")},
            ]);
        } catch (e: any) {
            Alert.alert(
                "Upload Failed",
                "Data saved locally. We will try uploading later."
            );
            router.replace("/(tabs)");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddPoint = (type: "hazard" | "drop" | "viewpoint") => {
        session.addInterestPoint(type);
        if (Platform.OS === "android") {
            ToastAndroid.show(`${type.toUpperCase()} added!`, ToastAndroid.SHORT);
        }
    };

    return {
        session,
        isProcessing,
        handleStart,
        handleStop,
        handleAddPoint,
        showForm,
        handleCancelForm,
        handleFormSubmit,
    };
}
