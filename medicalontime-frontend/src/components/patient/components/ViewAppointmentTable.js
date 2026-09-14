import React from "react";
import MeService from "../../../services/MeService";
import DoctorService from "../../../services/DoctorService";
import { messageFrom } from "../../../services/api";

/**
 * The patient's own bookings.
 *
 * An appointment row stores only the doctor's id, so the doctor directory is
 * fetched alongside it and the two are joined here. Both requests go out at
 * once rather than one after the other, because neither depends on the other.
 */
class ViewAppointmentTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { appointments: [], doctorsById: {}, error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;

    Promise.all([MeService.getAppointments(), DoctorService.getDoctors()])
      .then(([appointments, doctors]) => {
        if (!this.mounted) {
          return;
        }
        const doctorsById = {};
        doctors.data.forEach((doctor) => {
          doctorsById[doctor.id] = doctor;
        });
        this.setState({ appointments: appointments.data, doctorsById, loading: false });
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
    const { appointments, doctorsById, error, loading } = this.state;

    return (
      <table className="table2">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>DATE</th>
            <th>TIME</th>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Address</th>
            <th>Contact Number</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="8">Loading…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="8" style={{ color: "#c0392b" }}>
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && appointments.length === 0 && (
            <tr>
              <td colSpan="8">You have no appointments booked.</td>
            </tr>
          )}
          {appointments.map((appointment) => {
            const doctor = doctorsById[appointment.idDoctor] || {};
            return (
              <tr key={appointment.id}>
                <td> {appointment.id}</td>
                <td> {appointment.date}</td>
                <td> {appointment.time}</td>
                <td> {appointment.idDoctor} </td>
                <td> {doctor.doctorName}</td>
                <td> {doctor.address}</td>
                <td> {doctor.contactNumber}</td>
                <td> {doctor.category}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default ViewAppointmentTable;
