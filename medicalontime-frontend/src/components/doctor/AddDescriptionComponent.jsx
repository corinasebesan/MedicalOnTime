import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/doctor.css';
import DoctorHeaderTitle from './components/DoctorHeaderTitle';
import DoctorHeaderMenu from './components/DoctorHeaderMenu';
import AddDescriptionForm from './components/AddDescriptionForm';

class AddDescriptionComponent extends Component {
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
                    <AddDescriptionForm/>
                </body>
            </div>
        );
    }
}

export default AddDescriptionComponent;