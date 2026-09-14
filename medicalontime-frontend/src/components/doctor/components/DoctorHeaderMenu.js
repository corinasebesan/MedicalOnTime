import React from "react";
import { Link, withRouter } from "react-router-dom";
import AuthService from "../../../services/AuthService";

class DoctorHeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    AuthService.logout();
    this.props.history.replace("/");
  }

  render() {
    return (
      <nav>
        <ul>
          <li>
            <Link to="/index-doctor">MyInfo</Link>
          </li>
          <li>
            <Link to="/index-doctor/doctor-appointment">My Appointments</Link>
          </li>
          <li>
            <Link to="/index-doctor/search-patient">Search Patient</Link>
          </li>
          <li>
            <Link to="/index-doctor/add-description">Add Description</Link>
          </li>
          <li>
            <button type="button" onClick={this.logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(DoctorHeaderMenu);
