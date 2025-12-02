import LoadingScreen from "@/views/LoadingScreen";
import EditEmergencyContactView from "@/views/ProfileViews/EditEmergencyContactView";
import ErrorScreen from "@/views/ErrorScreen";
import { useEditEmergencyContact } from "@/hooks/editController";

export default function EditEmergencyContact() {
  const {
    loading,
    error,
    name,
    lastName,
    phone,
    relationship,
    setName,
    setLastName,
    setPhone,
    setRelationship,
    handleBack,
    handleSave,
  } = useEditEmergencyContact();
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditEmergencyContactView
      name={name}
      lastName={lastName}
      phone={phone}
      relationship={relationship}
      setName={setName}
      setLastName={setLastName}
      setPhone={setPhone}
      setRelationship={setRelationship}
      backButton={handleBack}
      handleSave={handleSave}
    />
  );
}
