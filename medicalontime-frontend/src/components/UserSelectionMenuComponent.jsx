import React from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/AuthService";

/**
 * The front door. Someone who is already signed in is sent to their own
 * dashboard rather than being asked to pick a role again.
 */
class UserSelectionMenuComponent extends React.Component {
  constructor(props) {
    super(props);

    this.admin = this.admin.bind(this);
    this.patient = this.patient.bind(this);
    this.doctor = this.doctor.bind(this);
  }

  admin() {
    this.props.history.push("/login-admin");
  }

  patient() {
    this.props.history.push("/login-patient");
  }

  doctor() {
    this.props.history.push("/login-doctor");
  }

  render() {
    if (AuthService.isSignedIn()) {
      return <Redirect to={AuthService.homePath()} />;
    }

    return (
      <div>
        <div className="wrapper">
          <div className="btn">
            <button type="button" className="buttonA" onClick={this.admin}>
              Admin
            </button>
          </div>
        </div>
        <div
          className="wrapper"
          style={{
            textDecoration: "none"
          }}
        >
          <div className="btn">
            <button type="button" className="buttonP" onClick={this.patient}>
              Patient
            </button>
          </div>
        </div>
        <div
          className="wrapper"
          style={{
            textDecoration: "none"
          }}
        >
          <div className="btn">
            <button type="button" className="buttonD" onClick={this.doctor}>
              Doctor
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserSelectionMenuComponent;
