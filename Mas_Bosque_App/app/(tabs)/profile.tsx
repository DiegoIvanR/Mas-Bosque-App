import ProfileView from "@/views/ProfileViews/ProfileView";
import LoadingScreen from "@/views/LoadingScreen";
import ErrorScreen from "@/views/ErrorScreen";
import useProfileController from "@/hooks/profileController";

export default function Profile() {
  const { loading, error, user, handleLogout, handleEditProfile } =
    useProfileController();
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;
  return (
    <ProfileView
      user={user}
      loading={loading}
      handleLogOut={handleLogout}
      handleEditProfile={handleEditProfile}
    />
  );
}
