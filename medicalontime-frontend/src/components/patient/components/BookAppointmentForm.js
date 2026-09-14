import React from "react";
import AppointmentService from "../../../services/AppointmentService";
import DoctorService from "../../../services/DoctorService";
import { messageFrom } from "../../../services/api";

const CATEGORIES = ["Dentistry", "Mental Health", "Surgery"];

/**
 * Books an appointment.
 *
 * The doctor list is fetched once and filtered in the browser, because the
 * directory is small and a round trip on every change of the category dropdown
 * would make the form feel slower than it is.
 *
 * The patient id is not in the payload. The server takes it from the token, so
 * this form cannot book in somebody else's name even if the request is edited
 * on the way out.
 */
class BookAppointmentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doctors: [],
      category: CATEGORIES[0],
      doctorId: "",
      date: "",
      time: "",
      error: null,
      message: null,
      submitting: false,
      loading: true
    };

    this.mounted = false;
    this.change = this.change.bind(this);
    this.book = this.book.bind(this);
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

  change(event) {
    const next = { [event.target.name]: event.target.value };
    // Changing the category can leave a doctor selected who is no longer in the
    // list, which would book an appointment the user did not choose.
    if (event.target.name === "category") {
      next.doctorId = "";
    }
    this.setState(next);
  }

  matchingDoctors() {
    return this.state.doctors.filter((doctor) => doctor.category === this.state.category);
  }

  book(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }
    if (!this.state.doctorId) {
      this.setState({ error: "Choose a doctor.", message: null });
      return;
    }
    if (!this.state.date || !this.state.time) {
      this.setState({ error: "Choose a date and a time.", message: null });
      return;
    }

    this.setState({ submitting: true, error: null, message: null });

    AppointmentService.createAppointment({
      idDoctor: Number(this.state.doctorId),
      date: this.state.date,
      time: this.state.time
    })
      .then((response) => {
        this.setState({
          submitting: false,
          message: `Booked. Your appointment id is ${response.data.id}.`,
          doctorId: "",
          date: "",
          time: ""
        });
      })
      .catch((error) => {
        this.setState({ submitting: false, error: messageFrom(error, "Could not book that slot.") });
      });
  }

  render() {
    const matching = this.matchingDoctors();

    return (
      <form onSubmit={this.book}>
        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="xd"
            value={this.state.category}
            onChange={this.change}
            disabled={this.state.submitting}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="doctor">Doctor</label>
          <select
            id="doctor"
            className="input-group2"
            name="doctorId"
            value={this.state.doctorId}
            onChange={this.change}
            disabled={this.state.submitting || this.state.loading}
          >
            <option value="">
              {this.state.loading
                ? "Loading…"
                : matching.length
                ? "Choose a doctor"
                : "No doctors in this category"}
            </option>
            {matching.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.doctorName || doctor.username}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={this.state.date}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>

        <div className="input-group">
          <label htmlFor="time">Time</label>
          <input
            id="time"
            type="time"
            name="time"
            value={this.state.time}
            onChange={this.change}
            disabled={this.state.submitting}
          />
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
            {this.state.submitting ? "Booking…" : "BOOK"}
          </button>
        </div>
      </form>
    );
  }
}

export default BookAppointmentForm;
