import React from "react";
import { withRouter } from "react-router-dom";
import MeService from "../../../services/MeService";
import { messageFrom } from "../../../services/api";

/**
 * The patient's own details.
 *
 * Loaded from /me, which takes no id: the server reads the account out of the
 * token. That is why this screen cannot be pointed at another patient by
 * editing a request, and why it no longer renders an empty list of one.
 */
class IndexPatientForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { patient: null, error: null, loading: true };
    this.mounted = false;
    this.treatHist = this.treatHist.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    MeService.getProfile()
      .then((response) => {
        if (this.mounted) {
          this.setState({ patient: response.data, loading: false });
        }
      })
      .catch((error) => {
        if (this.mounted) {
          this.setState({ error: messageFrom(error, "Could not load your details."), loading: false });
        }
      });
  }

  componentWillUnmount() {
    // The request outlives a fast navigation away from this screen, and
    // setting state on an unmounted component is a warning in the console and
    // a leak in practice.
    this.mounted = false;
  }

  treatHist() {
    this.props.history.push("/index-patient/my-info");
  }

  render() {
    const { patient, error, loading } = this.state;

    return (
      <div
        className="infoP"
        style={{
          marginLeft: "-1px",
          marginTop: "0px",
          width: "40%",
          padding: "20px",
          border: "3px solid #39ca74",
          background: "white",
          borderRadius: "10px 10px 10px 10px"
        }}
      >
        <div
          className="contentP"
          style={{
            fontWeight: "bold"
          }}
        >
          {loading && <p>Loading your details…</p>}
          {error && <p style={{ color: "#c0392b" }}>{error}</p>}
          {patient && (
            <div>
              <label> Email : {patient.email}</label>
              <br />
              <br />
              <label> Name : {patient.name}</label>
              <br />
              <br />
              <label> Address : {patient.address}</label>
              <br />
              <br />
              <label> Contact Number : {patient.contactNumber}</label>
              <br />
              <br />
              <label> Blood Type : {patient.bloodType}</label>
              <br />
              <br />
            </div>
          )}
        </div>
        <div className="input-group">
          <button
            type="button"
            className="btn"
            style={{
              borderRadius: "5px",
              marginLeft: "80%",
              border: "none",
              padding: "10px 20px 10px 20px"
            }}
            onClick={this.treatHist}
          >
            MyTreatment History
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(IndexPatientForm);
