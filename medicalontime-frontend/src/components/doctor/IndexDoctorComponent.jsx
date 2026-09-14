import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/doctor.css';
import DoctorHeaderTitle from './components/DoctorHeaderTitle';
import DoctorHeaderMenu from './components/DoctorHeaderMenu';
import IndexDoctorHeader from './components/IndexDoctorHeader';
import IndexDoctorForm from './components/IndexDoctorForm';

class IndexDoctorComponent extends Component {
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
                    <IndexDoctorHeader/>
                    <IndexDoctorForm/>
                </body>
            </div>
        );
    }
}

export default IndexDoctorComponent;