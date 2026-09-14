import api from './api';

/**
 * The caller's own records.
 *
 * None of these take an id. The server reads the identity from the token, so
 * these screens cannot be pointed at somebody else's data by editing a request.
 */
class MeService {
    getProfile(){
        return api.get('/me');
    }

    getAppointments(){
        return api.get('/me/appointments');
    }

    getDescriptions(){
        return api.get('/me/descriptions');
    }
}

export default new MeService()
