import React from "react";
import DescriptionService from "../../../services/DescriptionService";
import PatientService from "../../../services/PatientService";
import { messageFrom } from "../../../services/api";

/**
 * Writes a treatment note.
 *
 * The patient is chosen from a list rather than typed as a free text name. The
 * note is stored against the patient's name in the original schema, so a typo
 * would have quietly filed the note where the patient would never see it. This
 * is a workaround for that schema, not a fix; the fix is a foreign key, which
 * is written up in the README.
 *
 * The author is not in the payload. The server takes it from the token, so a
 * note cannot be filed under another doctor's name.
 */
class AddDescriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      patientName: "",
      treatment: "",
      note: "",
      error: null,
      message: null,
      submitting: false,
      loading: true
    };

    this.mounted = false;
    this.change = this.change.bind(this);
    this.add = this.add.bind(this);
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

  change(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  add(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }
    if (!this.state.patientName) {
      this.setState({ error: "Choose a patient.", message: null });
      return;
    }
    if (!this.state.treatment.trim()) {
      this.setState({ error: "Enter the treatment.", message: null });
      return;
    }

    this.setState({ submitting: true, error: null, message: null });

    DescriptionService.createDescription({
      patientName: this.state.patientName,
      treatment: this.state.treatment,
      note: this.state.note
    })
      .then(() => {
        this.setState({
          submitting: false,
          message: "Note added.",
          treatment: "",
          note: ""
        });
      })
      .catch((error) => {
        this.setState({ submitting: false, error: messageFrom(error, "Could not add the note.") });
      });
  }

  render() {
    return (
      <form className="add" onSubmit={this.add}>
        <div className="input-group">
          <label
            htmlFor="patientName"
            style={{
              fontWeight: "bold"
            }}
          >
            Patient
          </label>
          <select
            id="patientName"
            name="patientName"
            className="xd"
            value={this.state.patientName}
            onChange={this.change}
            disabled={this.state.submitting || this.state.loading}
          >
            <option value="">{this.state.loading ? "Loading…" : "Choose a patient"}</option>
            {this.state.patients.map((patient) => (
              <option key={patient.id} value={patient.name}>
                {patient.name} (#{patient.id})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="treatment">Treatment</label>
          <input
            id="treatment"
            type="text"
            name="treatment"
            value={this.state.treatment}
            onChange={this.change}
            disabled={this.state.submitting}
          />
        </div>

        <div className="input-group-add">
          <label htmlFor="note">Note</label>
          <input
            id="note"
            type="text"
            name="note"
            value={this.state.note}
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
            {this.state.submitting ? "Adding…" : "Add"}
          </button>
        </div>
      </form>
    );
  }
}

export default AddDescriptionForm;
