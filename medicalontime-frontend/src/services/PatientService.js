import api from './api';

class PatientService {
    // Staff only. A patient reads their own record through MeService.
    getPatients(){
        return api.get('/patients');
    }

    getPatientById(patientId){
        return api.get(`/patients/${patientId}`);
    }

    updatePatient(patient, patientId){
        return api.put(`/patients/${patientId}`, patient);
    }

    // Admin only. Public sign up goes through AuthService.register.
    createPatient(patient){
        return api.post('/patients', patient);
    }

    deletePatient(patientId){
        return api.delete(`/patients/${patientId}`);
    }
}

export default new PatientService()
