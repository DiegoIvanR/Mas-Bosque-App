import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import EditMedicalConditionsView from "@/views/ProfileViews/EditMedicalConditionsView";
import { useEditMedicalConditions } from "@/hooks/editController";

export default function EditMedicalConditions() {
  const {
    loading,
    error,
    handleGoBack,
    handleSave,
    bloodType,
    allergies,
    medications,
    medicalConditions,
    setBloodType,
    setAllergies,
    setMedications,
    setMedicalConditions,
  } = useEditMedicalConditions();

  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditMedicalConditionsView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      bloodType={bloodType}
      allergies={allergies}
      medications={medications}
      medicalConditions={medicalConditions}
      loading={loading}
      setBloodType={setBloodType}
      setAllergies={setAllergies}
      setMedications={setMedications}
      setMedicalConditions={setMedicalConditions}
    />
  );
}
