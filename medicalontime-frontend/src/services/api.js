import axios from 'axios';
import AuthService from './AuthService';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * The single axios instance every service uses.
 *
 * Attaching the token here rather than at each call site means there is no way
 * to add a new request and forget the header, which is the usual way an
 * authenticated app ends up with one unauthenticated endpoint.
 */
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;

    // An expired or rejected token leaves the app showing a signed in shell
    // with nothing in it. Clear the session and send the user back to the
    // front door instead. A failed sign in attempt is excluded, because there
    // the 401 is the answer to the question being asked.
    const isLoginAttempt =
      error.config && error.config.url && error.config.url.indexOf('/auth/') === 0;

    if (status === 401 && !isLoginAttempt) {
      AuthService.clear();
      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
    }

    return Promise.reject(error);
  }
);

/** Pulls the server's message out of the error envelope, with a readable fallback. */
export function messageFrom(error, fallback = 'Something went wrong. Please try again.') {
  if (error && error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error && error.message === 'Network Error') {
    return 'Cannot reach the server. Is the backend running?';
  }
  return fallback;
}

export default api;
