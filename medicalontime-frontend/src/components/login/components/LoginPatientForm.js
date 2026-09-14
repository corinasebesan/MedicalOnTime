import React from "react";
import { Link } from "react-router-dom";
import CredentialsForm from "./CredentialsForm";

export default function LoginPatientForm() {
  return (
    <CredentialsForm
      role="PATIENT"
      usernameLabel="Patient Username"
      formClassName=""
      groupClassName="input-group"
      buttonClassName="btn"
      footer={
        <p>
          Not a member? <Link to="/register">Sign up</Link>
        </p>
      }
    />
  );
}
