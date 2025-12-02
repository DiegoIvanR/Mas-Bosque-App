import ErrorScreen from "@/views/ErrorScreen";
import EditView from "@/views/ProfileViews/EditView";
import LoadingScreen from "@/views/LoadingScreen";
import { useEditProfile } from "@/hooks/editController";
// --- Main Component ---
export default function EditProfile() {
  const {
    loading,
    error,
    profile,
    contact,
    handleGoBack,
    handleEditName,
    handleChangePassword,
    handleEditConditions,
    handleEditContact,
  } = useEditProfile();
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditView
      user={profile}
      contact={contact}
      handleGoBack={handleGoBack}
      handleEditName={handleEditName}
      handleChangePassword={handleChangePassword}
      handleEditConditions={handleEditConditions}
      handleEditContact={handleEditContact}
    />
  );
}
