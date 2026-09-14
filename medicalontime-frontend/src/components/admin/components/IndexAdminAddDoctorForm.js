import React from "react";
import DoctorService from "../../../services/DoctorService";
import { messageFrom } from "../../../services/api";

const CATEGORIES = ["Dentistry", "Mental Health", "Surgery"];

/**
 * Adds a doctor.
 *
 * The payload this built was wrong: it read this.state.name and
 * this.state.bloodType, neither of which exists on this form, so doctorName and
 * category were sent as undefined and every doctor was created nameless. It
 * also redirected the admin to the doctor dashboard on success, which an admin
 * account is not allowed to open.
 */
class IndexAdminAddDoctorForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      doctorName: "",
      email: "",
      address: "",
      contactNumber: "",
      password: "",
      category: CATEGORIES[0],
      error: null,
      message: null,
      submitting: false
    };

    this.change = this.change.bind(this);
    this.add = this.add.bind(this);
  }

  change(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  add(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }
    if (this.state.username.trim().length < 3) {
      this.setState({ error: "The username must be at least 3 characters.", message: null });
      return;
    }
    if (this.state.password.length < 8) {
      this.setState({ error: "The password must be at least 8 characters.", message: null });
      return;
    }

    this.setState({ submitting: true, error: null, message: null });

    DoctorService.createDoctor({
      username: this.state.username.trim(),
      doctorName: this.state.doctorName,
      email: this.state.email,
      address: this.state.address,
      contactNumber: this.state.contactNumber,
      password: this.state.password,
      category: this.state.category
    })
      .then((response) => {
        this.setState({
          submitting: false,
          message: `Added ${response.data.doctorName || response.data.username} with id ${response.data.id}.`,
          username: "",
          doctorName: "",
          email: "",
          address: "",
          contactNumber: "",
          password: "",
          category: CATEGORIES[0]
        });
      })
      .catch((error) => {
        this.setState({ submitting: false, error: messageFrom(error, "Could not add the doctor.") });
      });
  }

  render() {
    return (
      <form onSubmit={this.add}>
        <div className="input-groupA">
          <label htmlFor="doctorUsername">Doctor Username</label>
          <input
            id="doctorUsername"
            type="text"
            name="username"
            className="form-control"
            value={this.state.username}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorName">Doctor Name</label>
          <input
            id="doctorName"
            type="text"
            name="doctorName"
            className="form-control"
            value={this.state.doctorName}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorAddress">Address</label>
          <input
            id="doctorAddress"
            type="text"
            name="address"
            className="form-control"
            value={this.state.address}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorContact">Contact Number</label>
          <input
            id="doctorContact"
            type="tel"
            name="contactNumber"
            className="form-control"
            value={this.state.contactNumber}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorEmail">Email address</label>
          <input
            id="doctorEmail"
            type="email"
            name="email"
            className="form-control"
            value={this.state.email}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorPassword">Password</label>
          <input
            id="doctorPassword"
            type="password"
            name="password"
            className="form-control"
            autoComplete="new-password"
            value={this.state.password}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>
        <div className="input-groupA">
          <label htmlFor="doctorCategory">Category</label>
          <select
            id="doctorCategory"
            name="category"
            className="form-control"
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

        {this.state.error && (
          <div className="input-groupA" role="alert" style={{ color: "#c0392b" }}>
            {this.state.error}
          </div>
        )}
        {this.state.message && (
          <div className="input-groupA" role="status" style={{ color: "#27ae60" }}>
            {this.state.message}
          </div>
        )}

        <div className="input-groupA">
          <button type="submit" className="btnA" disabled={this.state.submitting}>
            {this.state.submitting ? "Adding…" : "Add Doctor"}
          </button>
        </div>
      </form>
    );
  }
}

export default IndexAdminAddDoctorForm;
