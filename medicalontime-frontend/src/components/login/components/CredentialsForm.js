import React from "react";
import { withRouter } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { messageFrom } from "../../../services/api";

/**
 * The sign in form, shared by the patient, doctor and admin pages.
 *
 * The three screens differ only in their stylesheet class names and in which
 * account table the credentials are checked against, so they pass those in
 * rather than each keeping a copy of the same logic. The original three files
 * had drifted apart already, which is how one of them ended up sending the
 * password under a different field name.
 *
 * Wrapped in withRouter because the parent pages render this without passing
 * history down, which is why the original navigation call threw.
 */
class CredentialsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: null,
      submitting: false
    };

    this.submit = this.submit.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changeUsername(event) {
    this.setState({ username: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  submit(event) {
    event.preventDefault();
    if (this.state.submitting) {
      return;
    }

    const username = this.state.username.trim();
    if (!username || !this.state.password) {
      this.setState({ error: "Enter your username and password." });
      return;
    }

    this.setState({ submitting: true, error: null });

    AuthService.login(this.props.role, username, this.state.password)
      .then(() => {
        this.props.history.replace(AuthService.homePath());
      })
      .catch((error) => {
        this.setState({
          submitting: false,
          // The server answers a wrong username and a wrong password
          // identically, so this message is whatever it said rather than a
          // guess about which field was at fault.
          error: messageFrom(error, "Wrong username or password.")
        });
      });
  }

  render() {
    const {
      formClassName,
      groupClassName,
      buttonClassName,
      usernameLabel,
      footer
    } = this.props;

    return (
      <form className={formClassName} onSubmit={this.submit}>
        <div className={groupClassName}>
          <label htmlFor="username">{usernameLabel}</label>
          <input
            id="username"
            type="text"
            name="username"
            className="id"
            autoComplete="username"
            value={this.state.username}
            onChange={this.changeUsername}
            disabled={this.state.submitting}
          />
        </div>

        <div className={groupClassName}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="password"
            autoComplete="current-password"
            value={this.state.password}
            onChange={this.changePassword}
            disabled={this.state.submitting}
          />
        </div>

        {this.state.error && (
          <div className={groupClassName} role="alert" style={{ color: "#c0392b" }}>
            {this.state.error}
          </div>
        )}

        <div className={groupClassName}>
          <button type="submit" className={buttonClassName} disabled={this.state.submitting}>
            {this.state.submitting ? "Signing in…" : "Login"}
          </button>
        </div>

        {footer}
      </form>
    );
  }
}

export default withRouter(CredentialsForm);
