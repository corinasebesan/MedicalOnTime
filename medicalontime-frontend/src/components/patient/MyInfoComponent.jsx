import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import MyInfoTitle from './components/MyInfoTitle';
import IndexPatientForm from './components/IndexPatientForm';
import MyInfoTreatmentHistoryTable from './components/MyInfoTreatmentHistoryTable';

class MyInfoComponent extends Component {
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
                    <MyInfoTitle/>
                    <IndexPatientForm/>
                    <MyInfoTreatmentHistoryTable/>
                </body>
            </div>
        );
    }
}

export default MyInfoComponent;