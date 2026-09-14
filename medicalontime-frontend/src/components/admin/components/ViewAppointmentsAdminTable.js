import React from "react";
import AppointmentService from "../../../services/AppointmentService";
import { messageFrom } from "../../../services/api";

class ViewAppointmentsAdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { appointments: [], error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    AppointmentService.getAppointments()
      .then((response) => {
        if (this.mounted) {
          this.setState({ appointments: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            error: messageFrom(error, "Could not load the appointments."),
            loading: false
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { appointments, error, loading } = this.state;

    return (
      <table className="table4">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Doctor ID</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5">Loading…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="5" style={{ color: "#c0392b" }}>
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && appointments.length === 0 && (
            <tr>
              <td colSpan="5">No appointments booked yet.</td>
            </tr>
          )}
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td> {appointment.id} </td>
              <td> {appointment.idDoctor} </td>
              <td> {appointment.idPatient}</td>
              <td> {appointment.date}</td>
              <td> {appointment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default ViewAppointmentsAdminTable;
