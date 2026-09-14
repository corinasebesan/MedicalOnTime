import './App.css';
import UserSelectionMenuComponent from './components/UserSelectionMenuComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginAdminComponent from './components/login/LoginAdminComponent';
import LoginPatientComponent from './components/login/LoginPatientComponent';
import LoginDoctorComponent from './components/login/LoginDoctorComponent';
import RegisterComponent from './components/login/RegisterComponent';
import IndexAdminComponent from './components/admin/IndexAdminComponent';
import IndexPatientComponent from './components/patient/IndexPatientComponent';
import IndexDoctorComponent from './components/doctor/IndexDoctorComponent';
import ViewAppointmentComponent from './components/admin/ViewAppointmentComponent';
import ViewDoctorController from './components/admin/ViewDoctorController';
import ViewPatientController from './components/admin/ViewPatientController';
import AddDescriptionComponent from './components/doctor/AddDescriptionComponent';
import DoctorAppointmentComponent from './components/doctor/DoctorAppointmentComponent';
import SearchPatientComponent from './components/doctor/SearchPatientComponent';
import BookAppointmentComponent from './components/patient/BookAppointmentComponent';
import CancelBookingComponent from './components/patient/CancelBookingComponent';
import SearchDoctorComponent from './components/patient/SearchDoctorComponent';
import ViewPatientAppointmentComponent from './components/patient/ViewPatientAppointmentComponent';
import MyInfoComponent from './components/patient/MyInfoComponent';

/**
 * Every screen behind a login is a PrivateRoute carrying the roles allowed to
 * see it. Signed out visitors are sent to the front door; a signed in user who
 * types somebody else's dashboard into the address bar is sent back to their
 * own.
 *
 * These guards decide what renders, not what is permitted. The API checks the
 * token and the role on every request, so a tampered session gets an empty
 * screen rather than somebody else's data.
 */
function App() {
  return (
    <div>
      <Router>
        <div className="container">
          <Switch>
            <Route path="/" exact component={UserSelectionMenuComponent} />
            <Route path="/login-admin" component={LoginAdminComponent} />
            <Route path="/login-patient" component={LoginPatientComponent} />
            <Route path="/register" component={RegisterComponent} />
            <Route path="/login-doctor" component={LoginDoctorComponent} />

            <PrivateRoute
              path="/index-admin"
              exact
              roles={['ADMIN']}
              component={IndexAdminComponent}
            />
            <PrivateRoute
              path="/index-admin/view-appointment"
              roles={['ADMIN']}
              component={ViewAppointmentComponent}
            />
            <PrivateRoute
              path="/index-admin/view-doctor"
              roles={['ADMIN']}
              component={ViewDoctorController}
            />
            <PrivateRoute
              path="/index-admin/view-patient"
              roles={['ADMIN']}
              component={ViewPatientController}
            />

            <PrivateRoute
              path="/index-patient"
              exact
              roles={['PATIENT']}
              component={IndexPatientComponent}
            />
            <PrivateRoute
              path="/index-patient/booking-appointment"
              roles={['PATIENT']}
              component={BookAppointmentComponent}
            />
            <PrivateRoute
              path="/index-patient/cancel-booking"
              roles={['PATIENT']}
              component={CancelBookingComponent}
            />
            <PrivateRoute
              path="/index-patient/search-doctor"
              roles={['PATIENT']}
              component={SearchDoctorComponent}
            />
            <PrivateRoute
              path="/index-patient/view-appointment"
              roles={['PATIENT']}
              component={ViewPatientAppointmentComponent}
            />
            <PrivateRoute
              path="/index-patient/my-info"
              roles={['PATIENT']}
              component={MyInfoComponent}
            />

            <PrivateRoute
              path="/index-doctor"
              exact
              roles={['DOCTOR']}
              component={IndexDoctorComponent}
            />
            <PrivateRoute
              path="/index-doctor/add-description"
              roles={['DOCTOR']}
              component={AddDescriptionComponent}
            />
            <PrivateRoute
              path="/index-doctor/doctor-appointment"
              roles={['DOCTOR']}
              component={DoctorAppointmentComponent}
            />
            <PrivateRoute
              path="/index-doctor/search-patient"
              roles={['DOCTOR']}
              component={SearchPatientComponent}
            />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
