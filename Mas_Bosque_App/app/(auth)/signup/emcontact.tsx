import EmContactView from "@/views/SignUpViews/EmContactView";
import useSignupController from "@/hooks/signupController";

export default function SignupEMContact() {
  const {
    loading,
    error,
    signupData,
    isValid,
    handleClick,
    handleNameChange,
    handleLastName,
    handlePhone,
    handleRelationship,
  } = useSignupController();
  return (
    <EmContactView
      signupData={signupData}
      error={error}
      loading={loading}
      isValid={isValid}
      handleNameChange={handleNameChange}
      handleLastName={handleLastName}
      handlePhone={handlePhone}
      handleRelationship={handleRelationship}
      handleClick={handleClick}
    />
  );
}
