import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
const STORAGE_KEY = 'medicalontime.session';

/**
 * Holds the signed in session.
 *
 * The token lives in localStorage, which is the usual trade for a separately
 * hosted single page app: it survives a refresh and needs no cookie handling,
 * at the cost of being readable by any script that gets onto the page. An
 * httpOnly cookie would be the stronger choice and is the change I would make
 * before this ran anywhere real; it is noted in the README rather than left
 * implied.
 *
 * Nothing here is a security boundary. The token is what the server checks, and
 * everything this file reads out of it is only used to decide what to render.
 */
class AuthService {
  /** Sign in against one of the three account tables. */
  login(role, username, password) {
    // Deliberately the bare axios rather than the shared instance: there is no
    // token to attach yet, and the 401 on a wrong password must reach the form
    // rather than trigger the signed out redirect.
    return axios
      .post(`${BASE_URL}/auth/login`, { role, username, password })
      .then((response) => this.store(response.data));
  }

  /** Public sign up, which creates a patient and signs them straight in. */
  register(details) {
    return axios
      .post(`${BASE_URL}/auth/register`, details)
      .then((response) => this.store(response.data));
  }

  logout() {
    this.clear();
  }

  store(session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  session() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      // Corrupt or unreadable storage is treated as signed out rather than
      // crashing the whole app on load.
      return null;
    }
  }

  getToken() {
    const session = this.session();
    return session ? session.token : null;
  }

  getRole() {
    const session = this.session();
    return session ? session.role : null;
  }

  getAccountId() {
    const session = this.session();
    return session ? session.accountId : null;
  }

  isSignedIn() {
    return Boolean(this.getToken());
  }

  hasRole(role) {
    return this.getRole() === role;
  }

  /** Where a signed in user of each role belongs. */
  homePath() {
    switch (this.getRole()) {
      case 'ADMIN':
        return '/index-admin';
      case 'DOCTOR':
        return '/index-doctor';
      case 'PATIENT':
        return '/index-patient';
      default:
        return '/';
    }
  }
}

export default new AuthService();
