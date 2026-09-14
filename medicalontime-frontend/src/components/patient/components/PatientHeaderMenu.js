import React from "react";
import { Link, withRouter } from "react-router-dom";
import AuthService from "../../../services/AuthService";

/**
 * The links pointed at .html files left over from the static prototype, so
 * every item in this menu was a dead link inside the single page app. They are
 * router links now, and Logout actually clears the session instead of just
 * navigating away from it.
 */
class PatientHeaderMenu extends React.Component {
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
            <Link to="/index-patient/my-info">MyInfo</Link>
          </li>
          <li>
            <Link to="/index-patient/booking-appointment">Book Appointment</Link>
          </li>
          <li>
            <Link to="/index-patient/view-appointment">View Appointment</Link>
          </li>
          <li>
            <Link to="/index-patient/cancel-booking">Cancel Booking</Link>
          </li>
          <li>
            <Link to="/index-patient/search-doctor">Search Doctor</Link>
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

export default withRouter(PatientHeaderMenu);
