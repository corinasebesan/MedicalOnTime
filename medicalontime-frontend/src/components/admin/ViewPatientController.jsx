import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/admin.css';
import AdminHeaderTitle from './components/AdminHeaderTitle';
import AdminHeaderMenu from './components/AdminHeaderMenu';
import ViewPatientsAdminHeader from './components/ViewPatientsAdminHeader';
import ViewPatientsAdminTable from './components/ViewPatientsAdminTable';

class ViewPatientController extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Admin</title>
                </Helmet>
                <header>
                    <AdminHeaderTitle/>
                    <AdminHeaderMenu/>
                </header>
                <body>
                    <ViewPatientsAdminHeader/>
                    <ViewPatientsAdminTable/>
                </body>
            </div>
        );
    }
}

export default ViewPatientController;