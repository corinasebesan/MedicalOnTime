import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/login-patient.css';
import RegisterForm from './components/RegisterForm';
import RegisterHeader from './components/RegisterHeader';

class RegisterComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Patient</title>
                </Helmet>
                <div>
                    <RegisterHeader/>
                    <RegisterForm/>
                </div>
            </div>
        );
    }
}

export default RegisterComponent;