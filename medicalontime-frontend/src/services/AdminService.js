import api from './api';

class AdminService {
    // An admin may read only their own row, so the id has to match the token.
    getAdminById(adminId){
        return api.get(`/admins/${adminId}`);
    }
}

export default new AdminService()
