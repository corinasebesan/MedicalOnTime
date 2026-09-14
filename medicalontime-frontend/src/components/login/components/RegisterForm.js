import React from "react";
import { Link, withRouter } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { messageFrom } from "../../../services/api";

const FIELDS = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address" },
  { name: "contactNumber", label: "Contact Number", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
  { name: "bloodType", label: "Blood type", type: "text" }
];

/**
 * Public sign up. Creates a patient and signs them straight in, so the new user
 * lands on their own dashboard with a real session rather than on a page that
 * cannot load anything.
 *
 * The password field is a password input now. It was a plain text input, which
 * meant the password was readable over the user's shoulder and was offered to
 * the browser as an ordinary autofill value.
 */
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      name: "",
      address: "",
      contactNumber: "",
      email: "",
      password: "",
      bloodType: "",
      error: null,
      submitting: false
    };

    this.register = this.register.bind(this);
    this.change = this.change.bind(this);
  }

  change(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  register(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }

    // Checked here so an obvious mistake does not cost a round trip. The same
    // rules are enforced on the server, which is the check that counts.
    if (this.state.username.trim().length < 3) {
      this.setState({ error: "Choose a username of at least 3 characters." });
      return;
    }
    if (this.state.password.length < 8) {
      this.setState({ error: "Choose a password of at least 8 characters." });
      return;
    }
    if (!this.state.name.trim()) {
      this.setState({ error: "Your name is required." });
      return;
    }

    this.setState({ submitting: true, error: null });

    AuthService.register({
      username: this.state.username.trim(),
      password: this.state.password,
      name: this.state.name.trim(),
      address: this.state.address,
      contactNumber: this.state.contactNumber,
      email: this.state.email,
      bloodType: this.state.bloodType
    })
      .then(() => {
        this.props.history.replace("/index-patient");
      })
      .catch((error) => {
        this.setState({
          submitting: false,
          error: messageFrom(error, "Could not create the account.")
        });
      });
  }

  render() {
    return (
      <form onSubmit={this.register}>
        {FIELDS.map((field) => (
          <div className="input-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              className="form-control"
              autoComplete={field.autoComplete}
              value={this.state[field.name]}
              onChange={this.change}
              disabled={this.state.submitting}
            />
          </div>
        ))}

        {this.state.error && (
          <div className="input-group" role="alert" style={{ color: "#c0392b" }}>
            {this.state.error}
          </div>
        )}

        <div className="input-group">
          <button type="submit" className="btn" disabled={this.state.submitting}>
            {this.state.submitting ? "Creating your account…" : "Register"}
          </button>
        </div>

        <p>
          Already a member? <Link to="/login-patient">Sign in</Link>
        </p>
      </form>
    );
  }
}

export default withRouter(RegisterForm);
