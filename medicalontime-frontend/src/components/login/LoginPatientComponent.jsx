import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/login-patient.css';
import LoginPatientForm from './components/LoginPatientForm';
import LoginPatientHeader from './components/LoginPatientHeader';

class LoginPatientComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Patient</title>
                </Helmet>
                <div>
                    <LoginPatientHeader/>
                    <LoginPatientForm/>
                </div>
            </div>
        );
    }
}

export default LoginPatientComponent;