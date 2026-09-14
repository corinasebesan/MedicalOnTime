import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import BookAppointmentHeader from './components/BookAppointmentHeader';
import BookAppointmentForm from './components/BookAppointmentForm';

class BookAppointmentComponent extends Component {
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
                    <BookAppointmentHeader/>
                    <BookAppointmentForm/>
                </body>
            </div>
        );
    }
}

export default BookAppointmentComponent;