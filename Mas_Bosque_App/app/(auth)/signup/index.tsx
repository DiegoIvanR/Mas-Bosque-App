import SignUpView from "@/views/SignUpViews/SignUpView";
import { useEmailController } from "@/hooks/signupFormsControllers";

export default function SignupEmail() {
  const {
    signupData,
    error,
    validEmail,
    handleEmailChange,
    handleClick,
    handleClickLogIn,
  } = useEmailController();
  return (
    <SignUpView
      signupData={signupData}
      error={error}
      validEmail={validEmail}
      handleEmailChange={handleEmailChange}
      handleClick={handleClick}
      handleClickLogIn={handleClickLogIn}
    />
  );
}
