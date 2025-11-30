import MedicalView from "@/views/SignUpViews/MedicalView";
import { useMedicalController } from "@/hooks/signupFormsControllers";
export default function SignupMedical() {
  const {
    signupData,
    error,
    isValid,
    handleBloodTypeChange,
    handleAllergiesChange,
    handleMedicalConditionsChange,
    handleMedicationsChange,
    handleClick,
  } = useMedicalController();
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
