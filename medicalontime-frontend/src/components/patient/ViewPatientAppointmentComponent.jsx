import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import ViewAppointmentTitle from './components/ViewAppointmentTitle';
import ViewAppointmentTable from './components/ViewAppointmentTable';

class ViewPatientAppointmentComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Patient</title>
                </Helmet>
                <header>
                    <PatientHeaderTitle/>
                    <PatientHeaderMenu/>
                </header>
                <body>
                    <ViewAppointmentTitle/>
                    <ViewAppointmentTable/>
                </body>
            </div>
        );
    }
}

export default ViewPatientAppointmentComponent;