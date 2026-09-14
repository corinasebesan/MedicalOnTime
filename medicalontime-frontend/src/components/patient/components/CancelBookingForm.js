import React from "react";
import AppointmentService from "../../../services/AppointmentService";
import MeService from "../../../services/MeService";
import { messageFrom } from "../../../services/api";

/**
 * Cancels a booking.
 *
 * The original was a static input that posted to a .html page and cancelled
 * nothing. It is a dropdown of the patient's own appointments now rather than a
 * free text id, because typing an id was an invitation to type somebody else's:
 * the server refuses those, but a field that can only be filled with your own
 * bookings is a better answer than an error message.
 */
class CancelBookingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: [],
      selected: "",
      error: null,
      message: null,
      submitting: false,
      loading: true
    };

    this.mounted = false;
    this.change = this.change.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  load() {
    return MeService.getAppointments()
      .then((response) => {
        if (this.mounted) {
          this.setState({ appointments: response.data, loading: false });
        }
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

  change(event) {
    this.setState({ selected: event.target.value });
  }

  cancel(event) {
    event.preventDefault();
    if (this.state.submitting || !this.state.selected) {
      if (!this.state.selected) {
        this.setState({ error: "Choose the appointment to cancel.", message: null });
      }
      return;
    }

    const id = this.state.selected;
    this.setState({ submitting: true, error: null, message: null });

    AppointmentService.deleteAppointment(id)
      .then(() => this.load())
      .then(() => {
        if (this.mounted) {
          this.setState({ submitting: false, selected: "", message: `Cancelled appointment ${id}.` });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            submitting: false,
            error: messageFrom(error, "Could not cancel that appointment.")
          });
        }
      });
  }

  render() {
    const { appointments, loading } = this.state;

    return (
      <form onSubmit={this.cancel}>
        <div className="input-group">
          <label htmlFor="appointment">Appointment</label>
          <select
            id="appointment"
            name="appointment"
            value={this.state.selected}
            onChange={this.change}
            disabled={this.state.submitting || loading}
          >
            <option value="">
              {loading
                ? "Loading…"
                : appointments.length
                ? "Choose an appointment"
                : "You have nothing booked"}
            </option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                #{appointment.id} on {appointment.date} at {appointment.time}
              </option>
            ))}
          </select>
        </div>

        {this.state.error && (
          <div className="input-group" role="alert" style={{ color: "#c0392b" }}>
            {this.state.error}
          </div>
        )}
        {this.state.message && (
          <div className="input-group" role="status" style={{ color: "#27ae60" }}>
            {this.state.message}
          </div>
        )}

        <div className="input-group">
          <button type="submit" className="btn" disabled={this.state.submitting}>
            {this.state.submitting ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      </form>
    );
  }
}

export default CancelBookingForm;
