import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/admin.css';
import AdminHeaderTitle from './components/AdminHeaderTitle';
import AdminHeaderMenu from './components/AdminHeaderMenu';
import ViewAppointmentsAdminHeader from './components/ViewAppointmentsAdminHeader';
import ViewAppointmentsAdminTable from './components/ViewAppointmentsAdminTable';

class ViewAppointmentComponent extends Component {
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
                    <ViewAppointmentsAdminHeader/>
                    <ViewAppointmentsAdminTable/>
                </body>
            </div>
        );
    }
}

export default ViewAppointmentComponent;