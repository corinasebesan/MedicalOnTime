import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import '../css/admin.css';
import AdminHeaderTitle from './components/AdminHeaderTitle';
import AdminHeaderMenu from './components/AdminHeaderMenu';
import IndexAdminAddDoctorHeader from './components/IndexAdminAddDoctorHeader';
import IndexAdminAddDoctorForm from './components/IndexAdminAddDoctorForm';
import IndexAdminDeleteDoctorHeader from './components/IndexAdminDeleteDoctorHeader';
import IndexAdminDeleteDoctorForm from './components/IndexAdminDeleteDoctorForm';

class IndexAdminComponent extends Component {
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
                    <IndexAdminAddDoctorHeader/>
                    <IndexAdminAddDoctorForm/>
                    <IndexAdminDeleteDoctorHeader/>
                    <IndexAdminDeleteDoctorForm/>
                </body>
            </div>
        );
    }
}

export default IndexAdminComponent;