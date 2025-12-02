import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import EditNameView from "@/views/ProfileViews/EditNameView";
import { useEditName } from "@/hooks/editController";

export default function EditName() {
  const {
    loading,
    error,
    handleGoBack,
    handleSave,
    firstName,
    lastName,
    profile,
    setFirstName,
    setLastName,
  } = useEditName();

  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditNameView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      firstName={firstName}
      lastName={lastName}
      profile={profile}
      setFirstName={setFirstName}
      setLastName={setLastName}
    />
  );
}
