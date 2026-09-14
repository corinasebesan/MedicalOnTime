import api from './api';

class DoctorService {
    getDoctors(){
        return api.get('/doctors');
    }

    getDoctorById(doctorId){
        return api.get(`/doctors/${doctorId}`);
    }

    createDoctor(doctor){
        return api.post('/doctors', doctor);
    }

    updateDoctor(doctor, doctorId){
        return api.put(`/doctors/${doctorId}`, doctor);
    }

    deleteDoctor(doctorId){
        return api.delete(`/doctors/${doctorId}`);
    }
}

export default new DoctorService()
