import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputBar from "@/components/InputBar";
import Button from "@/components/Button";
import { router } from "expo-router";
import { useSignup } from "./SignUpContext"; // Corrected import path
import { supabase } from "@/lib/SupabaseClient";
// 1. Import your new database functions
import { initDatabase, saveUserDataLocally } from "@/lib/database";
import { useAuth } from "@/lib/auth"; // 1. Import useAuth

export default function SignupEMContact() {
  const { signupData, setSignupData } = useSignup();
  const { setIsLoggedIn } = useAuth(); // 2. Get the setter function
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // 3. Validate contact info (simple check)
    if (!signupData.contactName || !signupData.contactPhone) {
      setError("Please fill in at least the contact's name and phone number.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    // 4. Call Supabase auth.signUp with data from context
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError(
        "An unexpected error occurred (no user data). Please try again."
      );
      setLoading(false);
      return;
    }

    // --- Profile Insert ---
    const { data: profileData, error: profileError } = await supabase
      .from("user_profile")
      .insert([
        {
          id: authData.user.id,
          first_name: signupData.name,
          last_name: signupData.lastName,
          blood_type: signupData.bloodType,
          allergies: signupData.allergies,
          medical_conditions: signupData.medicalConditions,
          medications: signupData.medications,
        },
      ])
      .select();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    if (!profileData) {
      setError(
        "An unexpected error occurred (profile not saved). Please try again."
      );
      setLoading(false);
      return;
    }

    // --- Emergency Contact Insert ---
    const { data: emcontact, error: emcontactError } = await supabase
      .from("emergency_contacts")
      .insert([
        {
          user_id: authData.user.id,
          name: signupData.contactName,
          last_name: signupData.contactLastName,
          phone: signupData.contactPhone,
          relationship: signupData.contactRelationship,
        },
      ])
      .select();

    if (emcontactError) {
      setError(emcontactError.message);
    } else if (emcontact) {
      // --- 2. SAVE TO SQLITE ON SUCCESS ---
      try {
        await initDatabase(); // Ensure tables exist
        // Save the data returned from Supabase (it's the most reliable)
        await saveUserDataLocally(profileData[0], emcontact[0]);
      } catch (dbError: any) {
        console.error("Failed to save data locally:", dbError.message);
        // Don't block the user for a local DB error, just log it.
      }

      // 3. SET THE GLOBAL AUTH STATE
      setIsLoggedIn(true);
      router.push("/(tabs)"); // Success!
    } else {
      setError(
        "An unexpected error occurred (contact not saved). Please try again."
      );
    }

    setLoading(false); // Stop loading
  };

  // ... (rest of your component remains the same) ...

  const handleNameChange = (contactName: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactName }));
  };
  const handleLastName = (contactLastName: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactLastName }));
  };
  const handlePhone = (contactPhone: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactPhone }));
  };
  const handleRelationship = (contactRelationship: string) => {
    if (error) {
      setError("");
    }
    setSignupData((prev) => ({ ...prev, contactRelationship }));
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.text}>Who's your emergency contact?</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Name</Text>
            <InputBar
              value={signupData.contactName}
              onChangeText={handleNameChange}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Last Name</Text>
            <InputBar
              value={signupData.contactLastName}
              onChangeText={handleLastName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>Phone Number</Text>
            <InputBar
              value={signupData.contactPhone}
              onChangeText={handlePhone}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.subText}>How are they related to you?</Text>
            <InputBar
              value={signupData.contactRelationship}
              onChangeText={handleRelationship}
            />
          </View>

          {/* --- ADDED THIS SECTION --- */}
          <View style={styles.buttonContainer}>
            {/* Display the error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              value={loading ? "Finishing..." : "Continue"}
              onClick={handleClick}
            />
          </View>
          {/* --- END OF SECTION --- */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ... (styles remain the same) ...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#00160B",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 0.5, // ensures ScrollView content expands properly
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 35,
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Lato-Bold",
    color: "#fff",
    textAlign: "center",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },
  subText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "SF Pro Rounded",
    color: "#fff",
    textAlign: "left",
  },
  buttonContainer: {
    width: "100%", // Ensure it takes full width for alignment
    alignItems: "center", // Center Button
    gap: 8, // Space between error and button
  },
  errorText: {
    fontSize: 14,
    color: "#FF5A5A", // A common error color
    fontFamily: "Lato-Bold", // Match other styles
    textAlign: "center",
  },
});
