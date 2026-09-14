import api from './api';

class AppointmentService {
    // Staff only. A patient or doctor reads their own through MeService.
    getAppointments(){
        return api.get('/appointments');
    }

    // The patient id is taken from the token server side, so it is not sent.
    createAppointment(appointment){
        return api.post('/appointments', appointment);
    }

    getAppointmentById(appointmentId){
        return api.get(`/appointments/${appointmentId}`);
    }

    updateAppointment(appointment, appointmentId){
        return api.put(`/appointments/${appointmentId}`, appointment);
    }

    deleteAppointment(appointmentId){
        return api.delete(`/appointments/${appointmentId}`);
    }
}

export default new AppointmentService()
