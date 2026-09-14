import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/admin.css';
import AdminHeaderTitle from './components/AdminHeaderTitle';
import AdminHeaderMenu from './components/AdminHeaderMenu';
import ViewDoctorAdminHeader from './components/ViewDoctorAdminHeader';
import ViewDoctorAdminTable from './components/ViewDoctorAdminTable';

class ViewDoctorController extends Component {
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
                    <ViewDoctorAdminHeader/>
                    <ViewDoctorAdminTable/>
                </body>
            </div>
        );
    }
}

export default ViewDoctorController;