import React from "react";
import MeService from "../../../services/MeService";
import { messageFrom } from "../../../services/api";

/**
 * The patient's own treatment notes, from /me/descriptions. As with the profile
 * above it, the account comes from the token rather than from a parameter.
 */
class MyInfoTreatmentHistoryTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = { descriptions: [], error: null, loading: true };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    MeService.getDescriptions()
      .then((response) => {
        if (this.mounted) {
          this.setState({ descriptions: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({
            error: messageFrom(error, "Could not load your treatment history."),
            loading: false
          });
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { descriptions, error, loading } = this.state;

    return (
      <table className="table2">
        <caption
          style={{
            marginLeft: "34px",
            padding: "10px",
            fontWeight: "bold",
            fontSize: "30px"
          }}
          className="asd"
        >
          Treatment History
        </caption>
        <thead>
          <tr>
            <th>DoctorID</th>
            <th>Treatment</th>
            <th>Doctor's Note</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="3">Loading…</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan="3" style={{ color: "#c0392b" }}>
                {error}
              </td>
            </tr>
          )}
          {!loading && !error && descriptions.length === 0 && (
            <tr>
              <td colSpan="3">No treatment notes yet.</td>
            </tr>
          )}
          {descriptions.map((description) => (
            <tr key={description.id}>
              <td> {description.idDoctor} </td>
              <td> {description.treatment}</td>
              <td> {description.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default MyInfoTreatmentHistoryTable;
