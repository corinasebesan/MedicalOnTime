import React from "react";
import DoctorService from "../../../services/DoctorService";
import SearchDoctorTable from "./SearchDoctorTable";
import { messageFrom } from "../../../services/api";

/**
 * Search the doctor directory by id, name or category.
 *
 * The form and the results table were separate siblings with no way to pass
 * anything between them, which is why the original searched and then threw the
 * answer away. The form owns the results now and renders the table itself.
 *
 * The directory is fetched once and filtered in the browser. It is a short list
 * and a typed search that answers on each keystroke reads better than one that
 * waits for a round trip.
 */
class SearchDoctorForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { doctors: [], term: "", searched: false, error: null, loading: true };

    this.mounted = false;
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
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
    this.setState({ term: event.target.value, searched: true });
  }

  submit(event) {
    event.preventDefault();
    this.setState({ searched: true });
  }

  results() {
    const term = this.state.term.trim().toLowerCase();
    if (!term) {
      return this.state.doctors;
    }
    return this.state.doctors.filter((doctor) => {
      return (
        String(doctor.id) === term ||
        (doctor.doctorName || "").toLowerCase().indexOf(term) !== -1 ||
        (doctor.category || "").toLowerCase().indexOf(term) !== -1
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submit}>
          <div className="input-group">
            <label
              htmlFor="doctorSearch"
              style={{
                fontWeight: "bold"
              }}
            >
              Search by doctor id, name or category
            </label>
            <input
              id="doctorSearch"
              type="text"
              name="term"
              className="id"
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

        <SearchDoctorTable
          doctors={this.results()}
          loading={this.state.loading}
          error={this.state.error}
          searched={this.state.searched}
        />
      </div>
    );
  }
}

export default SearchDoctorForm;
