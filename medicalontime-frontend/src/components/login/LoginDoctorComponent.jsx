import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/login-doctor.css';
import LoginDoctorForm from './components/LoginDoctorForm';
import LoginDoctorHeader from './components/LoginDoctorHeader';

class LoginDoctorComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Doctor</title>
                </Helmet>
                <div className="Dbody">
                    <LoginDoctorHeader/>
                    <LoginDoctorForm/>
                </div>
            </div>
        );
    }
}

export default LoginDoctorComponent;