import EditPasswordView from "@/views/ProfileViews/EditPasswordView";
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import { useEditPassword } from "@/hooks/editController";

export default function EditPassword() {
  const {
    loading,
    error,
    handleGoBack,
    handleSave,
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
  } = useEditPassword();
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <EditPasswordView
      handleGoBack={handleGoBack}
      handleSave={handleSave}
      currentPassword={currentPassword}
      newPassword={newPassword}
      confirmPassword={confirmPassword}
      loading={loading}
      setCurrentPassword={setCurrentPassword}
      setNewPassword={setNewPassword}
      setConfirmPassword={setConfirmPassword}
    />
  );
}
