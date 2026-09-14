import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/doctor.css';
import DoctorHeaderTitle from './components/DoctorHeaderTitle';
import DoctorHeaderMenu from './components/DoctorHeaderMenu';
import DoctorAppointmentTitle from './components/DoctorAppointmentTitle';
import DoctorAppointmentTable from './components/DoctorAppointmentTable';

class DoctorAppointmentComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Doctor</title>
                </Helmet>
                <header>
                    <DoctorHeaderTitle/>
                    <DoctorHeaderMenu/>
                </header>
                <body>
                    <DoctorAppointmentTitle/>
                    <DoctorAppointmentTable/>
                </body>
            </div>
        );
    }
}

export default DoctorAppointmentComponent;