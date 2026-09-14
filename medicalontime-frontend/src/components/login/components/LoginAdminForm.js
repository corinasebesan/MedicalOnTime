import React from "react";
import CredentialsForm from "./CredentialsForm";

export default function LoginAdminForm() {
  return (
    <CredentialsForm
      role="ADMIN"
      usernameLabel="Admin Username"
      formClassName="Aform"
      groupClassName="input-groupA"
      buttonClassName="btnA"
    />
  );
}
