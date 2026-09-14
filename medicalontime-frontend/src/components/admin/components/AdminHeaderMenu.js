import React from "react";
import { Link, withRouter } from "react-router-dom";
import AuthService from "../../../services/AuthService";

/**
 * Wrapped in withRouter because the parent renders this without passing history
 * down, so every button here threw when clicked.
 */
class AdminHeaderMenu extends React.Component {
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
            <Link to="/index-admin">Add/Delete Doctor</Link>
          </li>
          <li>
            <Link to="/index-admin/view-doctor">View Doctors</Link>
          </li>
          <li>
            <Link to="/index-admin/view-patient">View Patients</Link>
          </li>
          <li>
            <Link to="/index-admin/view-appointment">View Appointments</Link>
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

export default withRouter(AdminHeaderMenu);
