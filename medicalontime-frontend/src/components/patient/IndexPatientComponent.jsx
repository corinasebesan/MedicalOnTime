import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import IndexPatientHeader from './components/IndexPatientHeader';
import IndexPatientForm from './components/IndexPatientForm';

class IndexPatientComponent extends Component {
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
                    <IndexPatientHeader/>
                    <IndexPatientForm/>
                </body>
            </div>
        );
    }
}

export default IndexPatientComponent;