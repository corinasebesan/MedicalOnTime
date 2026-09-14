import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import CancelBookingForm from './components/CancelBookingForm';

class CancelBookingComponent extends Component {
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
                    <CancelBookingForm/>
                </body>
            </div>
        );
    }
}

export default CancelBookingComponent;