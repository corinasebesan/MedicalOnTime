import React from "react";
import MeService from "../../../services/MeService";
import PatientService from "../../../services/PatientService";
import { messageFrom } from "../../../services/api";

/**
 * The doctor's own schedule, joined with the patient records so the row shows a
 * name rather than an id. The header row existed already; there was never
 * anything under it.
 */
class DoctorAppointmentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { appointments: [], patientsById: {}, error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    Promise.all([MeService.getAppointments(), PatientService.getPatients()])
      .then(([appointments, patients]) => {
        if (!this.mounted) {
          return;
        }
        const patientsById = {};
        patients.data.forEach((patient) => {
          patientsById[patient.id] = patient;
        });
        this.setState({ appointments: appointments.data, patientsById, loading: false });
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            error: messageFrom(error, "Could not load your appointments."),
            loading: false
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { appointments, patientsById, error, loading } = this.state;

    return (
      <table className="table2">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>DATE</th>
            <th>TIME</th>
            <th>PatientID</th>
            <th>PatientName</th>
            <th>PatientAddress</th>
            <th>PatientEmail</th>
            <th>PatientContactNumber</th>
            <th>BloodGroup</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="9">Loading…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="9" style={{ color: "#c0392b" }}>
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && appointments.length === 0 && (
            <tr>
              <td colSpan="9">Nothing booked with you yet.</td>
            </tr>
          )}
          {appointments.map((appointment) => {
            const patient = patientsById[appointment.idPatient] || {};
            return (
              <tr key={appointment.id}>
                <td> {appointment.id}</td>
                <td> {appointment.date}</td>
                <td> {appointment.time}</td>
                <td> {appointment.idPatient}</td>
                <td> {patient.name}</td>
                <td> {patient.address}</td>
                <td> {patient.email}</td>
                <td> {patient.contactNumber}</td>
                <td> {patient.bloodType}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default DoctorAppointmentTable;
