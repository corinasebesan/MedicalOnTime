import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/doctor.css';
import DoctorHeaderTitle from './components/DoctorHeaderTitle';
import DoctorHeaderMenu from './components/DoctorHeaderMenu';
import SearchPatientForm from './components/SearchPatientForm';

// The two result tables used to be rendered here as siblings of the form, with
// no way for the three to share anything. The form owns them now.
class SearchPatientComponent extends Component {
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
                <main>
                    <SearchPatientForm/>
                </main>
            </div>
        );
    }
}

export default SearchPatientComponent;
