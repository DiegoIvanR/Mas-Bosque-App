import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import LoadingScreen from "@/views/LoadingScreen";
import { editProfileModel } from "@/models/editProfileModel";
import EditEmergencyContactView from "@/views/ProfileViews/EditEmergencyContactView";
import ErrorScreen from "@/views/ErrorScreen";
export default function EditEmergencyContact() {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [id, setId] = useState("");
  const [user_id, setUserId] = useState("");
  const [error, setError] = useState("");

  const fetchContact = async () => {
    try {
      setError("");
      const { profile, contact } = await editProfileModel.fetchProfile();

      setName(contact.name || "");
      setLastName(contact.last_name || "");
      setPhone(contact.phone || "");
      setRelationship(contact.relationship || "");
      setLoading(false);
      setId(contact.id || "");
      setUserId(contact.user_id || "");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    }
  };
  useEffect(() => {
    fetchContact();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    if (id == "") {
      console.error("Contact ID is missing.");
      setError("Contact ID is missing.");
      return;
    }

    // Prepare the updated contact object with form data
    const updatedContact = {
      id: id,
      user_id: user_id,
      name,
      last_name: lastName,
      phone,
      relationship,
    };

    try {
      setError("");
      await editProfileModel.handleUpdateContact(updatedContact);
    } catch (error: any) {
      console.error("Error updating contact:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };
  if (loading) return <LoadingScreen />;
  else if (error != "") return <ErrorScreen error={error} />;

  const handleBack = () => {
    router.back();
  };
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
