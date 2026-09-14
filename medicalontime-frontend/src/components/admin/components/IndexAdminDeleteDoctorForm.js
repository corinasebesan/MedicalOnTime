import React from "react";
import DoctorService from "../../../services/DoctorService";
import { messageFrom } from "../../../services/api";

/**
 * Deletes a doctor by id.
 *
 * The original fired the request and ignored what came back, so a failed delete
 * looked exactly like a successful one. It also sat inside a form that posted to
 * a .html page, which reloaded the app mid-request.
 */
class IndexAdminDeleteDoctorForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { id: "", error: null, message: null, submitting: false };

    this.change = this.change.bind(this);
    this.deleteDoctor = this.deleteDoctor.bind(this);
  }

  change(event) {
    this.setState({ id: event.target.value });
  }

  deleteDoctor(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }

    const id = this.state.id.trim();
    if (!/^\d+$/.test(id)) {
      this.setState({ error: "Enter the numeric id of the doctor.", message: null });
      return;
    }

    this.setState({ submitting: true, error: null, message: null });

    DoctorService.deleteDoctor(id)
      .then(() => {
        this.setState({ submitting: false, message: `Deleted doctor ${id}.`, id: "" });
      })
      .catch((error) => {
        this.setState({
          submitting: false,
          error: messageFrom(error, "Could not delete that doctor.")
        });
      });
  }

  render() {
    return (
      <form className="delete" onSubmit={this.deleteDoctor}>
        <div className="input-groupA">
          <label htmlFor="deleteDoctorId">Doctor ID</label>
          <input
            id="deleteDoctorId"
            type="text"
            inputMode="numeric"
            name="id"
            className="id"
            value={this.state.id}
            onChange={this.change}
            disabled={this.state.submitting}
          />
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
            {this.state.submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </form>
    );
  }
}

export default IndexAdminDeleteDoctorForm;
