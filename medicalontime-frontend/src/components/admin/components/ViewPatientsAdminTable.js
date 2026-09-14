import React from "react";
import PatientService from "../../../services/PatientService";
import { messageFrom } from "../../../services/api";

/** Password column removed and the id column restored, as in the doctors table. */
class ViewPatientsAdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { patients: [], error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    PatientService.getPatients()
      .then((response) => {
        if (this.mounted) {
          this.setState({ patients: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({ error: messageFrom(error, "Could not load the patients."), loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { patients, error, loading } = this.state;

    return (
      <table className="table4">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Username</th>
            <th>Patient Name</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Blood Group</th>
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
          {!loading && !error && patients.length === 0 && (
            <tr>
              <td colSpan="7">No patients yet.</td>
            </tr>
          )}
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td> {patient.id} </td>
              <td> {patient.username} </td>
              <td> {patient.name}</td>
              <td> {patient.address}</td>
              <td> {patient.contactNumber}</td>
              <td> {patient.email}</td>
              <td> {patient.bloodType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default ViewPatientsAdminTable;
