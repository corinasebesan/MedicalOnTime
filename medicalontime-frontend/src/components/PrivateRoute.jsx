import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * A route that renders only for a signed in user holding the right role.
 *
 * This is a convenience, not a control. Anyone can edit their own browser
 * storage and get the screen to draw; what they cannot do is make the API
 * answer, because every endpoint behind these screens checks the token and the
 * role server side. The guard exists so a signed out user sees the login page
 * instead of an empty dashboard full of failed requests.
 */
export default function PrivateRoute({ component: Component, roles, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!AuthService.isSignedIn()) {
          return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
        }
        if (roles && roles.indexOf(AuthService.getRole()) === -1) {
          return <Redirect to={AuthService.homePath()} />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
