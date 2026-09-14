import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/patient.css';
import PatientHeaderTitle from './components/PatientHeaderTitle';
import PatientHeaderMenu from './components/PatientHeaderMenu';
import SearchDoctorForm from './components/SearchDoctorForm';

// The results table used to be rendered here as a sibling of the form, with no
// way for the two to share anything. The form owns it now.
class SearchDoctorComponent extends Component {
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
                <main>
                    <SearchDoctorForm/>
                </main>
            </div>
        );
    }
}

export default SearchDoctorComponent;
