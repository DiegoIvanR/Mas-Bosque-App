import React, { useState } from "react";
import { router } from "expo-router";
import { useSignup } from "./SignUpContext";
import MedicalView from "@/components/SignUpViews/MedicalView";
export default function SignupMedical() {
  const { signupData, setSignupData } = useSignup();
  const [error, setError] = useState("");

  // 1. Validation for blood type
  const isValid = signupData.bloodType.trim().length > 0;

  const handleClick = () => {
    if (!isValid) {
      setError("Please enter your blood type.");
    } else {
      setError("");
      router.push("/signup/emcontact");
    }
  };
  const handleBloodTypeChange = (bloodType: string) => {
    if (error) setError("");
    setSignupData((prev) => ({ ...prev, bloodType }));
  };
  const handleAllergiesChange = (allergies: string) => {
    setSignupData((prev) => ({ ...prev, allergies }));
  };
  const handleMedicalConditionsChange = (medicalConditions: string) => {
    setSignupData((prev) => ({ ...prev, medicalConditions }));
  };
  const handleMedicationsChange = (medications: string) => {
    setSignupData((prev) => ({ ...prev, medications }));
  };
  return (
    <MedicalView
      signupData={signupData}
      error={error}
      isValid={isValid}
      handleBloodTypeChange={handleBloodTypeChange}
      handleAllergiesChange={handleAllergiesChange}
      handleMedicationsChange={handleMedicationsChange}
      handleMedicalConditionsChange={handleMedicalConditionsChange}
      handleClick={handleClick}
    />
  );
}
