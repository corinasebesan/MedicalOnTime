import React from "react";
import MeService from "../../../services/MeService";
import { messageFrom } from "../../../services/api";

/**
 * The doctor's own details. The labels had no values behind them at all, so
 * this screen printed five empty fields.
 */
class IndexDoctorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { doctor: null, error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    MeService.getProfile()
      .then((response) => {
        if (this.mounted) {
          this.setState({ doctor: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({ error: messageFrom(error, "Could not load your details."), loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { doctor, error, loading } = this.state;

    return (
      <div className="info">
        <div className="Dcontent">
          {loading && <p>Loading your details…</p>}
          {error && <p style={{ color: "#c0392b" }}>{error}</p>}
          {doctor && (
            <div>
              <label> Email : {doctor.email}</label>
              <br />
              <br />
              <label> Name : {doctor.doctorName}</label>
              <br />
              <br />
              <label> Address : {doctor.address}</label>
              <br />
              <br />
              <label> Contact Number : {doctor.contactNumber}</label>
              <br />
              <br />
              <label> Specialized In : {doctor.category}</label>
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default IndexDoctorForm;
