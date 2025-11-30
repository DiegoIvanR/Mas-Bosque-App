import LoginView from "@/views/LogInView";
import LoadingScreen from "@/views/LoadingScreen";
import useLoginController from "@/hooks/loginController";
export default function LoginScreen() {
  const {
    checkingSession,
    error,
    isPasswordSecure,
    loading,
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    handleSignUp,
    toggleSecureEntry,
  } = useLoginController();

  if (checkingSession) {
    return <LoadingScreen />;
  }
  return (
    <LoginView
      error={error}
      isPasswordSecure={isPasswordSecure}
      loading={loading}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleSignUp={handleSignUp}
      toggleSecureEntry={toggleSecureEntry}
    />
  );
}
