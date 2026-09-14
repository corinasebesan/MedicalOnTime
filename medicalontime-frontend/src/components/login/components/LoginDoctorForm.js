import React from "react";
import CredentialsForm from "./CredentialsForm";

export default function LoginDoctorForm() {
  return (
    <CredentialsForm
      role="DOCTOR"
      usernameLabel="Doctor Username"
      formClassName="Dform"
      groupClassName="input-groupD"
      buttonClassName="btnD"
    />
  );
}
