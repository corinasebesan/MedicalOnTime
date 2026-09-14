import React from "react";
import PatientService from "../../../services/PatientService";
import DescriptionService from "../../../services/DescriptionService";
import SearchPatientInformationTable from "./SearchPatientInformationTable";
import SearchPatientTreatmentHistoryTable from "./SearchPatientTreatmentHistoryTable";
import { messageFrom } from "../../../services/api";

/**
 * Look up a patient and their treatment history.
 *
 * The form and the two result tables were three siblings with nothing passing
 * between them, so the search did nothing at all. The form owns the results now
 * and renders both tables.
 */
class SearchPatientForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      descriptions: [],
      term: "",
      searched: false,
      error: null,
      loading: true
    };

    this.mounted = false;
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.mounted = true;

    Promise.all([PatientService.getPatients(), DescriptionService.getDescriptions()])
      .then(([patients, descriptions]) => {
        if (this.mounted) {
          this.setState({
            patients: patients.data,
            descriptions: descriptions.data,
            loading: false
          });
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
    this.setState({ term: event.target.value, searched: true });
  }

  submit(event) {
    event.preventDefault();
    this.setState({ searched: true });
  }

  matchingPatients() {
    const term = this.state.term.trim().toLowerCase();
    if (!term) {
      return this.state.patients;
    }
    return this.state.patients.filter(
      (patient) =>
        String(patient.id) === term || (patient.name || "").toLowerCase().indexOf(term) !== -1
    );
  }

  /** Notes belonging to whichever patients the search matched. */
  matchingDescriptions(patients) {
    const names = patients.map((patient) => (patient.name || "").toLowerCase());
    return this.state.descriptions.filter(
      (description) => names.indexOf((description.patientName || "").toLowerCase()) !== -1
    );
  }

  render() {
    const patients = this.matchingPatients();

    return (
      <div>
        <form className="patientsearch" onSubmit={this.submit}>
          <div className="input-group">
            <label
              htmlFor="patientSearch"
              style={{
                fontWeight: "bold",
                fontSize: "30px"
              }}
            >
              Search by patient id or name
            </label>
            <input
              id="patientSearch"
              type="text"
              name="term"
              value={this.state.term}
              onChange={this.change}
            />
          </div>
          <div className="input-group">
            <button type="submit" className="btn">
              Search
            </button>
          </div>
        </form>

        <SearchPatientInformationTable
          patients={patients}
          loading={this.state.loading}
          error={this.state.error}
          searched={this.state.searched}
        />
        <SearchPatientTreatmentHistoryTable
          descriptions={this.matchingDescriptions(patients)}
          loading={this.state.loading}
          error={this.state.error}
          searched={this.state.searched}
        />
      </div>
    );
  }
}

export default SearchPatientForm;
