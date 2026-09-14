import React from "react";
import DoctorService from "../../../services/DoctorService";
import { messageFrom } from "../../../services/api";

/**
 * The password column is gone. It listed the stored password for every doctor
 * on a single screen, and the API no longer serialises the field at all, so
 * there is nothing to put in it.
 *
 * The id column is back. The header row had eight columns and the body had
 * seven, so every value was showing under the wrong heading.
 */
class ViewDoctorAdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { doctors: [], error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    DoctorService.getDoctors()
      .then((response) => {
        if (this.mounted) {
          this.setState({ doctors: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({ error: messageFrom(error, "Could not load the doctors."), loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { doctors, error, loading } = this.state;

    return (
      <table className="table4">
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Doctor Username</th>
            <th>Doctor Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="7">Loading…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="7" style={{ color: "#c0392b" }}>
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && doctors.length === 0 && (
            <tr>
              <td colSpan="7">No doctors yet.</td>
            </tr>
          )}
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td> {doctor.id} </td>
              <td> {doctor.username} </td>
              <td> {doctor.doctorName}</td>
              <td> {doctor.email}</td>
              <td> {doctor.address}</td>
              <td> {doctor.contactNumber}</td>
              <td> {doctor.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default ViewDoctorAdminTable;
