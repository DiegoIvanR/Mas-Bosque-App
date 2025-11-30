import NameView from "@/views/SignUpViews/NameView";
import { useNameController } from "@/hooks/signupFormsControllers";
export default function SignupName() {
  const {
    signupData,
    error,
    isValid,
    handleNameChange,
    handleLastNameChange,
    handleClick,
  } = useNameController();
  return (
    <NameView
      signupData={signupData}
      error={error}
      isValid={isValid}
      handleNameChange={handleNameChange}
      handleLastNameChange={handleLastNameChange}
      handleClick={handleClick}
    />
  );
}
