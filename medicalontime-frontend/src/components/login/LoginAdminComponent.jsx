import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/login-admin.css';
import LoginAdminForm from './components/LoginAdminForm';
import LoginAdminHeader from './components/LoginAdminHeader';

class LoginAdminComponent extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Admin</title>
                </Helmet>
                <div className="Abody">
                    <LoginAdminHeader/>
                    <LoginAdminForm/>
                </div>
            </div>
        );
    }
}

export default LoginAdminComponent;